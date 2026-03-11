import { mkdir, readFile, readdir, rm, stat, writeFile, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const docsRoot = path.join(root, 'docs')
const outDir = path.join(root, '.gitbook', 'dist')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function renderMarkdown(md) {
  const lines = md.split(/\r?\n/)
  const html = []
  let inCode = false
  let codeLang = ''
  let listType = null
  let paragraph = []

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`)
      paragraph = []
    }
  }
  const flushList = () => {
    if (listType) {
      html.push(`</${listType}>`)
      listType = null
    }
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      flushParagraph(); flushList()
      if (!inCode) {
        inCode = true
        codeLang = line.slice(3).trim()
        html.push(`<pre><code class="language-${escapeHtml(codeLang)}">`)
      } else {
        html.push('</code></pre>')
        inCode = false
        codeLang = ''
      }
      continue
    }
    if (inCode) {
      html.push(`${escapeHtml(line)}\n`)
      continue
    }
    if (/^#{1,6}\s+/.test(line)) {
      flushParagraph(); flushList()
      const level = line.match(/^#+/)[0].length
      const text = line.replace(/^#{1,6}\s+/, '')
      html.push(`<h${level}>${inlineMarkdown(text)}</h${level}>`)
      continue
    }
    if (/^\s*[-*]\s+/.test(line)) {
      flushParagraph()
      if (listType !== 'ul') {
        flushList(); listType = 'ul'; html.push('<ul>')
      }
      html.push(`<li>${inlineMarkdown(line.replace(/^\s*[-*]\s+/, ''))}</li>`)
      continue
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      flushParagraph()
      if (listType !== 'ol') {
        flushList(); listType = 'ol'; html.push('<ol>')
      }
      html.push(`<li>${inlineMarkdown(line.replace(/^\s*\d+\.\s+/, ''))}</li>`)
      continue
    }
    if (!line.trim()) {
      flushParagraph(); flushList(); continue
    }
    if (line.startsWith('|') && line.endsWith('|')) {
      flushParagraph(); flushList()
      html.push(`<pre><code>${escapeHtml(line)}</code></pre>`)
      continue
    }
    paragraph.push(line.trim())
  }
  flushParagraph(); flushList()
  return html.join('\n')
}

async function* walk(dir, rel = '') {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const entryRel = path.join(rel, entry.name)
    const abs = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(abs, entryRel)
    } else {
      yield { abs, rel: entryRel }
    }
  }
}

const summary = await readFile(path.join(docsRoot, 'SUMMARY.md'), 'utf8')
const navItems = [...summary.matchAll(/^- \[(.+?)\]\((.+?)\)/gm)].map((m) => ({ title: m[1], href: m[2] }))

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const navHtml = navItems.map((item) => `<li><a href="${item.href.replace(/\.md$/, '.html')}">${escapeHtml(item.title)}</a></li>`).join('')

for await (const file of walk(docsRoot)) {
  const ext = path.extname(file.rel)
  const source = file.abs
  if (ext === '.md') {
    const md = await readFile(source, 'utf8')
    const title = (md.match(/^#\s+(.+)$/m)?.[1] || path.basename(file.rel, '.md')).trim()
    const body = renderMarkdown(md)
    const outPath = path.join(outDir, file.rel.replace(/\.md$/, '.html'))
    await mkdir(path.dirname(outPath), { recursive: true })
    await writeFile(outPath, `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} · Rarog Docs</title><style>body{font-family:Inter,system-ui,sans-serif;margin:0;background:#f7f8fb;color:#172033}a{color:#1d4ed8;text-decoration:none}a:hover{text-decoration:underline}.shell{display:grid;grid-template-columns:280px 1fr;min-height:100vh}.nav{padding:24px;border-right:1px solid #dbe2f0;background:#fff;position:sticky;top:0;height:100vh;overflow:auto}.nav ul{padding-left:18px}.content{padding:32px;max-width:960px}pre{background:#0f172a;color:#e5edf8;padding:16px;border-radius:14px;overflow:auto}code{background:#eef2ff;padding:2px 6px;border-radius:6px}table{border-collapse:collapse}h1,h2,h3{line-height:1.2}@media(max-width:900px){.shell{grid-template-columns:1fr}.nav{position:relative;height:auto;border-right:0;border-bottom:1px solid #dbe2f0}}</style></head><body><div class="shell"><aside class="nav"><h1>Rarog Docs</h1><p>GitBook content export</p><ul>${navHtml}</ul></aside><main class="content">${body}</main></div></body></html>`)
  } else {
    const outPath = path.join(outDir, file.rel)
    await mkdir(path.dirname(outPath), { recursive: true })
    await copyFile(source, outPath)
  }
}

const indexPath = path.join(outDir, 'index.html')
try { await stat(indexPath) } catch {
  await copyFile(path.join(outDir, 'README.html'), indexPath)
}
await writeFile(path.join(outDir, '404.html'), await readFile(indexPath, 'utf8'))
console.log(`Built lightweight docs export in ${path.relative(root, outDir)}`)
