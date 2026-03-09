import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT_DIR, rel), "utf8"));
}

function readText(rel) {
  return fs.readFileSync(path.join(ROOT_DIR, rel), "utf8");
}

function hasFile(rel) {
  return fs.existsSync(path.join(ROOT_DIR, rel));
}

function includesAll(text, fragments) {
  return fragments.every((fragment) => text.includes(fragment));
}

const rootPkg = readJson("package.json");
const jsPkg = readJson("packages/js/package.json");
const reactPkg = readJson("packages/react/package.json");
const vuePkg = readJson("packages/vue/package.json");
const releaseWorkflow = readText(".github/workflows/release.yml");
const ciWorkflow = readText(".github/workflows/ci.yml");
const version = rootPkg.version;

const docsConfigPath = "docs/.vitepress/config.ts";
const lockfilePath = "package-lock.json";

const checks = [
  ["packages/js/package.json", () => jsPkg.version === version, `js package version matches ${version}`],
  ["packages/react/package.json", () => reactPkg.version === version, `react package version matches ${version}`],
  ["packages/vue/package.json", () => vuePkg.version === version, `vue package version matches ${version}`],
  ["package.json", () => rootPkg.scripts?.build, "root build script exists"],
  ["package.json", () => rootPkg.scripts?.["build:css"], "root build:css script exists"],
  ["package.json", () => rootPkg.scripts?.["build:js"], "root build:js script exists"],
  ["package.json", () => rootPkg.scripts?.["build:adapters"], "root build:adapters script exists"],
  ["package.json", () => rootPkg.scripts?.["build:all"], "root build:all script exists"],
  ["package.json", () => rootPkg.scripts?.build === "npm run build:all", "root build delegates to build:all"],
  ["package.json", () => rootPkg.scripts?.["pack:packages"], "root pack:packages script exists"],
  ["package.json", () => rootPkg.scripts?.["release:check"], "root release:check script exists"],
  ["package.json", () => rootPkg.scripts?.["release:verify"], "root release:verify script exists"],
  ["package.json", () => rootPkg.scripts?.["release:verify"]?.includes("docs:check"), "root release:verify includes docs:check"],
  ["package.json", () => rootPkg.scripts?.["test:adapters"], "root test:adapters script exists"],
  ["package.json", () => rootPkg.scripts?.["test:contracts"], "root test:contracts script exists"],
  ["package.json", () => rootPkg.scripts?.storybook, "root storybook script exists"],
  [lockfilePath, () => hasFile(lockfilePath), "root package-lock.json exists for npm ci reproducibility"],
  [docsConfigPath, () => hasFile(docsConfigPath), "vitepress config exists at docs/.vitepress/config.ts"],
  ["package.json", () => rootPkg.scripts?.["storybook:build"], "root storybook:build script exists"],
  ["package.json", () => rootPkg.devDependencies?.esbuild, "esbuild is declared in devDependencies"],
  ["package.json", () => rootPkg.devDependencies?.react, "react is declared in devDependencies"],
  ["package.json", () => rootPkg.devDependencies?.["react-dom"], "react-dom is declared in devDependencies"],
  ["package.json", () => rootPkg.devDependencies?.vue, "vue is declared in devDependencies"],
  ["package.json", () => rootPkg.devDependencies?.jsdom, "jsdom is declared in devDependencies"],
  ["package.json", () => rootPkg.devDependencies?.storybook, "storybook is declared in devDependencies"],
  ["package.json", () => rootPkg.devDependencies?.vite, "vite is declared in devDependencies"],
  ["package.json", () => rootPkg.devDependencies?.["@storybook/html-vite"], "@storybook/html-vite is declared in devDependencies"],
  ["package.json", () => rootPkg.devDependencies?.["@storybook/addon-docs"], "@storybook/addon-docs is declared in devDependencies"],
  ["package.json", () => rootPkg.devDependencies?.["@storybook/addon-a11y"], "@storybook/addon-a11y is declared in devDependencies"],
  ["packages/js/package.json", () => jsPkg.exports?.["."]?.import === "./dist/index.mjs", "js import export points to dist/index.mjs"],
  ["packages/js/package.json", () => jsPkg.exports?.["."]?.require === "./dist/index.cjs", "js require export points to dist/index.cjs"],
  ["packages/js/package.json", () => jsPkg.exports?.["./runtime"]?.import === "./dist/rarog.esm.js", "js runtime import export points to dist/rarog.esm.js"],
  ["packages/js/package.json", () => jsPkg.exports?.["./runtime"]?.require === "./dist/rarog.cjs", "js runtime require export points to dist/rarog.cjs"],
  ["packages/js/package.json", () => Array.isArray(jsPkg.files) && jsPkg.files.includes("dist"), "js package publishes dist via files"],
  ["packages/js/package.json", () => jsPkg.types === "dist/index.d.ts", "js types points to dist/index.d.ts"],
  ["packages/react/package.json", () => reactPkg.main === "dist/index.mjs", "react main points to dist"],
  ["packages/react/package.json", () => reactPkg.types === "dist/index.d.ts", "react types points to dist/index.d.ts"],
  ["packages/react/package.json", () => Array.isArray(reactPkg.files) && reactPkg.files.includes("dist"), "react package publishes dist via files"],
  ["packages/react/package.json", () => reactPkg.peerDependencies?.react && reactPkg.peerDependencies?.["react-dom"], "react package declares peer dependencies"],
  ["packages/vue/package.json", () => vuePkg.main === "dist/index.mjs", "vue main points to dist"],
  ["packages/vue/package.json", () => vuePkg.types === "dist/index.d.ts", "vue types points to dist/index.d.ts"],
  ["packages/vue/package.json", () => Array.isArray(vuePkg.files) && vuePkg.files.includes("dist"), "vue package publishes dist via files"],
  ["packages/vue/package.json", () => vuePkg.peerDependencies?.vue, "vue package declares peer dependency"],
  ["tools/pack-packages.mjs", () => hasFile("tools/pack-packages.mjs"), "pack packages tool exists"],
  ["packages/core/src/rarog-core.css", () => readText("packages/core/src/rarog-core.css").includes(`Rarog Core ${version}`), "core banner version is synced"],
  ["packages/components/src/rarog-components.css", () => readText("packages/components/src/rarog-components.css").includes(`Rarog Components ${version}`), "components banner version is synced"],
  ["packages/utilities/src/rarog-utilities.css", () => readText("packages/utilities/src/rarog-utilities.css").includes(`Rarog Utilities ${version}`), "utilities banner version is synced"],
  ["packages/js/src/rarog.esm.js", () => readText("packages/js/src/rarog.esm.js").includes(`Rarog JS Core v${version}`), "js banner version is synced"],
  ["tests/rarog-js-core.test.html", () => readText("tests/rarog-js-core.test.html").includes(`Rarog JS Core v${version}`), "html smoke banner version is synced"],
  [".github/workflows/ci.yml", () => ciWorkflow.includes("npm run docs:check"), "CI runs docs:check"],
  ["package.json", () => rootPkg.scripts?.["test:release"], "root test:release script exists"],
  [".github/workflows/release.yml", () => releaseWorkflow.includes("npm run test:release") || includesAll(releaseWorkflow, ["npm run test:unit", "npm run test:adapters", "npm run test:contracts"]), "release workflow runs canonical release tests before publish"],
  [".github/workflows/release.yml", () => releaseWorkflow.includes("npm run pack:packages"), "release workflow packs publishable packages before publish"],
  [".github/workflows/release.yml", () => releaseWorkflow.includes("npm ci"), "release workflow uses npm ci"],
  [".github/workflows/ci.yml", () => ciWorkflow.includes("npm ci"), "CI workflow uses npm ci"],
  [".github/workflows/docs.yml", () => readText(".github/workflows/docs.yml").includes("npm run docs:check"), "docs workflow runs docs:check"],
  ["tools/check-docs-output.mjs", () => hasFile("tools/check-docs-output.mjs"), "docs build output checker exists"]
];

let failed = false;
for (const [rel, predicate, label] of checks) {
  if (!predicate()) {
    failed = true;
    console.error(`[FAIL] ${label} (${rel})`);
  } else {
    console.log(`[OK] ${label}`);
  }
}

if (failed) {
  process.exit(1);
}
