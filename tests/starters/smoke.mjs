import { readFile, readdir, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..', '..')
const startersDir = path.join(root, 'examples', 'starters')
const requiredStarters = {
  'vanilla-app': ['README.md', 'index.html'],
  'vite-react': ['README.md', 'package.json', 'src/App.tsx'],
  'nextjs-rarog': ['README.md', 'package.json', 'app/page.tsx'],
  'vue-vite': ['README.md', 'package.json', 'src/App.vue'],
  'nuxt-rarog': ['README.md', 'package.json', 'app.vue'],
  'dashboard-starter': ['README.md', 'index.html'],
  'saas-starter': ['README.md', 'index.html'],
  'white-label-starter': ['README.md', 'index.html']
}

for (const [starter, files] of Object.entries(requiredStarters)) {
  for (const rel of files) {
    try { await access(path.join(startersDir, starter, rel)) } catch {
      console.error(`Missing ${starter}/${rel}`)
      process.exit(1)
    }
  }
}

const dirs = (await readdir(startersDir, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name)
if (dirs.length < 8) {
  console.error(`Expected at least 8 starter directories, found ${dirs.length}`)
  process.exit(1)
}

for (const starter of ['vite-react','nextjs-rarog','vue-vite','nuxt-rarog']) {
  const pkg = JSON.parse(await readFile(path.join(startersDir, starter, 'package.json'), 'utf8'))
  if (!pkg.name || !pkg.scripts) {
    console.error(`Starter ${starter} should expose package name and scripts`)
    process.exit(1)
  }
}

console.log(`Starter smoke checks passed for ${dirs.length} starter directories.`)
