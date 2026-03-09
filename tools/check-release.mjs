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

const rootPkg = readJson("package.json");
const jsPkg = readJson("packages/js/package.json");
const reactPkg = readJson("packages/react/package.json");
const vuePkg = readJson("packages/vue/package.json");
const version = rootPkg.version;

const checks = [
  ["packages/js/package.json", () => jsPkg.version === version, `js package version matches ${version}`],
  ["packages/react/package.json", () => reactPkg.version === version, `react package version matches ${version}`],
  ["packages/vue/package.json", () => vuePkg.version === version, `vue package version matches ${version}`],
  ["package.json", () => rootPkg.scripts?.["build:all"], "root build:all script exists"],
  ["package.json", () => rootPkg.scripts?.["pack:packages"], "root pack:packages script exists"],
  ["package.json", () => rootPkg.scripts?.["release:verify"], "root release:verify script exists"],
  ["packages/js/package.json", () => jsPkg.exports?.["."]?.import === "./dist/rarog.esm.js", "js import export points to dist"],
  ["packages/js/package.json", () => jsPkg.exports?.["."]?.require === "./dist/rarog.cjs", "js require export points to dist"],
  ["packages/react/package.json", () => reactPkg.main === "dist/index.mjs", "react main points to dist"],
  ["packages/vue/package.json", () => vuePkg.main === "dist/index.mjs", "vue main points to dist"],
  ["packages/core/src/rarog-core.css", () => readText("packages/core/src/rarog-core.css").includes(`Rarog Core ${version}`), "core banner version is synced"],
  ["packages/components/src/rarog-components.css", () => readText("packages/components/src/rarog-components.css").includes(`Rarog Components ${version}`), "components banner version is synced"],
  ["packages/utilities/src/rarog-utilities.css", () => readText("packages/utilities/src/rarog-utilities.css").includes(`Rarog Utilities ${version}`), "utilities banner version is synced"],
  ["packages/js/src/rarog.esm.js", () => readText("packages/js/src/rarog.esm.js").includes(`Rarog JS Core v${version}`), "js banner version is synced"],
  ["tests/rarog-js-core.test.html", () => readText("tests/rarog-js-core.test.html").includes(`Rarog JS Core v${version}`), "html smoke banner version is synced"]
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
