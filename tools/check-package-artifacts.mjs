import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const packageSpecs = [
  {
    name: '@rarog/js',
    dir: 'packages/js',
    requiredFiles: [
      'package.json',
      'dist/index.mjs',
      'dist/index.cjs',
      'dist/index.d.ts',
      'dist/rarog.esm.js',
      'dist/rarog.cjs'
    ]
  },
  {
    name: '@rarog/react',
    dir: 'packages/react',
    requiredFiles: ['package.json', 'dist/index.mjs', 'dist/index.d.ts']
  },
  {
    name: '@rarog/vue',
    dir: 'packages/vue',
    requiredFiles: ['package.json', 'dist/index.mjs', 'dist/index.d.ts']
  }
]

const forbiddenPatterns = [/^node_modules\//, /^\.artifacts\//, /^tests\//, /^stories\//]

function runPackDryRun(packageDir) {
  const output = execFileSync(
    'npm',
    ['pack', '--dry-run', '--ignore-scripts', '--json'],
    {
      cwd: path.join(root, packageDir),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }
  ).trim()

  const parsed = JSON.parse(output)
  if (!Array.isArray(parsed) || parsed.length === 0 || !Array.isArray(parsed[0].files)) {
    throw new Error(`Unexpected npm pack output for ${packageDir}`)
  }

  return parsed[0]
}

let failed = false

for (const spec of packageSpecs) {
  const pkgJsonPath = path.join(root, spec.dir, 'package.json')
  if (!fs.existsSync(pkgJsonPath)) {
    console.error(`[FAIL] ${spec.name}: missing ${spec.dir}/package.json`)
    failed = true
    continue
  }

  let packInfo
  try {
    packInfo = runPackDryRun(spec.dir)
  } catch (error) {
    console.error(`[FAIL] ${spec.name}: npm pack --dry-run failed`)
    console.error(String(error.message || error))
    failed = true
    continue
  }

  const files = new Set(packInfo.files.map((entry) => entry.path))
  const packageSize = packInfo.files.reduce((sum, entry) => sum + (entry.size || 0), 0)

  const missing = spec.requiredFiles.filter((file) => !files.has(file))
  if (missing.length > 0) {
    console.error(`[FAIL] ${spec.name}: tarball is missing required files:`)
    for (const file of missing) {
      console.error(`  - ${file}`)
    }
    failed = true
  } else {
    console.log(`[OK] ${spec.name}: tarball contains required runtime files`)
  }

  const forbidden = [...files].filter((file) => forbiddenPatterns.some((pattern) => pattern.test(file)))
  if (forbidden.length > 0) {
    console.error(`[FAIL] ${spec.name}: tarball contains forbidden files:`)
    for (const file of forbidden) {
      console.error(`  - ${file}`)
    }
    failed = true
  } else {
    console.log(`[OK] ${spec.name}: tarball excludes obvious junk`)
  }

  const packageReadme = 'README.md'
  if (files.has(packageReadme)) {
    console.log(`[OK] ${spec.name}: tarball includes README.md`)
  } else {
    console.log(`[INFO] ${spec.name}: tarball does not include README.md`)
  }

  console.log(`[OK] ${spec.name}: npm pack --dry-run produced ${packInfo.files.length} files (${packageSize} bytes)`)
}

if (failed) {
  process.exit(1)
}
