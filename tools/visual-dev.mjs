import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const portArgIndex = process.argv.indexOf("--port");
const port = portArgIndex !== -1 ? Number(process.argv[portArgIndex + 1]) : 4175;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function safePath(urlPath) {
  const clean = normalize(decodeURIComponent((urlPath || "/").split("?")[0])).replace(/^([.][.][\/\\])+/, "");
  return join(root, clean === "/" ? "tests/visual/fixtures/overlays.html" : clean.replace(/^[/\\]+/, ""));
}

http.createServer((req, res) => {
  const filePath = safePath(req.url);
  if (!filePath.startsWith(root) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream" });
  createReadStream(filePath).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`Visual server running at http://127.0.0.1:${port}`);
});
