const fs = require('fs');
const path = require('path');
const { PROJECT_ROOT, pathInProject, writeProjectFile } = require('./fs');
const { loadUserConfig, getEffectiveConfig, getConfigSurfaceDiagnostics, loadBuildManifest } = require('./config');

function resolveExistingPath(input, fallbacks = []) {
  const candidates = [];
  if (input) {
    candidates.push(path.isAbsolute(input) ? input : pathInProject(input));
  }
  for (const item of fallbacks) {
    candidates.push(path.isAbsolute(item) ? item : pathInProject(item));
  }
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function flattenTokens(value, prefix = '', acc = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenTokens(item, prefix ? `${prefix}.${index}` : String(index), acc));
    return acc;
  }
  if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => flattenTokens(value[key], prefix ? `${prefix}.${key}` : key, acc));
    return acc;
  }
  acc[prefix] = value;
  return acc;
}

function getByPath(object, dotPath) {
  if (!dotPath) return object;
  return dotPath.split('.').reduce((acc, part) => (acc && Object.prototype.hasOwnProperty.call(acc, part) ? acc[part] : undefined), object);
}

function pad(value, length) {
  return String(value).padEnd(length, ' ');
}

function printKeyValueTable(rows) {
  if (!rows.length) {
    console.log('[rarog] no rows');
    return;
  }
  const c1 = Math.max(...rows.map((row) => row[0].length), 8);
  const c2 = Math.max(...rows.map((row) => row[1].length), 8);
  rows.forEach((row, index) => {
    if (index === 0) {
      console.log(`${pad(row[0], c1)}  ${pad(row[1], c2)}  ${row[2]}`);
      console.log(`${'-'.repeat(c1)}  ${'-'.repeat(c2)}  ${'-'.repeat(Math.max(10, row[2].length))}`);
      return;
    }
    console.log(`${pad(row[0], c1)}  ${pad(row[1], c2)}  ${row[2]}`);
  });
}

function cmdTokenInspect(args = []) {
  const input = args.find((arg) => !arg.startsWith('--'));
  const pathArg = getOption(args, '--path');
  const format = getOption(args, '--format', 'table');
  const filePath = resolveExistingPath(input, ['rarog.tokens.json', 'rarog.config.json']);
  if (!filePath) {
    console.error('[rarog] token inspect: token file not found. Pass a file path or create rarog.tokens.json.');
    process.exit(1);
  }
  const data = readJson(filePath);
  const selected = pathArg ? getByPath(data, pathArg) : data;
  if (selected === undefined) {
    console.error(`[rarog] token inspect: path not found: ${pathArg}`);
    process.exit(1);
  }
  if (format === 'json') {
    console.log(JSON.stringify(selected, null, 2));
    return;
  }
  const flat = flattenTokens(selected);
  const entries = Object.entries(flat);
  console.log(`[rarog] token inspect: ${path.relative(PROJECT_ROOT, filePath)} (${entries.length} leaf tokens)`);
  entries.slice(0, Number(getOption(args, '--limit', '80'))).forEach(([key, value]) => {
    console.log(`  ${pathArg ? `${pathArg}.` : ''}${key} = ${value}`);
  });
  if (entries.length > Number(getOption(args, '--limit', '80'))) {
    console.log(`  ... and ${entries.length - Number(getOption(args, '--limit', '80'))} more`);
  }
}

function cmdTokenDiff(args = []) {
  const files = args.filter((arg) => !arg.startsWith('--'));
  if (files.length < 2) {
    console.error('[rarog] token diff: provide two token JSON files');
    process.exit(1);
  }
  const leftPath = resolveExistingPath(files[0]);
  const rightPath = resolveExistingPath(files[1]);
  if (!leftPath || !rightPath) {
    console.error('[rarog] token diff: one of the files does not exist');
    process.exit(1);
  }
  const left = flattenTokens(readJson(leftPath));
  const right = flattenTokens(readJson(rightPath));
  const keys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)])).sort();
  const rows = [['token', 'status', 'values']];
  let changeCount = 0;
  keys.forEach((key) => {
    const a = left[key];
    const b = right[key];
    if (a === b) return;
    changeCount += 1;
    let status = 'changed';
    if (a === undefined) status = 'added';
    if (b === undefined) status = 'removed';
    rows.push([key, status, `${a === undefined ? '∅' : a} -> ${b === undefined ? '∅' : b}`]);
  });
  console.log(`[rarog] token diff: ${changeCount} changes between ${path.basename(leftPath)} and ${path.basename(rightPath)}`);
  if (rows.length === 1) {
    console.log('  no token changes');
    return;
  }
  printKeyValueTable(rows.slice(0, Number(getOption(args, '--limit', '60')) + 1));
}

function normalizeThemeInput(filePath) {
  const raw = readJson(filePath);
  if (raw.semantic || raw.runtime || raw.selectors) return raw;
  const effective = getEffectiveConfig();
  const colors = ((raw.theme || raw).colors) || ((effective.theme || {}).colors) || {};
  const radius = ((raw.theme || raw).radius) || ((effective.theme || {}).radius) || {};
  const shadow = ((raw.theme || raw).shadow) || ((effective.theme || {}).shadow) || {};
  return {
    name: path.basename(filePath, path.extname(filePath)),
    semantic: { color: colors.semantic || {} },
    runtime: {
      shape: { default: { control: radius.md || radius.lg || '0.5rem', surface: radius.xl || '1rem', pill: radius.full || '9999px' } },
      shadow: { default: { sm: shadow.sm || '', md: shadow.md || '' } }
    }
  };
}

function cmdThemeDiff(args = []) {
  const files = args.filter((arg) => !arg.startsWith('--'));
  if (files.length < 2) {
    console.error('[rarog] theme diff: provide two theme manifest files');
    process.exit(1);
  }
  const leftPath = resolveExistingPath(files[0]);
  const rightPath = resolveExistingPath(files[1]);
  if (!leftPath || !rightPath) {
    console.error('[rarog] theme diff: one of the theme files does not exist');
    process.exit(1);
  }
  const left = normalizeThemeInput(leftPath);
  const right = normalizeThemeInput(rightPath);
  const flatLeft = flattenTokens({ semantic: left.semantic || {}, runtime: left.runtime || {} });
  const flatRight = flattenTokens({ semantic: right.semantic || {}, runtime: right.runtime || {} });
  const keys = Array.from(new Set([...Object.keys(flatLeft), ...Object.keys(flatRight)])).sort();
  const rows = [['token', 'status', 'values']];
  let changeCount = 0;
  keys.forEach((key) => {
    const a = flatLeft[key];
    const b = flatRight[key];
    if (a === b) return;
    changeCount += 1;
    const status = a === undefined ? 'added' : (b === undefined ? 'removed' : 'changed');
    rows.push([key, status, `${a === undefined ? '∅' : a} -> ${b === undefined ? '∅' : b}`]);
  });
  console.log(`[rarog] theme diff: ${left.name || path.basename(leftPath)} -> ${right.name || path.basename(rightPath)}`);
  console.log(`  changed theme keys: ${changeCount}`);
  if (rows.length > 1) printKeyValueTable(rows.slice(0, Number(getOption(args, '--limit', '50')) + 1));
}

function toKebabCase(input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function cmdComponentScaffold(args = []) {
  const name = args.find((arg) => !arg.startsWith('--'));
  if (!name) {
    console.error('[rarog] component scaffold: provide a component name, e.g. rarog component scaffold PricingCard');
    process.exit(1);
  }
  const targetDir = getOption(args, '--dir', 'src/components');
  const style = getOption(args, '--style', 'css-module');
  const kebab = toKebabCase(name);
  const componentDir = pathInProject(path.join(targetDir, name));
  fs.mkdirSync(componentDir, { recursive: true });
  const ext = getOption(args, '--framework', 'react') === 'vue' ? 'vue' : 'tsx';
  const componentFile = path.join(componentDir, `${name}.${ext}`);
  const styleFile = path.join(componentDir, style === 'css' ? `${kebab}.css` : `${name}.module.css`);
  const testFile = path.join(componentDir, `${name}.spec.ts`);
  const storyFile = path.join(componentDir, `${name}.stories.ts`);
  const styleImport = style === 'css' ? `import './${kebab}.css';` : `import styles from './${name}.module.css';`;
  const rootClass = style === 'css' ? `${kebab}` : '{styles.root}';
  fs.writeFileSync(componentFile, `import React from 'react';\n${styleImport}\n\nexport interface ${name}Props {\n  title?: string;\n  description?: string;\n}\n\nexport function ${name}({ title = '${name}', description = 'Scaffolded by Rarog средство командной строки Pro.' }: ${name}Props) {\n  return (\n    <section className=${style === 'css' ? `'${kebab}'` : rootClass}>\n      <div className=\"card\">\n        <div className=\"card-body\">\n          <h3 className=\"h6 mb-2\">{title}</h3>\n          <p className=\"text-muted mb-0\">{description}</p>\n        </div>\n      </div>\n    </section>\n  );\n}\n\nexport default ${name};\n`, 'utf8');
  fs.writeFileSync(styleFile, style === 'css'
    ? `.${kebab} {\n  display: block;\n}\n`
    : `.root {\n  display: block;\n}\n`, 'utf8');
  fs.writeFileSync(testFile, `import { describe, it, expect } from 'vitest';\n\ndescribe('${name}', () => {\n  it('has a scaffold placeholder', () => {\n    expect('${name}').toBeTruthy();\n  });\n});\n`, 'utf8');
  fs.writeFileSync(storyFile, `import type { Meta, StoryObj } from '@storybook/react';\nimport { ${name} } from './${name}.${ext}';\n\nconst meta: Meta<typeof ${name}> = {\n  title: 'Scaffold/${name}',\n  component: ${name}\n};\n\nexport default meta;\nexport const Default: StoryObj<typeof ${name}> = {};\n`, 'utf8');
  console.log(`[rarog] component scaffold: created ${path.relative(PROJECT_ROOT, componentDir)}`);
}

function collectFilesByExtensions(rootDir, extensions) {
  const results = [];
  function walk(current) {
    if (!fs.existsSync(current)) return;
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      fs.readdirSync(current).forEach((item) => walk(path.join(current, item)));
      return;
    }
    if (extensions.includes(path.extname(current))) results.push(current);
  }
  walk(rootDir);
  return results;
}

function cmdAuditA11y(args = []) {
  const target = resolveExistingPath(args.find((arg) => !arg.startsWith('--')), ['src', 'examples']);
  if (!target) {
    console.error('[rarog] audit a11y: target not found');
    process.exit(1);
  }
  const files = collectFilesByExtensions(target, ['.html', '.tsx', '.jsx', '.vue']);
  const issues = [];
  files.forEach((file) => {
    const source = fs.readFileSync(file, 'utf8');
    const rel = path.relative(PROJECT_ROOT, file);
    const imgMatches = source.match(/<img\b(?![^>]*\balt=)[^>]*>/g) || [];
    imgMatches.forEach(() => issues.push([rel, 'img-alt', '<img> missing alt attribute']));
    const buttonMatches = source.match(/<button[^>]*>\s*<\/button>/g) || [];
    buttonMatches.forEach(() => issues.push([rel, 'button-name', 'button without accessible text']));
    const inputMatches = source.match(/<input(?![^>]*(aria-label|aria-labelledby|id=))[^>]*>/g) || [];
    inputMatches.forEach(() => issues.push([rel, 'input-label', 'input may be missing label/id']));
    const colorOnly = source.match(/text-muted[^\n]*badge-danger|badge-success[^\n]*text-muted/g) || [];
    colorOnly.forEach(() => issues.push([rel, 'color-reliance', 'status UI may rely only on color']));
  });
  console.log(`[rarog] audit a11y: scanned ${files.length} files`);
  if (!issues.length) {
    console.log('  no obvious static issues found');
    return;
  }
  printKeyValueTable([['file', 'rule', 'message'], ...issues.slice(0, Number(getOption(args, '--limit', '80')))]);
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function cmdAuditBundle(args = []) {
  const target = resolveExistingPath(args.find((arg) => !arg.startsWith('--')), ['dist', 'packages']);
  if (!target) {
    console.error('[rarog] audit bundle: target not found');
    process.exit(1);
  }
  const files = collectFilesByExtensions(target, ['.css', '.js', '.mjs', '.cjs']);
  const report = files.map((file) => ({ file, size: fs.statSync(file).size })).sort((a, b) => b.size - a.size);
  const total = report.reduce((sum, item) => sum + item.size, 0);
  console.log(`[rarog] audit bundle: ${report.length} files, total ${humanSize(total)}`);
  printKeyValueTable([
    ['file', 'size', 'status'],
    ...report.slice(0, Number(getOption(args, '--limit', '25'))).map((item) => [path.relative(PROJECT_ROOT, item.file), humanSize(item.size), item.size > 50 * 1024 ? 'review' : 'ok'])
  ]);
}

function cmdDoctorPro() {
  const surface = getConfigSurfaceDiagnostics();
  const effective = getEffectiveConfig();
  const manifest = loadBuildManifest();
  const warnings = [];
  const info = [];
  if (!surface.selectedThemeConfig) warnings.push('theme config not found; using built-in defaults');
  if (!surface.selectedBuildManifest) warnings.push('build manifest not found; using built-in defaults');
  const pluginCount = Array.isArray(effective.plugins) ? effective.plugins.length : 0;
  info.push(['plugins', String(pluginCount), pluginCount ? 'configured' : 'none']);
  const contentCount = Array.isArray(effective.content) ? effective.content.length : 0;
  info.push(['content globs', String(contentCount), contentCount ? 'configured' : 'missing']);
  const outputs = manifest && manifest.outputs ? Object.keys(manifest.outputs).join(', ') : 'none';
  info.push(['build outputs', outputs, outputs === 'none' ? 'missing' : 'ok']);
  const tokenFile = resolveExistingPath(null, ['rarog.tokens.json']);
  info.push(['token snapshot', tokenFile ? path.relative(PROJECT_ROOT, tokenFile) : 'missing', tokenFile ? 'ok' : 'optional']);
  console.log('[rarog] doctor');
  printKeyValueTable([['check', 'value', 'status'], ...info]);
  if (warnings.length) {
    warnings.forEach((warning) => console.log(`  [warn] ${warning}`));
  } else {
    console.log('  all core checks passed');
  }
}

function getOption(args, name, fallback = undefined) {
  const direct = args.find((arg) => arg.startsWith(`${name}=`));
  if (direct) return direct.slice(name.length + 1);
  const index = args.indexOf(name);
  if (index >= 0 && args[index + 1]) return args[index + 1];
  return fallback;
}

module.exports = {
  cmdTokenInspect,
  cmdTokenDiff,
  cmdThemeDiff,
  cmdComponentScaffold,
  cmdAuditA11y,
  cmdAuditBundle,
  cmdDoctorPro,
  flattenTokens,
  normalizeThemeInput,
  resolveExistingPath
};
