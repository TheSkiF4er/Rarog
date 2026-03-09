import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'))
}

function readText(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8')
}

function hasFile(rel) {
  return fs.existsSync(path.join(root, rel))
}

function check(rel, label, predicate) {
  return { rel, label, predicate }
}

function includesAll(text, fragments) {
  return fragments.every((fragment) => text.includes(fragment))
}

const rootPkg = readJson('package.json')
const jsPkg = readJson('packages/js/package.json')
const reactPkg = readJson('packages/react/package.json')
const vuePkg = readJson('packages/vue/package.json')
const releaseWorkflow = readText('.github/workflows/release.yml')
const ciWorkflow = readText('.github/workflows/ci.yml')
const docsWorkflow = readText('.github/workflows/docs.yml')
const version = rootPkg.version

const docsConfigPath = 'docs/.vitepress/config.ts'
const lockfilePath = 'package-lock.json'
const rootReleaseProxyPath = 'check-release.mjs'
const legacyArtifacts = ['ci.yml.tmp', 'release.yml.tmp', 'docs.yml.tmp', 'check-release.mjs.bak']

const checks = [
  {
    title: 'Root scripts and dependencies',
    items: [
      check('package.json', 'root build script exists', () => rootPkg.scripts?.build),
      check('package.json', 'root build:css script exists', () => rootPkg.scripts?.['build:css']),
      check('package.json', 'root build:js script exists', () => rootPkg.scripts?.['build:js']),
      check('package.json', 'root build:adapters script exists', () => rootPkg.scripts?.['build:adapters']),
      check('package.json', 'root build:all script exists', () => rootPkg.scripts?.['build:all']),
      check('package.json', 'root build delegates to build:all', () => rootPkg.scripts?.build === 'npm run build:all'),
      check('package.json', 'root pack:packages script exists', () => rootPkg.scripts?.['pack:packages']),
      check('package.json', 'root release:check script exists', () => rootPkg.scripts?.['release:check']),
      check('package.json', 'root release:verify script exists', () => rootPkg.scripts?.['release:verify']),
      check('package.json', 'root release:verify includes docs:check', () => rootPkg.scripts?.['release:verify']?.includes('docs:check')),
      check('package.json', 'root docs:lint script exists', () => rootPkg.scripts?.['docs:lint']),
      check('package.json', 'root docs:check script exists', () => rootPkg.scripts?.['docs:check']),
      check('package.json', 'root verify:artifacts script exists', () => rootPkg.scripts?.['verify:artifacts']),
      check('package.json', 'root test:adapters script exists', () => rootPkg.scripts?.['test:adapters']),
      check('package.json', 'root test:contracts script exists', () => rootPkg.scripts?.['test:contracts']),
      check('package.json', 'root test:release script exists', () => rootPkg.scripts?.['test:release']),
      check('package.json', 'root test:release includes unit, adapter, and contract tests', () => includesAll(rootPkg.scripts?.['test:release'] || '', ['test:unit', 'test:adapters', 'test:contracts'])),
      check('package.json', 'root storybook script exists', () => rootPkg.scripts?.storybook),
      check('package.json', 'root storybook:build script exists', () => rootPkg.scripts?.['storybook:build']),
      check(lockfilePath, 'root package-lock.json exists for npm ci reproducibility', () => hasFile(lockfilePath)),
      check(docsConfigPath, 'vitepress config exists at docs/.vitepress/config.ts', () => hasFile(docsConfigPath)),
      check('package.json', 'esbuild is declared in devDependencies', () => rootPkg.devDependencies?.esbuild),
      check('package.json', 'react is declared in devDependencies', () => rootPkg.devDependencies?.react),
      check('package.json', 'react-dom is declared in devDependencies', () => rootPkg.devDependencies?.['react-dom']),
      check('package.json', 'vue is declared in devDependencies', () => rootPkg.devDependencies?.vue),
      check('package.json', 'jsdom is declared in devDependencies', () => rootPkg.devDependencies?.jsdom),
      check('package.json', 'storybook is declared in devDependencies', () => rootPkg.devDependencies?.storybook),
      check('package.json', 'vite is declared in devDependencies', () => rootPkg.devDependencies?.vite),
      check('package.json', '@storybook/html-vite is declared in devDependencies', () => rootPkg.devDependencies?.['@storybook/html-vite']),
      check('package.json', '@storybook/addon-docs is declared in devDependencies', () => rootPkg.devDependencies?.['@storybook/addon-docs']),
      check('package.json', '@storybook/addon-a11y is declared in devDependencies', () => rootPkg.devDependencies?.['@storybook/addon-a11y'])
    ]
  },
  {
    title: 'Package manifests and version sync',
    items: [
      check('packages/js/package.json', `js package version matches ${version}`, () => jsPkg.version === version),
      check('packages/react/package.json', `react package version matches ${version}`, () => reactPkg.version === version),
      check('packages/vue/package.json', `vue package version matches ${version}`, () => vuePkg.version === version),
      check('packages/js/package.json', 'js import export points to dist/index.mjs', () => jsPkg.exports?.['.']?.import === './dist/index.mjs'),
      check('packages/js/package.json', 'js require export points to dist/index.cjs', () => jsPkg.exports?.['.']?.require === './dist/index.cjs'),
      check('packages/js/package.json', 'js runtime import export points to dist/rarog.esm.js', () => jsPkg.exports?.['./runtime']?.import === './dist/rarog.esm.js'),
      check('packages/js/package.json', 'js runtime require export points to dist/rarog.cjs', () => jsPkg.exports?.['./runtime']?.require === './dist/rarog.cjs'),
      check('packages/js/package.json', 'js package publishes only dist via files', () => Array.isArray(jsPkg.files) && jsPkg.files.length === 1 && jsPkg.files[0] === 'dist'),
      check('packages/js/package.json', 'js types points to dist/index.d.ts', () => jsPkg.types === 'dist/index.d.ts'),
      check('packages/react/package.json', 'react main points to dist', () => reactPkg.main === 'dist/index.mjs'),
      check('packages/react/package.json', 'react types points to dist/index.d.ts', () => reactPkg.types === 'dist/index.d.ts'),
      check('packages/react/package.json', 'react package publishes dist and README only', () => Array.isArray(reactPkg.files) && reactPkg.files.join(',') === 'dist,README.md'),
      check('packages/react/package.json', 'react package declares peer dependencies', () => reactPkg.peerDependencies?.react && reactPkg.peerDependencies?.['react-dom']),
      check('packages/vue/package.json', 'vue main points to dist', () => vuePkg.main === 'dist/index.mjs'),
      check('packages/vue/package.json', 'vue types points to dist/index.d.ts', () => vuePkg.types === 'dist/index.d.ts'),
      check('packages/vue/package.json', 'vue package publishes dist and README only', () => Array.isArray(vuePkg.files) && vuePkg.files.join(',') === 'dist,README.md'),
      check('packages/vue/package.json', 'vue package declares peer dependency', () => vuePkg.peerDependencies?.vue)
    ]
  },
  {
    title: 'Banners and tooling',
    items: [
      check('tools/pack-packages.mjs', 'pack packages tool exists', () => hasFile('tools/pack-packages.mjs')),
      check('tools/check-package-artifacts.mjs', 'artifact verification tool exists', () => hasFile('tools/check-package-artifacts.mjs')),
      check('tools/check-docs-output.mjs', 'docs build output checker exists', () => hasFile('tools/check-docs-output.mjs')),
      check('packages/core/src/rarog-core.css', 'core banner version is synced', () => readText('packages/core/src/rarog-core.css').includes(`Rarog Core ${version}`)),
      check('packages/components/src/rarog-components.css', 'components banner version is synced', () => readText('packages/components/src/rarog-components.css').includes(`Rarog Components ${version}`)),
      check('packages/utilities/src/rarog-utilities.css', 'utilities banner version is synced', () => readText('packages/utilities/src/rarog-utilities.css').includes(`Rarog Utilities ${version}`)),
      check('packages/js/src/rarog.esm.js', 'js banner version is synced', () => readText('packages/js/src/rarog.esm.js').includes(`Rarog JS Core v${version}`)),
      check('tests/rarog-js-core.test.html', 'html smoke banner version is synced', () => readText('tests/rarog-js-core.test.html').includes(`Rarog JS Core v${version}`)),
      check(rootReleaseProxyPath, 'root check-release proxy exists', () => hasFile(rootReleaseProxyPath)),
      check(rootReleaseProxyPath, 'root check-release proxy delegates to tools/check-release.mjs', () => readText(rootReleaseProxyPath).trim() === "import './tools/check-release.mjs'"),
      check('.', 'legacy temp policy files are absent', () => legacyArtifacts.every((rel) => !hasFile(rel)))
    ]
  },
  {
    title: 'Workflow contracts',
    items: [
      check('.github/workflows/ci.yml', 'CI workflow uses npm ci', () => ciWorkflow.includes('npm ci')),
      check('.github/workflows/ci.yml', 'CI runs docs:lint', () => ciWorkflow.includes('npm run docs:lint')),
      check('.github/workflows/ci.yml', 'CI runs verify:artifacts after build', () => ciWorkflow.includes('npm run verify:artifacts')),
      check('.github/workflows/release.yml', 'release workflow uses npm ci', () => releaseWorkflow.includes('npm ci')),
      check('.github/workflows/release.yml', 'release workflow runs canonical release tests before publish', () => releaseWorkflow.includes('npm run test:release') || includesAll(releaseWorkflow, ['npm run test:unit', 'npm run test:adapters', 'npm run test:contracts'])),
      check('.github/workflows/release.yml', 'release workflow verifies artifacts before packing', () => releaseWorkflow.includes('npm run verify:artifacts')),
      check('.github/workflows/release.yml', 'release workflow packs publishable packages before publish', () => releaseWorkflow.includes('npm run pack:packages')),
      check('.github/workflows/docs.yml', 'docs workflow runs docs:check', () => docsWorkflow.includes('npm run docs:check'))
    ]
  }
]

let failed = false
for (const section of checks) {
  console.log(`\n# ${section.title}`)
  for (const item of section.items) {
    if (!item.predicate()) {
      failed = true
      console.error(`[FAIL] ${item.label} (${item.rel})`)
    } else {
      console.log(`[OK] ${item.label}`)
    }
  }
}

if (failed) {
  process.exit(1)
}
