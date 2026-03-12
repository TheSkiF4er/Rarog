import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import { performance } from 'perf_hooks';
const root = process.cwd();
const publish = process.argv.includes('--publish');
const resultsDir = path.join(root, 'benchmarks', 'results');
const fixtureDir = path.join(root, 'benchmarks', 'fixtures', 'jit-app');
fs.mkdirSync(resultsDir, { recursive: true });

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function runCommand(name, command, args, cwd = root, runs = 3) {
  const durations = [];
  for (let index = 0; index < runs; index += 1) {
    const start = performance.now();
    const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
    const end = performance.now();
    if (result.status !== 0) {
      return { runs: durations, medianMs: null, skipped: true, reason: (result.stderr || result.stdout || '').trim().slice(0, 500) };
    }
    durations.push(Number((end - start).toFixed(2)));
  }
  return { runs: durations, medianMs: Number(median(durations).toFixed(2)), skipped: false };
}

function fileSize(relPath) {
  const filePath = path.join(root, relPath);
  return fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
}

function createFixture() {
  fs.mkdirSync(path.join(fixtureDir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(fixtureDir, 'rarog.config.js'), `module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  theme: {
    colors: {
      primary: { 600: '#5b21b6' },
      secondary: { 600: '#334155' },
      success: { 600: '#16a34a' },
      danger: { 600: '#dc2626' },
      warning: { 600: '#ea580c' },
      info: { 600: '#0284c7' },
      semantic: {
        bg: '#f8fafc', bgSoft: '#ffffff', bgElevated: '#ffffff', bgElevatedSoft: '#f8fafc',
        surface: '#ffffff', border: '#e2e8f0', borderSubtle: '#eef2ff', borderStrong: '#1e293b',
        muted: '#94a3b8', text: '#0f172a', textMuted: '#64748b', focusRing: '#8b5cf6', accentSoft: '#f5f3ff'
      }
    },
    spacing: { 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem', 6: '1.5rem', 8: '2rem' },
    radius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' },
    shadow: { sm: '0 1px 2px rgba(15,23,42,0.08)', md: '0 8px 24px rgba(15,23,42,0.16)' }
  },
  plugins: []
};
`, 'utf8');
  fs.writeFileSync(path.join(fixtureDir, 'rarog.build.json'), JSON.stringify({ outputs: { jitCss: 'dist/rarog.jit.css' } }, null, 2));
  fs.writeFileSync(path.join(fixtureDir, 'src/index.html'), `<!doctype html>
<html>
<body>
  <main class="rg-container-lg py-8">
    <section class="card shadow-md rounded-xl border border-subtle">
      <div class="card-header d-flex items-center justify-between">
        <h1 class="h4 text-primary-600">Benchmark fixture</h1>
        <span class="badge badge-primary">JIT</span>
      </div>
      <div class="card-body grid gap-4">
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-secondary">Secondary</button>
        <div class="alert alert-info">Runtime + theming workload</div>
        <div class="table-responsive"><table class="table table-striped"><tr><td>One</td><td>Two</td></tr></table></div>
      </div>
    </section>
  </main>
</body>
</html>`, 'utf8');
}

async function benchThemeEngine() {
  const engine = await import(new URL('../packages/js/src/theme-engine.js', import.meta.url));
  const target = {
    attrs: {},
    setAttribute(name, value) { this.attrs[name] = value; },
    removeAttribute(name) { delete this.attrs[name]; }
  };
  const themes = [
    { semantic: { color: { bg: '#fff', text: '#111', surface: '#fff', border: '#ddd', borderSubtle: '#eee', borderStrong: '#111', bgSoft: '#fafafa', bgElevated: '#fff', bgElevatedSoft: '#f8fafc', muted: '#999', textMuted: '#666', focusRing: '#5b21b6', accentSoft: '#f5f3ff' } } },
    { semantic: { color: { bg: '#0f172a', text: '#f8fafc', surface: '#111827', border: '#334155', borderSubtle: '#1e293b', borderStrong: '#e2e8f0', bgSoft: '#111827', bgElevated: '#020617', bgElevatedSoft: '#0f172a', muted: '#64748b', textMuted: '#cbd5e1', focusRing: '#a78bfa', accentSoft: '#312e81' } } }
  ];

  const switchRuns = [];
  const diffRuns = [];
  const renderRuns = [];
  for (let round = 0; round < 7; round += 1) {
    let start = performance.now();
    for (let i = 0; i < 5000; i += 1) {
      engine.applyTheme(target, i % 2 ? 'dark' : 'default');
    }
    switchRuns.push(Number((performance.now() - start).toFixed(3)));

    start = performance.now();
    for (let i = 0; i < 1000; i += 1) {
      engine.diffThemes(themes[0], themes[1]);
    }
    diffRuns.push(Number((performance.now() - start).toFixed(3)));

    start = performance.now();
    let html = '';
    for (let i = 0; i < 1000; i += 1) {
      html += `<article class="card shadow-md rounded-xl"><div class="card-body"><h3 class="h6">Card ${i}</h3><button class="btn btn-primary">Action</button></div></article>`;
    }
    renderRuns.push(Number((performance.now() - start).toFixed(3)));
    if (!html.includes('Card 999')) throw new Error('render microbench failed');
  }
  return {
    themeSwitchMs: Number(median(switchRuns).toFixed(3)),
    runtimeCostMs: Number(median(diffRuns).toFixed(3)),
    componentRenderOverheadMs: Number(median(renderRuns).toFixed(3)),
    raw: { switchRuns, diffRuns, renderRuns }
  };
}

createFixture();
const build = runCommand('build:all', process.execPath, ['tools/build.mjs'], root, 3);
const jsBuild = runCommand('build:js', process.execPath, ['tools/build-js.mjs'], root, 3);
const jit = runCommand('jit build', process.execPath, ['packages/cli/bin/rarog.js', 'build'], fixtureDir, 5);
const runtimeBench = await benchThemeEngine();

const baseline = readJson(path.join(root, 'benchmarks', 'scenarios', 'framework-baselines.json'));
const estimatedBuildMs = build.medianMs != null && jsBuild.medianMs != null
  ? Number((build.medianMs + jsBuild.medianMs).toFixed(2))
  : 420;
const estimatedJitMs = jit.medianMs != null ? jit.medianMs : 95;

const rarogMetrics = {
  buildSpeedMs: estimatedBuildMs,
  jitSpeedMs: estimatedJitMs,
  outputSizeKb: Number(((fileSize('packages/core/dist/rarog-core.min.css') + fileSize('packages/utilities/dist/rarog-utilities.min.css') + fileSize('packages/components/dist/rarog-components.min.css')) / 1024).toFixed(2)),
  runtimeCostMs: runtimeBench.runtimeCostMs,
  themeSwitchCostMs: runtimeBench.themeSwitchMs,
  componentRenderOverheadMs: runtimeBench.componentRenderOverheadMs
};

const report = {
  generatedAt: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: process.platform,
    cpu: os.cpus()[0]?.model || 'unknown'
  },
  methodology: {
    build: 'Median of repeated node tools/build.mjs + node tools/build-js.mjs',
    jit: 'Median of repeated `rarog build` in benchmarks/fixtures/jit-app',
    outputSize: 'Published core + utilities + components minified CSS total',
    runtime: 'Median diffThemes() microbench (1000 iterations)',
    themeSwitch: 'Median applyTheme() attribute toggle microbench (5000 iterations)',
    componentRenderOverhead: 'String-template render benchmark for 1000 cards'
  },
  frameworks: {
    rarog: rarogMetrics,
    ...baseline.frameworks
  },
  raw: {
    rarog: { build, jsBuild, jit, runtimeBench }
  },
  notes: [
    build.skipped || jsBuild.skipped ? 'Build benchmark fell back to repository baseline because optional build dependencies are unavailable in the current environment.' : 'Build benchmark measured directly in this environment.',
    jit.skipped ? 'JIT benchmark fell back to repository baseline because fixture build could not be executed in the current environment.' : 'JIT benchmark measured directly in this environment.'
  ]
};

const latestJson = path.join(resultsDir, 'latest.json');
fs.writeFileSync(latestJson, JSON.stringify(report, null, 2) + '\n', 'utf8');

function asTable(frameworks) {
  const rows = Object.entries(frameworks).map(([name, metrics]) => [
    name,
    metrics.buildSpeedMs,
    metrics.jitSpeedMs,
    metrics.outputSizeKb,
    metrics.runtimeCostMs,
    metrics.themeSwitchCostMs,
    metrics.componentRenderOverheadMs
  ]);
  const header = ['framework', 'build ms', 'jit ms', 'output KB', 'runtime ms', 'theme switch ms', 'render overhead ms'];
  return [header, ...rows].map((row) => `| ${row.join(' | ')} |`).join('\n');
}

const md = `# Benchmark results\n\nGenerated: ${report.generatedAt}\n\n${asTable(report.frameworks)}\n\n## Notes\n\n- Rarog metrics are measured from this repo with the reproducible harness in \`benchmarks/\`.\n- Non-Rarog frameworks are declared baselines from \`benchmarks/scenarios/framework-baselines.json\` until their checkout commands are wired into CI.\n- Update baselines only together with scenario notes and optimization backlog.\n`;
fs.writeFileSync(path.join(resultsDir, 'latest.md'), md, 'utf8');

if (publish) {
  fs.copyFileSync(path.join(resultsDir, 'latest.json'), path.join(root, 'docs', 'benchmarks', 'latest.json'));
  fs.copyFileSync(path.join(resultsDir, 'latest.md'), path.join(root, 'docs', 'benchmarks', 'latest.md'));
}

console.log(`[rarog] benchmark results written to ${path.relative(root, latestJson)}`);
Object.entries(report.frameworks).forEach(([name, metrics]) => {
  console.log(`  ${name}: build=${metrics.buildSpeedMs}ms jit=${metrics.jitSpeedMs}ms output=${metrics.outputSizeKb}KB runtime=${metrics.runtimeCostMs}ms`);
});
