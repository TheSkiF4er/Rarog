#!/usr/bin/env node
/**
 * packages/cli/src/index.ts
 * CLI для Rarog — Node.js (TypeScript)
 * Автор: TheSkiF4er
 * Описание: полнофункциональный CLI для управления темами, сборкой, документацией и утилитами
 * Язык: TypeScript (Node 18+)
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'package.json'), 'utf8'));
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');

function run(cmd: string, args: string[], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  const cwd = options.cwd ?? process.cwd();
  const env = { ...process.env, ...(options.env ?? {}) };
  const res = spawnSync(cmd, args, { stdio: 'inherit', cwd, env });
  if (res.error) throw res.error;
  if (res.status && res.status !== 0) {
    const err = new Error(`Команда \"${cmd} ${args.join(' ')}\" завершилась с кодом ${res.status}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    err.code = res.status;
    throw err;
  }
}

function tryRun(cmd: string, args: string[], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  try {
    run(cmd, args, options);
  } catch (e: any) {
    console.error(`Ошибка при выполнении: ${cmd} ${args.join(' ')}\n`, e.message || e);
    process.exit(e.code || 2);
  }
}

function fileExists(p: string) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

const program = new Command();
program.name('rarog').description('Rarog CLI — управление темами, сборкой и документацией').version(pkg.version || '0.0.0');

program
  .command('init')
  .description('Создать шаблон rarog.config.js в текущей директории (если его ещё нет)')
  .option('--template <name>', 'имя шаблона (минимальный, default)', 'minimal')
  .action((opts: { template: string }) => {
    const target = path.resolve(process.cwd(), 'rarog.config.js');
    if (fileExists(target)) {
      console.error('Файл rarog.config.js уже существует. Отмена.');
      process.exit(1);
    }
    const content = `module.exports = {
  name: 'rarog',
  version: '0.1.0',
  theme: {
    colors: { primary: '30 120 255', bg: '255 255 255' },
    spacing: [0,4,8,12,16],
    radius: { sm: '6px', md: '12px' }
  }
};\n`;
    fs.writeFileSync(target, content, 'utf8');
    console.log('Создан rarog.config.js — отредактируйте файл под ваши нужды.');
  });

program
  .command('theme:generate')
  .description('Сгенерировать CSS-токены и CSS-файл темы по rarog.config.js')
  .option('--config <file>', 'путь к конфигу (JS/JSON)', 'rarog.config.js')
  .option('--out-dir <dir>', 'папка вывода', 'packages/core/dist')
  .action((opts: { config: string; outDir: string }) => {
    const cfgPath = path.resolve(process.cwd(), opts.config);
    if (!fileExists(cfgPath)) {
      console.error(`Конфиг не найден: ${cfgPath}`);
      process.exit(1);
    }
    // prefer local script in /scripts/generate-theme.js
    const localScript = path.resolve(process.cwd(), 'scripts', 'generate-theme.js');
    if (fileExists(localScript)) {
      tryRun(process.execPath, [localScript, '--config', cfgPath, '--out-dir', opts.outDir]);
      return;
    }
    // fallback to package cli dist script
    const pkgScript = path.resolve(process.cwd(), 'packages', 'cli', 'dist', 'index.js');
    if (fileExists(pkgScript)) {
      tryRun(process.execPath, [pkgScript, 'theme:generate', '--config', cfgPath, '--out-dir', opts.outDir]);
      return;
    }
    console.error('Генератор темы не найден ни в scripts/, ни в packages/cli/dist.');
    process.exit(2);
  });

program
  .command('build')
  .description('Собрать все пакеты (pnpm -w run build)')
  .action(() => {
    if (!fileExists(path.resolve(process.cwd(), 'pnpm-workspace.yaml')) && !fileExists(path.resolve(process.cwd(), 'packages'))) {
      console.warn('Внимание: не обнаружено monorepo конфигурации в текущем каталоге. Продолжение...');
    }
    tryRun('pnpm', ['-w', 'run', 'build']);
  });

program
  .command('docs:dev')
  .description('Запустить локальный dev server для docs (docusaurus / vitepress)')
  .action(() => {
    const docsDir = path.resolve(process.cwd(), 'docs');
    if (!fileExists(docsDir)) {
      console.error('Каталог docs не найден в проекте.');
      process.exit(1);
    }
    tryRun('pnpm', ['--filter', 'docs', 'dev'], { cwd: process.cwd() });
  });

program
  .command('docs:build')
  .description('Собрать сайт документации')
  .action(() => {
    const docsDir = path.resolve(process.cwd(), 'docs');
    if (!fileExists(docsDir)) {
      console.error('Каталог docs не найден в проекте.');
      process.exit(1);
    }
    tryRun('pnpm', ['--filter', 'docs', 'build'], { cwd: process.cwd() });
  });

program
  .command('serve')
  .description('Локально развернуть статический сайт (docs или dist)')
  .option('--dir <dir>', 'путь к директории (по умолчанию — docs/.docusaurus/build или packages/core/dist)', '')
  .option('--port <n>', 'порт', '8080')
  .action((opts: { dir: string; port: string }) => {
    let dir = opts.dir;
    if (!dir) {
      const cand1 = path.resolve(process.cwd(), 'docs', '.docusaurus', 'build');
      const cand2 = path.resolve(process.cwd(), 'packages', 'core', 'dist');
      if (fileExists(cand1)) dir = cand1;
      else if (fileExists(cand2)) dir = cand2;
      else dir = path.resolve(process.cwd(), 'dist');
    }
    if (!fileExists(dir)) {
      console.error(`Директория для сервера не найдена: ${dir}`);
      process.exit(1);
    }
    // try npx http-server, otherwise node simple server
    const httpServerCmd = 'npx';
    try {
      tryRun(httpServerCmd, ['--yes', 'http-server', dir, '-p', opts.port]);
    } catch (e) {
      // fallback to node simple server
      const serveScript = `const http = require('http'), fs = require('fs'), path = require('path');
const port = process.env.PORT || ${opts.port};
const dir = '${dir.replace(/\\/g, '\\\\')}';
http.createServer((req, res) => {
  try {
    let p = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
    if (p.endsWith('/')) p = path.join(p, 'index.html');
    if (!fs.existsSync(p)) { res.statusCode = 404; res.end('Not found'); return; }
    const s = fs.createReadStream(p);
    res.setHeader('Content-Type', 'text/html');
    s.pipe(res);
  } catch (err) { res.statusCode = 500; res.end('Server error'); }
}).listen(port, ()=> console.log('Serving', dir, 'on port', port));`;
      tryRun(process.execPath, ['-e', serveScript]);
    }
  });

program
  .command('lint')
  .description('Запустить линтеры (eslint/stylelint/prettier)')
  .option('--fix', 'автофикс', false)
  .action((opts: { fix: boolean }) => {
    const args = opts.fix ? ['-w', 'run', 'lint:fix'] : ['-w', 'run', 'lint'];
    tryRun('pnpm', args);
  });

program
  .command('test')
  .description('Запустить тесты (unit, integration)')
  .action(() => {
    tryRun('pnpm', ['-w', 'run', 'test']);
  });

program
  .command('version')
  .description('Показать версию Rarog CLI')
  .action(() => {
    console.log(pkg.version || '0.0.0');
  });

program
  .command('doctor')
  .description('Проверить окружение: pnpm, node, docker (опционально)')
  .action(() => {
    const checks = [
      { name: 'Node.js', cmd: 'node', args: ['--version'] },
      { name: 'pnpm', cmd: 'pnpm', args: ['--version'] },
      { name: 'Docker (optional)', cmd: 'docker', args: ['--version'], optional: true },
    ];
    let ok = true;
    checks.forEach(c => {
      try {
        const r = spawnSync(c.cmd, c.args, { encoding: 'utf8' });
        if (r.status === 0) console.log(`✔ ${c.name}: ${r.stdout.trim()}`);
        else if (c.optional) console.log(`ℹ ${c.name}: not found (optional)`);
        else { console.error(`✖ ${c.name}: not found`); ok = false; }
      } catch (e) {
        if (c.optional) console.log(`ℹ ${c.name}: not found (optional)`);
        else { console.error(`✖ ${c.name}: not found`); ok = false; }
      }
    });
    process.exit(ok ? 0 : 2);
  });

program.parse(process.argv);

// if no args, show help
if (!process.argv.slice(2).length) program.outputHelp();
