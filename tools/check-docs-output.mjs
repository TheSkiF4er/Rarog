import { access, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, '.gitbook', 'dist')
async function exists(target) { try { await access(target); return true } catch { return false } }
const requiredFiles = ['index.html','404.html','README.html']
if (!(await exists(distDir))) { console.error('Expected built docs output at .gitbook/dist.'); process.exit(1) }
const missing = []
for (const rel of requiredFiles) if (!(await exists(path.join(distDir, rel)))) missing.push(`.gitbook/dist/${rel}`)
const entries = await readdir(distDir, { withFileTypes: true })
const htmlPages = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).length
if (htmlPages < 3) missing.push(`expected multiple built html pages, found ${htmlPages}`)
if (missing.length) {
  console.error('Docs build output validation failed:')
  for (const item of missing) console.error(`- ${item}`)
  process.exit(1)
}
console.log(`Docs build output looks valid in ${distDir}.`)
