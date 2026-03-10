import fs from "fs";
import path from "path";
import url from "url";

import * as rarogCli from "../packages/cli/lib/api.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT_DIR, rel), "utf8");
}

function resolveManifestPath() {
  const canonical = path.join(ROOT_DIR, "rarog.build.json");
  const legacy = path.join(ROOT_DIR, "rarog.config.json");
  if (fs.existsSync(canonical)) return canonical;
  return legacy;
}

function main() {
  const pkg = JSON.parse(read("package.json"));
  const manifestPath = resolveManifestPath();
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const effective = rarogCli.getEffectiveConfig();

  const colorActual = read(manifest.tokens.colors).trim();
  const spacingActual = read(manifest.tokens.spacing).trim();
  const radiusActual = read(manifest.tokens.radius).trim();
  const shadowActual = read(manifest.tokens.shadow).trim();
  const breakpointsActual = read(manifest.tokens.breakpoints).trim();

  const colorGenerated = rarogCli.generateColorCss(effective.theme).trim();
  const spacingGenerated = rarogCli.generateSpacingCss(effective.theme).trim();
  const radiusGenerated = rarogCli.generateRadiusCss(effective.theme).trim();
  const shadowGenerated = rarogCli.generateShadowCss(effective.theme).trim();
  const breakpointsGenerated = rarogCli.generateBreakpointsCss(effective.screens).trim();

  function assertEqual(name, a, b) {
    if (a !== b) {
      console.error(`[FAIL] ${name} tokens differ from generated output for version ${pkg.version}`);
      process.exitCode = 1;
    } else {
      console.log(`[OK] ${name} tokens match generated output for version ${pkg.version}`);
    }
  }

  assertEqual("color", colorActual, colorGenerated);
  assertEqual("spacing", spacingActual, spacingGenerated);
  assertEqual("radius", radiusActual, radiusGenerated);
  assertEqual("shadow", shadowActual, shadowGenerated);
  assertEqual("breakpoints", breakpointsActual, breakpointsGenerated);

  if (process.exitCode && process.exitCode !== 0) {
    process.exit(process.exitCode);
  } else {
    console.log("[OK] All token files are in sync with rarog.config.js");
  }
}

main();
