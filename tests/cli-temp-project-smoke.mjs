import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const REQUIRED_BUILD_OUTPUTS = [
  "packages/core/dist/rarog-core.min.css",
  "packages/utilities/dist/rarog-utilities.min.css",
  "packages/components/dist/rarog-components.min.css",
  "packages/themes/dist/rarog-theme-default.min.css",
  "packages/themes/dist/rarog-theme-dark.min.css",
  "packages/themes/dist/rarog-theme-contrast.min.css",
  "packages/themes/dist/rarog-theme-creative.min.css",
  "packages/themes/dist/rarog-theme-enterprise.min.css",
  "packages/js/dist/index.mjs",
  "packages/react/dist/index.mjs",
  "packages/vue/dist/index.mjs"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function ensureBuiltArtifacts() {
  const missing = REQUIRED_BUILD_OUTPUTS.filter((rel) => !fs.existsSync(path.join(ROOT_DIR, rel)));
  if (!missing.length) return;
  console.log("[smoke] Missing build outputs, running npm run build...");
  execFileSync("npm", ["run", "build"], { cwd: ROOT_DIR, stdio: "inherit" });
}

function packRootPackage() {
  const output = execFileSync("npm", ["pack", "--json"], {
    cwd: ROOT_DIR,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"]
  }).trim();
  const filename = JSON.parse(output)?.[0]?.filename;
  assert(filename, "npm pack did not return a tarball filename");
  return path.join(ROOT_DIR, filename);
}

function runNode(projectDir, args) {
  execFileSync("node", args, { cwd: projectDir, stdio: "inherit" });
}

function main() {
  ensureBuiltArtifacts();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "rarog-smoke-"));
  const projectDir = path.join(tmpDir, "project");
  fs.mkdirSync(projectDir, { recursive: true });
  fs.writeFileSync(path.join(projectDir, "package.json"), JSON.stringify({ name: "rarog-smoke-project", private: true }, null, 2) + "\n");

  const tarballPath = packRootPackage();
  try {
    execFileSync("npm", ["install", "--ignore-scripts", tarballPath], { cwd: projectDir, stdio: "inherit" });
    const cliPath = path.join(projectDir, "node_modules", "rarog", "packages", "cli", "bin", "rarog.js");
    assert(fs.existsSync(cliPath), "Installed tarball does not contain the CLI entrypoint");

    console.log("[smoke] Step 1/4: init");
    runNode(projectDir, [cliPath, "init"]);
    assert(fs.existsSync(path.join(projectDir, "rarog.config.js")), "init did not create rarog.config.js");
    assert(fs.existsSync(path.join(projectDir, "rarog.build.json")), "init did not create rarog.build.json");
    assert(fs.existsSync(path.join(projectDir, "src", "index.html")), "init did not create src/index.html");
    assert(!fs.existsSync(path.join(projectDir, "rarog.config.ts")), "init unexpectedly created rarog.config.ts");
    assert(!fs.existsSync(path.join(projectDir, "rarog.config.json")), "init unexpectedly created rarog.config.json");

    console.log("[smoke] Step 2/4: validate");
    runNode(projectDir, [cliPath, "validate"]);

    console.log("[smoke] Step 3/6: doctor");
    runNode(projectDir, [cliPath, "doctor"]);

    console.log("[smoke] Step 4/6: analyze");
    runNode(projectDir, [cliPath, "analyze"]);

    console.log("[smoke] Step 5/6: build --debug");
    runNode(projectDir, [cliPath, "build", "--debug"]);

    console.log("[smoke] Step 6/6: output exists");
    const manifest = JSON.parse(fs.readFileSync(path.join(projectDir, "rarog.build.json"), "utf8"));
    for (const rel of Object.values(manifest.tokens || {})) {
      assert(fs.existsSync(path.join(projectDir, rel)), `missing token output: ${rel}`);
    }
    assert(fs.existsSync(path.join(projectDir, manifest.outputs.jitCss)), `missing JIT output: ${manifest.outputs.jitCss}`);
    assert(fs.existsSync(path.join(projectDir, "dist", "rarog.jit.debug.json")), "missing JIT debug report");

    console.log("[OK] temp-project smoke passed");
  } finally {
    fs.rmSync(tarballPath, { force: true });
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main();
