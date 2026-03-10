import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const packageSpecs = [
  {
    name: 'rarog',
    dir: '.',
    requiredFiles: [
      'package.json','README.md','LICENSE',
      'packages/cli/bin/rarog.js','packages/cli/lib/api.js','packages/cli/lib/config.js','packages/cli/lib/fs.js',
      'packages/core/dist/rarog-core.min.css','packages/utilities/dist/rarog-utilities.min.css','packages/components/dist/rarog-components.min.css',
      'packages/themes/dist/rarog-theme-default.min.css','packages/themes/dist/rarog-theme-dark.min.css','packages/themes/dist/rarog-theme-contrast.min.css','packages/themes/dist/rarog-theme-creative.min.css','packages/themes/dist/rarog-theme-enterprise.min.css'
    ],
    buildOutputs: [
      'packages/core/dist/rarog-core.min.css','packages/utilities/dist/rarog-utilities.min.css','packages/components/dist/rarog-components.min.css',
      'packages/themes/dist/rarog-theme-default.min.css','packages/themes/dist/rarog-theme-dark.min.css','packages/themes/dist/rarog-theme-contrast.min.css','packages/themes/dist/rarog-theme-creative.min.css','packages/themes/dist/rarog-theme-enterprise.min.css'
    ],
    allowedRoots: ['package.json', 'README.md', 'LICENSE', 'packages'],
    forbiddenPatterns: [/^node_modules\//,/^\.artifacts\//,/^tests\//,/^stories\//,/^docs\//,/^playwright\./,/^vite(?:\.config)?/,/^tsconfig(?:\.|$)/,/^vitest(?:\.|$)/,/^\.storybook\//,/^\.github\//,/^design\//,/^examples\//,/^plugins\//,/^packages\/[^/]+\/src\//]
  },
  {
    name: '@rarog/js', dir: 'packages/js',
    requiredFiles: ['package.json','dist/index.mjs','dist/index.cjs','dist/index.d.ts','dist/rarog.esm.js','dist/rarog.cjs','dist/rarog.iife.js','dist/rarog.js'],
    buildOutputs: ['dist/index.mjs','dist/index.cjs','dist/index.d.ts','dist/rarog.esm.js','dist/rarog.cjs','dist/rarog.iife.js','dist/rarog.js'],
    allowedRoots: ['dist', 'package.json']
  },
  {
    name: '@rarog/react', dir: 'packages/react',
    requiredFiles: ['package.json','dist/index.mjs','dist/index.d.ts','README.md'],
    buildOutputs: ['dist/index.mjs','dist/index.d.ts'],
    allowedRoots: ['dist', 'package.json', 'README.md']
  },
  {
    name: '@rarog/vue', dir: 'packages/vue',
    requiredFiles: ['package.json','dist/index.mjs','dist/index.d.ts','README.md'],
    buildOutputs: ['dist/index.mjs','dist/index.d.ts'],
    allowedRoots: ['dist', 'package.json', 'README.md']
  }
]

const defaultForbiddenPatterns = [/^node_modules\//,/^\.artifacts\//,/^tests\//,/^stories\//,/^docs\//,/^src\//,/^playwright\./,/^vite(?:\.config)?/,/^tsconfig(?:\.|$)/,/^vitest(?:\.|$)/,/^\.storybook\//,/^\.github\//,/^design\//,/^examples\//,/^plugins\//]

function runPackDryRun(packageDir) {
  const output = execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], { cwd: path.join(root, packageDir), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  const parsed = JSON.parse(output)
  if (!Array.isArray(parsed) || !parsed[0]?.files) throw new Error(`Unexpected npm pack output for ${packageDir}`)
  return parsed[0]
}

function hasAllowedRoot(file, allowedRoots) {
  return allowedRoots.some((allowedRoot) => file === allowedRoot || file.startsWith(`${allowedRoot}/`))
}

function verifyBuildOutputs(spec) {
  const missing = (spec.buildOutputs || []).filter((rel) => !fs.existsSync(path.join(root, spec.dir, rel)))
  if (!missing.length) {
    console.log(`[OK] ${spec.name}: build outputs exist before artifact verification`)
    return true
  }
  console.error(`[FAIL] ${spec.name}: verify:artifacts must run after a full build. Missing:`)
  for (const file of missing) console.error(`  - ${path.join(spec.dir, file)}`)
  return false
}

let failed = false
for (const spec of packageSpecs) {
  if (!fs.existsSync(path.join(root, spec.dir, 'package.json'))) {
    console.error(`[FAIL] ${spec.name}: missing ${spec.dir}/package.json`)
    failed = true
    continue
  }
  if (!verifyBuildOutputs(spec)) {
    failed = true
    continue
  }
  let packInfo
  try { packInfo = runPackDryRun(spec.dir) } catch (error) {
    console.error(`[FAIL] ${spec.name}: npm pack --dry-run failed`)
    console.error(String(error.message || error))
    failed = true
    continue
  }
  const files = new Set(packInfo.files.map((entry) => entry.path))
  const packageSize = packInfo.files.reduce((sum, entry) => sum + (entry.size || 0), 0)
  const missing = spec.requiredFiles.filter((file) => !files.has(file))
  if (missing.length) {
    console.error(`[FAIL] ${spec.name}: tarball is missing required files:`)
    for (const file of missing) console.error(`  - ${file}`)
    failed = true
  } else {
    console.log(`[OK] ${spec.name}: tarball contains required runtime files`)
  }
  const forbiddenPatterns = spec.forbiddenPatterns || defaultForbiddenPatterns
  const forbidden = [...files].filter((file) => forbiddenPatterns.some((pattern) => pattern.test(file)))
  if (forbidden.length) {
    console.error(`[FAIL] ${spec.name}: tarball contains forbidden files:`)
    for (const file of forbidden) console.error(`  - ${file}`)
    failed = true
  } else {
    console.log(`[OK] ${spec.name}: tarball excludes forbidden sources and tooling files`)
  }
  const unexpected = [...files].filter((file) => !hasAllowedRoot(file, spec.allowedRoots))
  if (unexpected.length) {
    console.error(`[FAIL] ${spec.name}: tarball contains unexpected top-level content:`)
    for (const file of unexpected) console.error(`  - ${file}`)
    failed = true
  } else {
    console.log(`[OK] ${spec.name}: tarball stays within the expected publish surface`)
  }
  console.log(`[OK] ${spec.name}: npm pack --dry-run produced ${packInfo.files.length} files (${packageSize} bytes)`)
}
if (failed) process.exit(1)
