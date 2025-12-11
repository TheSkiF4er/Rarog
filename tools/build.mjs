import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

const root = path.join(__dirname, "..");
const packages = path.join(root, "packages");

const map = {
  core: {
    src: path.join(packages, "core", "src", "rarog-core.css"),
    dist: path.join(packages, "core", "dist", "rarog-core.min.css")
  },
  utilities: {
    src: path.join(packages, "utilities", "src", "rarog-utilities.css"),
    dist: path.join(packages, "utilities", "dist", "rarog-utilities.min.css")
  },
  components: {
    src: path.join(packages, "components", "src", "rarog-components.css"),
    dist: path.join(packages, "components", "dist", "rarog-components.min.css")
  },
  themes_default: {
    src: path.join(packages, "themes", "src", "rarog-theme-default.css"),
    dist: path.join(packages, "themes", "dist", "rarog-theme-default.min.css")
  },
  themes_dark: {
    src: path.join(packages, "themes", "src", "rarog-theme-dark.css"),
    dist: path.join(packages, "themes", "dist", "rarog-theme-dark.min.css")
  }
};

const target = process.argv[2];

if (!target || target === "core") {
  copy(map.core.src, map.core.dist);
}
if (!target || target === "utilities") {
  copy(map.utilities.src, map.utilities.dist);
}
if (!target || target === "components") {
  copy(map.components.src, map.components.dist);
}
if (!target || target === "themes") {
  copy(map.themes_default.src, map.themes_default.dist);
  copy(map.themes_dark.src, map.themes_dark.dist);
}

console.log("Rarog build complete for target:", target || "all");
