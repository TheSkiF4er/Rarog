import { execFileSync } from "child_process";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");

execFileSync("node", ["tools/check-release.mjs"], {
  cwd: ROOT_DIR,
  stdio: "inherit"
});
