import fs from "fs";
import path from "path";
import url from "url";
import { build } from "esbuild";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pkgDir = path.join(root, "packages", "js");
const srcFile = path.join(pkgDir, "src", "rarog.esm.js");
const typesFile = path.join(pkgDir, "src", "index.d.ts");
const distDir = path.join(pkgDir, "dist");
const banner = fs.readFileSync(srcFile, "utf8").match(/\/\*![\s\S]*?\*\//)?.[0] ?? "";

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
    outfile: path.join(distDir, "rarog.esm.js"),
    format: "esm",
    platform: "browser",
    target: ["es2019"]
  });

  await bundle({
    outfile: path.join(distDir, "rarog.cjs"),
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
