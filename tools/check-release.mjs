import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8"));
const version = rootPkg.version;

const checks = [
  ["packages/react/package.json", text => JSON.parse(text).version === version, "react package version"],
  ["packages/vue/package.json", text => JSON.parse(text).version === version, "vue package version"],
  ["packages/core/src/rarog-core.css", text => text.includes(`Rarog Core ${version}`), "core banner version"],
  ["packages/components/src/rarog-components.css", text => text.includes(`Rarog Components ${version}`), "components banner version"],
  ["packages/utilities/src/rarog-utilities.css", text => text.includes(`Rarog Utilities ${version}`), "utilities banner version"],
  ["packages/js/src/rarog.esm.js", text => text.includes(`Rarog JS Core v${version}`), "js banner version"],
  ["tests/rarog-js-core.test.html", text => text.includes(`Rarog JS Core v${version}`), "html smoke banner version"]
];

let failed = false;
for (const [rel, predicate, label] of checks) {
  const text = fs.readFileSync(path.join(ROOT_DIR, rel), "utf8");
  if (!predicate(text)) {
    failed = true;
    console.error(`[FAIL] ${label} is out of sync in ${rel}`);
  } else {
    console.log(`[OK] ${label}`);
  }
}

if (failed) {
  process.exit(1);
}
