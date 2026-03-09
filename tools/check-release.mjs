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

function containsAll(text, snippets) {
  return snippets.every((snippet) => text.includes(snippet));
}

function containsAnyGroup(text, snippetGroups) {
  return snippetGroups.some((group) => group.every((snippet) => text.includes(snippet)));
}

function addCheck(checks, rel, predicate, description) {
  checks.push([rel, predicate, description]);
}

const rootPkg = readJson("package.json");
const jsPkg = readJson("packages/js/package.json");
const reactPkg = readJson("packages/react/package.json");
const vuePkg = readJson("packages/vue/package.json");
const version = rootPkg.version;

const ciText = readText(".github/workflows/ci.yml");
const fullCiPath = ".github/workflows/full-ci.yml";
const fullCiText = readText(fullCiPath);
const docsText = readText(".github/workflows/docs.yml");
const releaseText = readText(".github/workflows/release.yml");

const docsConfigPath = "docs/.vitepress/config.ts";
const lockfilePath = "package-lock.json";
const artifactToolPath = "tools/check-package-artifacts.mjs";
const docsOutputToolPath = "tools/check-docs-output.mjs";

const checks = [];

// Package/version consistency
addCheck(checks, "packages/js/package.json", () => jsPkg.version === version, `js package version matches ${version}`);
addCheck(checks, "packages/react/package.json", () => reactPkg.version === version, `react package version matches ${version}`);
addCheck(checks, "packages/vue/package.json", () => vuePkg.version === version, `vue package version matches ${version}`);

// Root scripts and dependency surface
addCheck(checks, "package.json", () => rootPkg.scripts?.build === "npm run build:all", "root build delegates to build:all");
for (const script of [
  "build:css",
  "build:js",
  "build:adapters",
  "build:all",
  "release:check",
  "release:verify",
  "verify:artifacts",
  "pack:packages",
  "docs:lint",
  "docs:check",
  "test:adapters",
  "test:ci",
  "test:release",
  "storybook",
  "storybook:build"
]) {
  addCheck(checks, "package.json", () => Boolean(rootPkg.scripts?.[script]), `root ${script} script exists`);
}
addCheck(checks, "package.json", () => rootPkg.scripts?.["verify:artifacts"] === "node tools/check-package-artifacts.mjs", "verify:artifacts delegates to tools/check-package-artifacts.mjs");
addCheck(checks, "package.json", () => rootPkg.scripts?.["test:ci"]?.includes("test:unit") && rootPkg.scripts?.["test:ci"]?.includes("test:adapters") && rootPkg.scripts?.["test:ci"]?.includes("test:contracts"), "test:ci covers unit, adapter, and contract tests");
addCheck(checks, "package.json", () => rootPkg.scripts?.["release:verify"]?.includes("docs:check"), "root release:verify includes docs:check");
addCheck(checks, "package.json", () => rootPkg.scripts?.["docs:check"]?.includes("docs:lint") && rootPkg.scripts?.["docs:check"]?.includes("docs:build") && rootPkg.scripts?.["docs:check"]?.includes("check-docs-output"), "docs:check includes lint, build, and output validation");
for (const dep of ["esbuild", "react", "react-dom", "vue", "jsdom", "storybook", "vite", "@storybook/html-vite", "@storybook/addon-docs", "@storybook/addon-a11y"]) {
  addCheck(checks, "package.json", () => Boolean(rootPkg.devDependencies?.[dep]), `${dep} is declared in devDependencies`);
}

// Reproducibility and docs tooling
addCheck(checks, lockfilePath, () => hasFile(lockfilePath), "root package-lock.json exists for npm ci reproducibility");
addCheck(checks, docsConfigPath, () => hasFile(docsConfigPath), "vitepress config exists at docs/.vitepress/config.ts");
addCheck(checks, artifactToolPath, () => hasFile(artifactToolPath), "package artifact verification tool exists");
addCheck(checks, docsOutputToolPath, () => hasFile(docsOutputToolPath), "docs output validation tool exists");

addCheck(checks, "package.json", () => rootPkg.main === "./packages/core/dist/rarog-core.min.css", "root main points to the built core CSS artifact");
addCheck(checks, "package.json", () => rootPkg.style === "./packages/core/dist/rarog-core.min.css", "root style points to the built core CSS artifact");
addCheck(checks, "package.json", () => Array.isArray(rootPkg.files) && rootPkg.files.includes("packages/cli/lib") && rootPkg.files.includes("packages/core/dist"), "root files allow-list includes CLI libs and built CSS artifacts");
addCheck(checks, "package.json", () => rootPkg.exports?.["./core"] === "./packages/core/dist/rarog-core.min.css", "root exports expose the core CSS entrypoint");
addCheck(checks, "package.json", () => Array.isArray(rootPkg.workspaces) && rootPkg.workspaces.includes("packages/*"), "root enables npm workspaces for package orchestration");

// Package manifests
addCheck(checks, "packages/js/package.json", () => jsPkg.exports?.["."]?.import === "./dist/index.mjs", "js import export points to dist/index.mjs");
addCheck(checks, "packages/js/package.json", () => jsPkg.exports?.["."]?.require === "./dist/index.cjs", "js require export points to dist/index.cjs");
addCheck(checks, "packages/js/package.json", () => jsPkg.exports?.["./runtime"]?.import === "./dist/rarog.esm.js", "js runtime import export points to dist/rarog.esm.js");
addCheck(checks, "packages/js/package.json", () => jsPkg.exports?.["./runtime"]?.require === "./dist/rarog.cjs", "js runtime require export points to dist/rarog.cjs");
addCheck(checks, "packages/react/package.json", () => reactPkg.main === "dist/index.mjs", "react main points to dist/index.mjs");
addCheck(checks, "packages/vue/package.json", () => vuePkg.main === "dist/index.mjs", "vue main points to dist/index.mjs");

// Version banners
addCheck(checks, "packages/core/src/rarog-core.css", () => readText("packages/core/src/rarog-core.css").includes(`Rarog Core ${version}`), "core banner version is synced");
addCheck(checks, "packages/components/src/rarog-components.css", () => readText("packages/components/src/rarog-components.css").includes(`Rarog Components ${version}`), "components banner version is synced");
addCheck(checks, "packages/utilities/src/rarog-utilities.css", () => readText("packages/utilities/src/rarog-utilities.css").includes(`Rarog Utilities ${version}`), "utilities banner version is synced");
addCheck(checks, "packages/js/src/rarog.esm.js", () => readText("packages/js/src/rarog.esm.js").includes(`Rarog JS Core v${version}`), "js banner version is synced");
addCheck(checks, "tests/rarog-js-core.test.html", () => readText("tests/rarog-js-core.test.html").includes(`Rarog JS Core v${version}`), "html smoke banner version is synced");

// Workflow invariants
addCheck(checks, ".github/workflows/ci.yml", () => containsAnyGroup(ciText, [["npm run docs:lint"], ["npm run docs:check"]]), "fast ci runs a docs gate");
addCheck(checks, ".github/workflows/ci.yml", () => containsAll(ciText, ["npm run build:all"]), "fast ci builds all packages");
addCheck(checks, ".github/workflows/ci.yml", () => containsAll(ciText, ["npm run verify:artifacts"]), "fast ci verifies publishable package artifacts");
addCheck(checks, ".github/workflows/ci.yml", () => containsAnyGroup(ciText, [["npm run test:ci"], ["npm run test:unit", "npm run test:adapters", "npm run test:contracts"]]), "fast ci runs the lightweight CI test gate");
addCheck(checks, fullCiPath, () => hasFile(fullCiPath), "full ci workflow exists");
addCheck(checks, fullCiPath, () => containsAll(fullCiText, ["npm run build:all"]), "full ci builds all packages");
addCheck(checks, fullCiPath, () => containsAll(fullCiText, ["npm run test:e2e"]), "full ci runs end-to-end tests");
addCheck(checks, fullCiPath, () => containsAll(fullCiText, ["npm run test:visual"]), "full ci runs visual regression checks");
addCheck(checks, ".github/workflows/docs.yml", () => containsAll(docsText, ["npm run docs:check"]), "docs workflow runs full docs:check");
addCheck(checks, ".github/workflows/docs.yml", () => containsAll(docsText, ["tools/check-docs-output.mjs"]), "docs workflow watches docs output validator changes");
addCheck(checks, ".github/workflows/release.yml", () => containsAnyGroup(releaseText, [["npm run test:release"], ["npm run test:unit", "npm run test:adapters", "npm run test:contracts"]]), "release workflow runs the release test gate");
addCheck(checks, ".github/workflows/release.yml", () => containsAll(releaseText, ["npm run release:verify"]), "release workflow runs release:verify");
addCheck(checks, ".github/workflows/release.yml", () => containsAll(releaseText, ["npm run build:all"]), "release workflow builds all packages");
addCheck(checks, ".github/workflows/release.yml", () => containsAll(releaseText, ["npm run verify:artifacts"]), "release workflow verifies publishable package artifacts");
addCheck(checks, ".github/workflows/release.yml", () => containsAll(releaseText, ["npm run pack:packages"]), "release workflow packs packages");

let failed = false;
for (const [rel, test, description] of checks) {
  let ok = false;
  try {
    ok = Boolean(test());
  } catch {
    ok = false;
  }

  if (ok) {
    console.log(`[OK] ${rel}: ${description}`);
  } else {
    console.error(`[FAIL] ${rel}: ${description}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
