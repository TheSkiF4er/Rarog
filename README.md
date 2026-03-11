# Rarog CSS Framework 1.0.0

> **Rarog** — CSS-фреймворк и дизайн-система на базе design-tokens, utilities, компонентов и CLI.

<p align="left">
  <a href="https://github.com/TheSkiF4er/rarog/actions/workflows/ci.yml">
    <img src="https://github.com/TheSkiF4er/rarog/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://www.npmjs.com/package/rarog">
    <img src="https://img.shields.io/npm/v/rarog.svg?logo=npm" alt="npm" />
  </a>
  <a href="https://github.com/TheSkiF4er/rarog/releases">
    <img src="https://img.shields.io/github/v/release/TheSkiF4er/rarog?logo=github" alt="GitHub release" />
  </a>
  <a href="https://docs.skif4er.ru/rarog">
    <img src="https://img.shields.io/badge/docs-docs.skif4er.ru%2Frarog-blue?logo=readthedocs" alt="Docs" />
  </a>
</p>

- Текущая стабильная ветка: **1.x**
- Текущая версия: **1.0.0**
- Документация: `https://docs.skif4er.ru/rarog`

## Канонический install/build/publish flow

### Для пользователя CLI

```bash
npm install rarog
npx rarog init
npx rarog validate
npx rarog build
```

По умолчанию `init` создаёт ровно три файла:
- `rarog.config.js` — канонический theme-config;
- `rarog.build.json` — канонический build-manifest;
- `src/index.html` — минимальный smoke-input для JIT.

`rarog.config.ts` поддерживается только как compatibility-path. `rarog.config.json` остаётся legacy-форматом для build-manifest и больше не является каноническим путём.

### Для разработки репозитория

```bash
npm ci
npm run build
npm run test:ci
npm run verify:artifacts
```

Где:
- `npm run build` — каноническая полная сборка (`build:css + build:js + build:adapters`);
- `npm run test:ci` — unit/adapters/contracts + temp-project smoke test;
- `npm run verify:artifacts` — post-build проверка publishable tarball;
- `npm run pack:packages` — упаковка всех publishable пакетов в `.artifacts/`.

## Root package surface

Root package предсказуемо публикует CSS surface:
- `style` → `./packages/core/dist/rarog-core.min.css`
- subpath exports:
  - `rarog/core`
  - `rarog/utilities`
  - `rarog/components`
  - `rarog/themes/default`
  - `rarog/themes/dark`
  - `rarog/themes/contrast`
  - `rarog/themes/creative`
  - `rarog/themes/enterprise`
  - `rarog/cli`

Сомнительный root `main` для CSS больше не используется, чтобы не ломать tooling.

## Surface matrix

| Surface | Status | Notes |
|---|---|---|
| Core CSS | Stable | Основной publish surface root package. |
| Utilities CSS | Stable | Поддерживаемые utility classes и tokens. |
| Components CSS | Stable | Поддерживаемые компонентные CSS-слои. |
| Built-in themes | Stable | `default`, `dark`, `contrast`, `creative`, `enterprise`. |
| CLI config/build flow | Stable | `init → validate → build` с `rarog.config.js` и `rarog.build.json`. |
| JS runtime (`@rarog/js`) | Beta | Поддерживается, но API ещё расширяется. |
| React bindings (`@rarog/react`) | Experimental | Требуют отдельной compatibility-проверки. |
| Vue bindings (`@rarog/vue`) | Experimental | Требуют отдельной compatibility-проверки. |
| Plugin API | Experimental | Для больших изменений нужен RFC. |

Подробности:
- `docs/stability.md`
- `docs/versioning.md`

## Быстрый старт

### Подключение собранных CSS-слоёв

```html
<link rel="stylesheet" href="/css/rarog-core.min.css">
<link rel="stylesheet" href="/css/rarog-utilities.min.css">
<link rel="stylesheet" href="/css/rarog-components.min.css">
<link rel="stylesheet" href="/css/rarog-theme-default.min.css">
```

### Локальный запуск CLI из репозитория

```bash
node packages/cli/bin/rarog.js --help
node packages/cli/bin/rarog.js validate
node packages/cli/bin/rarog.js build
```

## Publish flow

Канонический publish pipeline в CI:

```bash
npm ci
npm run release:verify
npm run build
npm run test:release
npm run verify:artifacts
npm run pack:packages
```

После этого release workflow публикует:
- `rarog`
- `@rarog/js`
- `@rarog/react`
- `@rarog/vue`

## Документация

Основные документы:
- `docs/getting-started.md`
- `docs/stability.md`
- `docs/versioning.md`
- `docs/javascript.md`
- `RELEASE.md`

## Contributing

Перед PR:

```bash
npm run build
npm run test:ci
npm run docs:lint
```

Перед релизом:

```bash
npm run release:verify
npm run build
npm run test:release
npm run verify:artifacts
npm run pack:packages
```
