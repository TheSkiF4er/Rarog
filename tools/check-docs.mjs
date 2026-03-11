import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const docsDir = 'docs'
const gitbookConfigRel = '.gitbook.yaml'
const summaryRel = 'docs/SUMMARY.md'

async function readJson(relPath) { return JSON.parse(await readFile(path.join(root, relPath), 'utf8')) }
async function exists(relPath) { try { await access(path.join(root, relPath)); return true } catch { return false } }
async function collectMarkdownFiles(dirRel) {
  const dir = path.join(root, dirRel)
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const rel = path.join(dirRel, entry.name)
    if (entry.isDirectory()) files.push(...(await collectMarkdownFiles(rel)))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(rel)
  }
  return files
}
function isIgnoredHref(href) {
  return !href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')
}

if (!(await exists(docsDir))) { console.error(`Expected documentation directory ${docsDir}/ to exist.`); process.exit(1) }
if (!(await exists(gitbookConfigRel))) { console.error(`Expected GitBook config at ${gitbookConfigRel}.`); process.exit(1) }
if (!(await exists(summaryRel))) { console.error(`Expected SUMMARY at ${summaryRel}.`); process.exit(1) }

const pkg = await readJson('package.json')
const scripts = new Set(Object.keys(pkg.scripts || {}))
const markdownFiles = ['README.md','CONTRIBUTING.md','RELEASE.md',...(await collectMarkdownFiles(docsDir))]
const scriptPattern = /npm run ([a-zA-Z0-9:_-]+)/g
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g
const summary = await readFile(path.join(root, summaryRel), 'utf8')
const summaryTargets = [...summary.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1].split('#')[0])
const missingScripts = []
const brokenDocLinks = []

for (const relPath of markdownFiles) {
  const content = await readFile(path.join(root, relPath), 'utf8')
  for (const match of content.matchAll(scriptPattern)) {
    const scriptName = match[1]
    if (!scripts.has(scriptName)) missingScripts.push(`${relPath}: npm run ${scriptName}`)
  }
  if (!relPath.startsWith('docs/')) continue
  for (const match of content.matchAll(markdownLinkPattern)) {
    const href = match[1].trim()
    if (isIgnoredHref(href)) continue
    if (/\.(png|jpe?g|svg|xlsx?)$/i.test(href)) continue
    if (href.startsWith('/')) continue
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(relPath), href.split('#')[0].split('?')[0]))
    const withMd = target.endsWith('.md') ? target : `${target}.md`
    if (!(await exists(withMd))) brokenDocLinks.push(`${relPath}: ${href} -> missing ${withMd}`)
  }
}
for (const target of summaryTargets) {
  if (!(await exists(path.posix.join('docs', target)))) brokenDocLinks.push(`docs/SUMMARY.md: missing ${path.posix.join('docs', target)}`)
}
if (missingScripts.length) {
  console.error('Found documentation references to missing npm scripts:')
  for (const item of missingScripts) console.error(`- ${item}`)
  process.exit(1)
}
if (brokenDocLinks.length) {
  console.error('Found broken internal documentation links:')
  for (const item of brokenDocLinks) console.error(`- ${item}`)
  process.exit(1)
}
console.log(`Documentation checks passed for ${markdownFiles.length} markdown files and ${gitbookConfigRel}.`)
