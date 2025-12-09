#!/usr/bin/env node
/*
 bump-version.js — утилита обновления версий в monorepo Rarog
 Автор: TheSkiF4er
 Описание: простой, безопасный скрипт для bump версии в корне и в пакетах (packages/*).
 Поддерживает:
   - ./scripts/bump-version.js --type patch|minor|major    (увеличить версию semver)
   - ./scripts/bump-version.js --version 1.2.3            (установить конкретную версию)
   - --packages "packages/core,packages/react"            (список пакетов, по умолчанию packages/*)
   - --no-commit                                          (не выполнять git commit / tag)
   - --changelog "Добавлено: ..."                         (короткий текст для добавления в CHANGELOG.md)

 Примечание: этот скрипт делает простую операцию редактирования package.json файлов и
 может выполнять git commit и tag (по умолчанию). Перед запуском убедитесь, что у вас
 чистое рабочее дерево (git status -s должен быть пуст).

 Пример использования:
   node scripts/bump-version.js --type minor
   node scripts/bump-version.js --version 1.0.0 --no-commit
*/

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJSON(file, obj) {
  const content = JSON.stringify(obj, null, 2) + '\n';
  fs.writeFileSync(file, content, 'utf8');
}

function exec(cmd, opts = {}) {
  return child_process.execSync(cmd, { stdio: 'inherit', ...opts });
}

function usageAndExit(msg) {
  if (msg) console.error(msg);
  console.log(`\nUsage:\n  node scripts/bump-version.js [--type patch|minor|major] [--version x.y.z] [--packages p1,p2] [--no-commit] [--changelog "text"]\n`);
  process.exit(msg ? 1 : 0);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { type: null, version: null, packages: null, commit: true, changelog: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--type') { out.type = args[++i]; continue; }
    if (a === '--version') { out.version = args[++i]; continue; }
    if (a === '--packages') { out.packages = args[++i]; continue; }
    if (a === '--no-commit') { out.commit = false; continue; }
    if (a === '--changelog') { out.changelog = args[++i]; continue; }
    if (a === '--help' || a === '-h') usageAndExit();
    usageAndExit(`Неизвестный аргумент: ${a}`);
  }
  if (!out.type && !out.version) usageAndExit('Требуется --type или --version');
  return out;
}

function bumpSemver(current, type) {
  const m = current.trim().match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!m) throw new Error(`Невалидная версия: ${current}`);
  let [_, major, minor, patch] = m;
  major = parseInt(major, 10);
  minor = parseInt(minor, 10);
  patch = parseInt(patch, 10);
  if (type === 'patch') patch += 1;
  else if (type === 'minor') { minor += 1; patch = 0; }
  else if (type === 'major') { major += 1; minor = 0; patch = 0; }
  else throw new Error(`Неизвестный тип bump: ${type}`);
  return `${major}.${minor}.${patch}`;
}

function findPackages(globStr) {
  // простая реализация: если globStr задан как comma-separated, используем его, иначе берём packages/*
  if (globStr) return globStr.split(',').map(p => p.trim()).filter(Boolean);
  const dir = path.resolve(process.cwd(), 'packages');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map(d => path.join('packages', d)).filter(p => fs.existsSync(path.join(p, 'package.json')));
}

function ensureCleanGit() {
  const out = child_process.execSync('git status --porcelain').toString().trim();
  if (out) {
    console.error('Рабочее дерево не чистое. Пожалуйста, закоммитьте или отложите изменения перед bump версии.');
    console.error(out);
    process.exit(2);
  }
}

(async function main() {
  try {
    const opts = parseArgs();
    const rootPkgPath = path.resolve(process.cwd(), 'package.json');
    if (!fs.existsSync(rootPkgPath)) throw new Error('package.json в корне не найден');

    const rootPkg = readJSON(rootPkgPath);
    const currentVersion = rootPkg.version;
    if (!currentVersion) throw new Error('В package.json корня не указана версия');

    const targetVersion = opts.version || bumpSemver(currentVersion, opts.type);
    console.log(`Current version: ${currentVersion} -> Target version: ${targetVersion}`);

    const packages = findPackages(opts.packages);
    console.log('Пакеты для обновления:', packages.join(', ') || '<ничего>');

    // Проверяем git
    if (opts.commit) ensureCleanGit();

    // Обновляем root package.json
    rootPkg.version = targetVersion;
    writeJSON(rootPkgPath, rootPkg);
    console.log('Обновлён root package.json');

    // Обновляем версии в пакетах и зависимости внутри монорепо (простая замена @rarog/* версий)
    for (const pkgRel of packages) {
      const pkgPath = path.resolve(process.cwd(), pkgRel, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      const pkg = readJSON(pkgPath);
      const old = pkg.version || '0.0.0';
      pkg.version = targetVersion;

      // Обновляем локальные зависимости типа @rarog/*
      ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach(field => {
        if (!pkg[field]) return;
        for (const dep of Object.keys(pkg[field])) {
          if (dep.startsWith('@rarog/')) {
            // если версия указана как workspace:* или ^x.y.z — заменим на exact version
            pkg[field][dep] = targetVersion;
          }
        }
      });

      writeJSON(pkgPath, pkg);
      console.log(`Updated ${pkgRel}/package.json: ${old} -> ${pkg.version}`);
    }

    // Обновить зависимости в корневом package.json (если есть локальные ссылки)
    ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach(field => {
      if (!rootPkg[field]) return;
      for (const dep of Object.keys(rootPkg[field])) {
        if (dep.startsWith('@rarog/')) rootPkg[field][dep] = targetVersion;
      }
    });
    writeJSON(rootPkgPath, rootPkg);

    // Дополнительно можно обновить другие места (README badges и т.д.) — опция для будущих релизов

    // CHANGELOG
    if (opts.changelog) {
      const changelogPath = path.resolve(process.cwd(), 'CHANGELOG.md');
      const header = `## ${targetVersion} - ${new Date().toISOString().split('T')[0]}\n\n`;
      const content = `${header}${opts.changelog}\n\n`;
      if (fs.existsSync(changelogPath)) {
        const prev = fs.readFileSync(changelogPath, 'utf8');
        fs.writeFileSync(changelogPath, content + prev, 'utf8');
      } else {
        fs.writeFileSync(changelogPath, `# Changelog\n\n${content}`, 'utf8');
      }
      console.log('CHANGELOG.md обновлён');
    }

    // Git commit & tag
    if (opts.commit) {
      exec('git add -A');
      exec(`git commit -m "chore(release): bump version to ${targetVersion}"`);
      exec(`git tag v${targetVersion}`);
      console.log('Закоммичены изменения и добавлен тег');
      console.log('Теперь надо запушить: git push origin HEAD && git push origin v' + targetVersion);
    } else {
      console.log('commit disabled with --no-commit — изменения не закоммичены');
    }

    console.log('Готово.');
  } catch (err) {
    console.error('Ошибка:', err.message || err);
    process.exit(1);
  }
})();
