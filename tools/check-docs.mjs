import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const docsDir = 'docs'
const vitepressConfigRel = 'docs/.vitepress/config.ts'

async function readJson(relPath) {
  return JSON.parse(await readFile(path.join(root, relPath), 'utf8'))
}

async function exists(relPath) {
  try {
    await access(path.join(root, relPath))
    return true
  } catch {
    return false
  }
}

async function collectMarkdownFiles(dirRel) {
  const dir = path.join(root, dirRel)
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const rel = path.join(dirRel, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(rel)))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(rel)
    }
  }
  return files
}

function normalizeDocTarget(href) {
  const withoutHash = href.split('#')[0]
  const withoutQuery = withoutHash.split('?')[0]
  if (!withoutQuery || withoutQuery === '/') return 'docs/index.md'
  const trimmed = withoutQuery.replace(/^\//, '')
  const base = trimmed.endsWith('/') ? `${trimmed}index` : trimmed
  return `docs/${base}.md`
}

function isIgnoredHref(href) {
  return (
    !href ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#') ||
    href.startsWith('javascript:')
  )
}

if (!(await exists(docsDir))) {
  console.error(`Expected documentation directory ${docsDir}/ to exist.`)
  process.exit(1)
}

if (!(await exists(vitepressConfigRel))) {
  console.error(`Expected VitePress config at ${vitepressConfigRel}.`)
  process.exit(1)
}

const pkg = await readJson('package.json')
const scripts = new Set(Object.keys(pkg.scripts || {}))
const markdownFiles = [
  'README.md',
  'CONTRIBUTING.md',
  'RELEASE.md',
  ...(await collectMarkdownFiles(docsDir))
]

const scriptPattern = /npm run ([a-zA-Z0-9:_-]+)/g
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g
const allowedExternalScriptsByFile = new Map([
  ['docs/guide-laravel.md', new Set(['rarog:build'])],
  ['docs/guide-nextjs.md', new Set(['rarog:build'])],
  ['docs/guide-react.md', new Set(['dev'])],
  ['docs/integration-guides.md', new Set(['build:app'])],
  ['docs/playground.md', new Set(['playground'])]
])

const missingScripts = []
const brokenDocLinks = []
for (const relPath of markdownFiles) {
  const content = await readFile(path.join(root, relPath), 'utf8')
  for (const match of content.matchAll(scriptPattern)) {
    const scriptName = match[1]
    const allowedExternalScripts = allowedExternalScriptsByFile.get(relPath) || new Set()
    if (!scripts.has(scriptName) && !allowedExternalScripts.has(scriptName)) {
      missingScripts.push(`${relPath}: npm run ${scriptName}`)
    }
  }

  if (!relPath.startsWith('docs/')) continue

  for (const match of content.matchAll(markdownLinkPattern)) {
    const href = match[1].trim()
    if (isIgnoredHref(href)) continue
    if (href.endsWith('.png') || href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.svg')) continue

    if (href.startsWith('/')) {
      const target = normalizeDocTarget(href)
      if (!(await exists(target))) {
        brokenDocLinks.push(`${relPath}: ${href} -> missing ${target}`)
      }
      continue
    }

    if (href.startsWith('./') || href.startsWith('../')) {
      const fromDir = path.posix.dirname(relPath)
      const normalized = path.posix.normalize(path.posix.join(fromDir, href.split('#')[0].split('?')[0]))
      const target = normalized.endsWith('.md') ? normalized : `${normalized}.md`
      if (!(await exists(target))) {
        brokenDocLinks.push(`${relPath}: ${href} -> missing ${target}`)
      }
    }
  }
}

if (missingScripts.length > 0) {
  console.error('Found documentation references to missing npm scripts:')
  for (const item of missingScripts) {
    console.error(`- ${item}`)
  }
  process.exit(1)
}

if (brokenDocLinks.length > 0) {
  console.error('Found broken internal documentation links:')
  for (const item of brokenDocLinks) {
    console.error(`- ${item}`)
  }
  process.exit(1)
}

console.log(
  `Documentation checks passed for ${markdownFiles.length} markdown files and ${vitepressConfigRel}.`
)
