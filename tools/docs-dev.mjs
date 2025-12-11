import http from "http";
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const server = http.createServer((req, res) => {
  const safePath = req.url.split("?")[0];
  let filePath = path.join(root, "docs", safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(path.join(root, "docs"))) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

server.listen(4173, () => {
  console.log("Rarog docs dev server is running at http://localhost:4173");
});
