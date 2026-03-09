import { build } from "esbuild";
import { mkdir, copyFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(await readFile(path.join(root, "packages/js/package.json"), "utf8"));
const version = pkg.version;

const entry = path.join(root, "packages/js/src/rarog.esm.js");
const typesEntry = path.join(root, "packages/js/src/index.d.ts");
const outdir = path.join(root, "packages/js/dist");

async function ensureOutdir() {
  await mkdir(outdir, { recursive: true });
}

async function runBuilds() {
  await ensureOutdir();

  await build({
    entryPoints: [entry],
    outfile: path.join(outdir, "rarog.esm.js"),
    bundle: false,
    format: "esm",
    platform: "browser",
    target: ["es2020"],
    sourcemap: true,
    legalComments: "none",
    banner: { js: `/*! @rarog/js v${version} */` }
  });

  await build({
    entryPoints: [entry],
    outfile: path.join(outdir, "rarog.cjs"),
    bundle: true,
    format: "cjs",
    platform: "browser",
    target: ["es2020"],
    sourcemap: true,
    legalComments: "none",
    banner: { js: `/*! @rarog/js v${version} */` }
  });

  await build({
    entryPoints: [entry],
    outfile: path.join(outdir, "rarog.iife.js"),
    bundle: true,
    format: "iife",
    globalName: "Rarog",
    platform: "browser",
    target: ["es2020"],
    sourcemap: true,
    minify: false,
    legalComments: "none",
    banner: { js: `/*! @rarog/js v${version} */` }
  });

  await copyFile(typesEntry, path.join(outdir, "index.d.ts"));
}

runBuilds().catch((error) => {
  console.error("Rarog JS build failed:", error.message);
  process.exitCode = 1;
});
