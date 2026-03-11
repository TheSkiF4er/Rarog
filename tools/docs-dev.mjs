import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const argDirIndex = process.argv.indexOf('--dir')
const relDir = argDirIndex !== -1 ? process.argv[argDirIndex + 1] : '.gitbook/dist'
const targetDir = path.resolve(root, relDir)

if (!fs.existsSync(targetDir)) {
  const build = spawnSync(process.execPath, [path.join(root, 'tools', 'build-docs-site.mjs')], { stdio: 'inherit' })
  if (build.status !== 0) process.exit(build.status ?? 1)
}

const server = http.createServer((req, res) => {
  const safePath = (req.url || '/').split('?')[0]
  let filePath = path.join(targetDir, safePath === '/' ? 'index.html' : safePath)
  if (!filePath.startsWith(targetDir)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html')
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    res.writeHead(200)
    res.end(data)
  })
})

server.listen(4173, () => console.log(`Rarog docs server is running at http://localhost:4173 serving ${path.relative(root, targetDir)}`))
