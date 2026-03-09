import fs from "fs";
import path from "path";
import url from "url";
import { build } from "esbuild";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pkgDir = path.join(root, "packages", "js");
const srcFile = path.join(pkgDir, "src", "index.js");
const runtimeFile = path.join(pkgDir, "src", "rarog.esm.js");
const typesFile = path.join(pkgDir, "src", "index.d.ts");
const distDir = path.join(pkgDir, "dist");
const banner = fs.readFileSync(runtimeFile, "utf8").match(/\/\*![\s\S]*?\*\//)?.[0] ?? "";

function cleanDist() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
}

async function bundle(options) {
  await build({
    entryPoints: [srcFile],
    bundle: true,
    sourcemap: true,
    legalComments: "none",
    banner: banner ? { js: banner } : undefined,
    ...options
  });
}

async function main() {
  cleanDist();

  await bundle({
    outfile: path.join(distDir, "index.mjs"),
    format: "esm",
    platform: "browser",
    target: ["es2019"]
  });

  await bundle({
    outfile: path.join(distDir, "index.cjs"),
    format: "cjs",
    platform: "browser",
    target: ["es2019"]
  });

  await bundle({
    outfile: path.join(distDir, "rarog.iife.js"),
    format: "iife",
    globalName: "Rarog",
    platform: "browser",
    target: ["es2019"],
    minify: true,
    footer: {
      js: "window.Rarog = window.Rarog && window.Rarog.default ? window.Rarog.default : window.Rarog;"
    }
  });

  fs.copyFileSync(typesFile, path.join(distDir, "index.d.ts"));

  fs.copyFileSync(path.join(distDir, "index.mjs"), path.join(distDir, "rarog.esm.js"));
  fs.copyFileSync(path.join(distDir, "index.cjs"), path.join(distDir, "rarog.cjs"));
  fs.copyFileSync(path.join(distDir, "rarog.iife.js"), path.join(distDir, "rarog.js"));
  for (const mapName of ["index.mjs.map", "index.cjs.map", "rarog.iife.js.map"]) {
    const full = path.join(distDir, mapName);
    if (fs.existsSync(full)) {
      if (mapName === "index.mjs.map") fs.copyFileSync(full, path.join(distDir, "rarog.esm.js.map"));
      if (mapName === "index.cjs.map") fs.copyFileSync(full, path.join(distDir, "rarog.cjs.map"));
      if (mapName === "rarog.iife.js.map") fs.copyFileSync(full, path.join(distDir, "rarog.js.map"));
    }
  }

  const distPkg = {
    type: "commonjs"
  };
  fs.writeFileSync(path.join(distDir, "package.json"), JSON.stringify(distPkg, null, 2) + "\n");

  console.log("Built @rarog/js package to", distDir);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
