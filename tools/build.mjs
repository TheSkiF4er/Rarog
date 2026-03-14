import fs from "fs";
import path from "path";
import url from "url";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const packagesDir = path.join(root, "packages");
const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;

const explicitTargets = new Map([
  ["core", path.join(packagesDir, "core", "src", "rarog-core.css")],
  ["utilities", path.join(packagesDir, "utilities", "src", "rarog-utilities.css")],
  ["components", path.join(packagesDir, "components", "src", "rarog-components.css")]
]);

const themeTargets = fs
  .readdirSync(path.join(packagesDir, "themes", "src"))
  .filter((file) => file.endsWith(".css"))
  .map((file) => [file.replace(/^rarog-theme-/, "theme:").replace(/\.css$/, ""), path.join(packagesDir, "themes", "src", file)]);

for (const [name, file] of themeTargets) {
  explicitTargets.set(name, file);
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function normalizeBanner(css, targetName) {
  const bannerMap = {
    core: `/* Рарог Core ${version} */`,
    utilities: `/* Рарог Вспомогательные классы ${version} */`,
    components: `/* Рарог Компонентs ${version} */`
  };

  if (bannerMap[targetName]) {
    return css.replace(/^\/\*[^\n]*\*\/\s*/u, `${bannerMap[targetName]}\n\n`);
  }

  return css;
}

function resolveImports(entryFile, seen = new Set(), stack = []) {
  const normalized = path.resolve(entryFile);
  if (stack.includes(normalized)) {
    throw new Error(`Circular CSS import detected: ${[...stack, normalized].join(" -> ")}`);
  }

  let css = fs.readFileSync(normalized, "utf8");
  const localStack = [...stack, normalized];
  const importRegex = /^\s*@import\s+["'](.+?)["'];\s*$/gmu;

  css = css.replace(importRegex, (_, importPath) => {
    if (!importPath.startsWith(".")) {
      throw new Error(`Only relative @import paths are supported in ${normalized}: ${importPath}`);
    }

    const resolved = path.resolve(path.dirname(normalized), importPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Missing CSS import: ${resolved}`);
    }

    seen.add(resolved);
    return `\n/* >>> ${path.relative(root, resolved)} */\n${resolveImports(resolved, seen, localStack)}\n/* <<< ${path.relative(root, resolved)} */\n`;
  });

  return css.trim() + "\n";
}

async function buildEntry(targetName, srcFile) {
  const srcDir = path.dirname(srcFile);
  const distDir = srcDir.replace(`${path.sep}src`, `${path.sep}dist`);
  const baseName = path.basename(srcFile, ".css");
  const expandedCss = normalizeBanner(resolveImports(srcFile), targetName);

  const expandedResult = await postcss([autoprefixer]).process(expandedCss, {
    from: srcFile,
    to: path.join(distDir, `${baseName}.css`),
    map: { inline: false }
  });

  const minifiedResult = await postcss([autoprefixer, cssnano({ preset: "default" })]).process(expandedCss, {
    from: srcFile,
    to: path.join(distDir, `${baseName}.min.css`),
    map: { inline: false }
  });

  ensureDir(expandedResult.opts.to);
  fs.writeFileSync(expandedResult.opts.to, expandedResult.css);
  fs.writeFileSync(`${expandedResult.opts.to}.map`, expandedResult.map.toString());
  fs.writeFileSync(minifiedResult.opts.to, minifiedResult.css);
  fs.writeFileSync(`${minifiedResult.opts.to}.map`, minifiedResult.map.toString());

  return {
    targetName,
    expanded: path.relative(root, expandedResult.opts.to),
    minified: path.relative(root, minifiedResult.opts.to)
  };
}

function printUsage() {
  console.log("Usage: node tools/build.mjs [core|utilities|components|themes|theme:<name>|--check]");
}

async function main() {
  const arg = process.argv[2];
  if (arg === "--help" || arg === "-h") {
    printUsage();
    return;
  }

  const targetsToBuild = [];
  if (!arg) {
    targetsToBuild.push(...explicitTargets.keys());
  } else if (arg === "themes") {
    targetsToBuild.push(...themeTargets.map(([name]) => name));
  } else if (arg === "--check") {
    targetsToBuild.push(...explicitTargets.keys());
  } else if (explicitTargets.has(arg)) {
    targetsToBuild.push(arg);
  } else {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const results = [];
  for (const targetName of targetsToBuild) {
    const srcFile = explicitTargets.get(targetName);
    results.push(await buildEntry(targetName, srcFile));
  }

  for (const result of results) {
    console.log(`Built ${result.targetName}: ${result.expanded}, ${result.minified}`);
  }
}

main().catch((error) => {
  console.error("Rarog build failed:", error.message);
  process.exitCode = 1;
});
