import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT_DIR, rel), "utf8"));
const readText = (rel) => fs.readFileSync(path.join(ROOT_DIR, rel), "utf8");
const hasFile = (rel) => fs.existsSync(path.join(ROOT_DIR, rel));
const containsAll = (text, snippets) => snippets.every((snippet) => text.includes(snippet));
const addCheck = (checks, rel, predicate, description) => checks.push([rel, predicate, description]);

const rootPkg = readJson("package.json");
const jsPkg = readJson("packages/js/package.json");
const reactPkg = readJson("packages/react/package.json");
const vuePkg = readJson("packages/vue/package.json");
const version = rootPkg.version;
const ciText = readText(".github/workflows/ci.yml");
const fullCiText = readText(".github/workflows/full-ci.yml");
const docsText = readText(".github/workflows/docs.yml");
const releaseText = readText(".github/workflows/release.yml");
const checks = [];

addCheck(checks, "packages/js/package.json", () => jsPkg.version === version, `js package version matches ${version}`);
addCheck(checks, "packages/react/package.json", () => reactPkg.version === version, `react package version matches ${version}`);
addCheck(checks, "packages/vue/package.json", () => vuePkg.version === version, `vue package version matches ${version}`);
addCheck(checks, "package.json", () => rootPkg.scripts?.build === "npm run build:all", "root build delegates to build:all");
for (const script of ["build:css","build:js","build:adapters","build:all","release:check","release:verify","verify:artifacts","pack:packages","docs:lint","docs:check","test:adapters","test:ci","test:release","test:smoke","storybook","storybook:build"]) {
  addCheck(checks, "package.json", () => Boolean(rootPkg.scripts?.[script]), `root ${script} script exists`);
}
addCheck(checks, "package.json", () => !Object.hasOwn(rootPkg, "main"), "root package does not publish a CSS main field");
addCheck(checks, "package.json", () => rootPkg.style === "./packages/core/dist/rarog-core.min.css", "root style points to the built core CSS artifact");
addCheck(checks, "package.json", () => rootPkg.exports?.["./core"] === "./packages/core/dist/rarog-core.min.css", "root exports expose the core CSS entrypoint");
addCheck(checks, "package.json", () => rootPkg.exports?.["./themes/creative"] === "./packages/themes/dist/rarog-theme-creative.min.css", "root exports expose creative theme");
addCheck(checks, "package.json", () => rootPkg.exports?.["./themes/enterprise"] === "./packages/themes/dist/rarog-theme-enterprise.min.css", "root exports expose enterprise theme");
addCheck(checks, "package.json", () => rootPkg.scripts?.["test:ci"]?.includes("test:smoke") && rootPkg.scripts?.["test:release"]?.includes("test:smoke"), "CI and release gates include the temp-project smoke test");
addCheck(checks, "package.json", () => rootPkg.scripts?.["verify:artifacts"] === "node tools/check-package-artifacts.mjs", "verify:artifacts delegates to tools/check-package-artifacts.mjs");
addCheck(checks, "package.json", () => Array.isArray(rootPkg.files) && rootPkg.files.includes("packages/themes/dist"), "root files allow-list includes built theme artifacts");
addCheck(checks, "package.json", () => rootPkg.publishConfig?.access === "public", "root publishConfig.access is public");
addCheck(checks, "package-lock.json", () => hasFile("package-lock.json"), "root package-lock.json exists for npm ci reproducibility");
addCheck(checks, "docs/.vitepress/config.ts", () => hasFile("docs/.vitepress/config.ts"), "vitepress config exists");
addCheck(checks, "tools/check-package-artifacts.mjs", () => hasFile("tools/check-package-artifacts.mjs"), "artifact verification tool exists");
addCheck(checks, "tests/cli-temp-project-smoke.mjs", () => hasFile("tests/cli-temp-project-smoke.mjs"), "temp-project smoke test exists");
addCheck(checks, "rarog.build.json", () => hasFile("rarog.build.json"), "canonical build manifest exists at repo root");
addCheck(checks, ".github/workflows/ci.yml", () => containsAll(ciText, ["npm run build:all","npm run verify:artifacts","npm run test:ci"]), "CI runs build, artifact verification, and the CI test gate");
addCheck(checks, ".github/workflows/full-ci.yml", () => containsAll(fullCiText, ["npm run build:all","npm run test:e2e","npm run test:visual"]), "full CI runs build, e2e, and visual checks");
addCheck(checks, ".github/workflows/docs.yml", () => containsAll(docsText, ["npm run docs:check"]), "docs workflow runs docs:check");
addCheck(checks, ".github/workflows/release.yml", () => containsAll(releaseText, ["npm run release:verify","npm run build:all","npm run test:release","npm run verify:artifacts","npm run pack:packages","Publish rarog"]), "release workflow runs canonical publish steps including root publish");

let failed = false;
for (const [rel, test, description] of checks) {
  let ok = false;
  try { ok = Boolean(test()); } catch { ok = false; }
  if (ok) console.log(`[OK] ${rel}: ${description}`);
  else { console.error(`[FAIL] ${rel}: ${description}`); failed = true; }
}
if (failed) process.exit(1);
