const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.resolve(__dirname, "..", "..", "..");
const PROJECT_ROOT = process.cwd();

function pathInProject(rel = "") {
  return path.isAbsolute(rel) ? rel : path.join(PROJECT_ROOT, rel);
}

function pathInPackage(rel = "") {
  return path.isAbsolute(rel) ? rel : path.join(PACKAGE_ROOT, rel);
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readProjectJson(rel) {
  return readJsonFile(pathInProject(rel));
}

function readPackageJson(rel) {
  return readJsonFile(pathInPackage(rel));
}

function writeProjectFile(rel, content) {
  const filePath = pathInProject(rel);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function fileExistsInProject(rel) {
  return fs.existsSync(pathInProject(rel));
}

function fileExistsInPackage(rel) {
  return fs.existsSync(pathInPackage(rel));
}

module.exports = {
  PACKAGE_ROOT,
  PROJECT_ROOT,
  pathInProject,
  pathInPackage,
  readJsonFile,
  readProjectJson,
  readPackageJson,
  writeProjectFile,
  fileExistsInProject,
  fileExistsInPackage
};
