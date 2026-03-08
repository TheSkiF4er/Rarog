import { build } from "esbuild";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const targetName = process.argv[2] || "all";

const packages = [
  {
    name: "react",
    entry: path.join(root, "packages/react/src/index.js"),
    outdir: path.join(root, "packages/react/dist"),
    platform: "browser",
    externals: ["react", "react-dom", "@rarog/js"]
  },
  {
    name: "vue",
    entry: path.join(root, "packages/vue/src/index.js"),
    outdir: path.join(root, "packages/vue/dist"),
    platform: "browser",
    externals: ["vue", "@rarog/js"]
  }
];

async function buildAdapter(pkg) {
  await mkdir(pkg.outdir, { recursive: true });
  await build({
    entryPoints: [pkg.entry],
    outfile: path.join(pkg.outdir, "index.mjs"),
    bundle: true,
    format: "esm",
    platform: pkg.platform,
    target: ["es2020"],
    sourcemap: true,
    minify: false,
    external: pkg.externals,
    logLevel: "info",
    legalComments: "none",
    banner: { js: `/*! @rarog/${pkg.name} v3.5.0 */` }
  });
  await copyFile(path.join(path.dirname(pkg.entry), "index.d.ts"), path.join(pkg.outdir, "index.d.ts"));
}

const selected = targetName == "all" ? packages : packages.filter(pkg => pkg.name === targetName);
if (selected.length == 0) {
  throw new Error(`Unknown adapter target: ${targetName}`);
}
for (const pkg of selected) {
  await buildAdapter(pkg);
}
