# Рарог: каркас CSS 1.0.0

> **Рарог** — каркас CSS и система оформления на основе именованных величин оформления, служебных классов, составных частей и CLI.

<p align="left">
 <a href="https://github.com/TheSkiF4er/rarog/actions/workflows/ci.yml">
 <img src="https://github.com/TheSkiF4er/rarog/actions/workflows/ci.yml/badge.svg" alt="Непрерывная проверка" />
 </a>
 <a href="https://www.npmjs.com/package/rarog">
 <img src="https://img.shields.io/npm/v/rarog.svg?logo=npm" alt="npm" />
 </a>
 <a href="https://github.com/TheSkiF4er/rarog/releases">
 <img src="https://img.shields.io/github/v/release/TheSkiF4er/rarog?logo=github" alt="Выпуск GitHub" />
 </a>
 <a href="https://docs.skif4er.ru/rarog">
 <img src="https://img.shields.io/badge/docs-docs.skif4er.ru%2Frarog-blue?logo=readthedocs" alt="Документация" />
 </a>
</p>

- Текущая стабильная ветка: **1.x**
- Текущая версия: **1.0.0**
- Документация: `https://docs.skif4er.ru/rarog`

## Канонический порядок установки, сборки и выпуска

### Для пользователя CLI

```bash
npm install rarog
npx rarog init
npx rarog validate
npx rarog build
```

По умолчанию `init` создаёт ровно три файла:
- `rarog.config.js` — канонический настройочный файл темы;
- `rarog.build.json` — каноническая опись сборки;
- `src/index.html` — минимальный пробный входной файл для JIT.

`rarog.config.ts` поддерживается только как путь совместимости. `rarog.config.json` остаётся устаревшим форматом для описи сборки и больше не является каноническим путём.

### Для разработки репозитория

```bash
npm ci
npm run build
npm run test:ci
npm run verify:artifacts
```

Где:
- `npm run build` — каноническая полная сборка (`build:css + build:js + build:adapters`);
- `npm run test:ci` — модульные проверки, слои сопряжения, договоры и пробная проверка временного проекта;
- `npm run verify:artifacts` — проверка пригодного к выпуску tarball после сборки;
- `npm run pack:packages` — упаковка всех пригодных к выпуску пакетов в `.artifacts/`.

## Поверхность корневого пакета

Корневой пакет предсказуемо публикует доступную часть CSS:
- `style` → `./packages/core/dist/rarog-core.min.css`
- выдачу по подпутям:
 - `rarog/core`
 - `rarog/utilities`
 - `rarog/components`
 - `rarog/themes/default`
 - `rarog/themes/dark`
 - `rarog/themes/contrast`
 - `rarog/themes/creative`
 - `rarog/themes/enterprise`
 - `rarog/cli`

Сомнительный корневой `main` для CSS больше не используется, чтобы не ломать инструменты.

## Матрица поверхностей

| Доступная часть | Состояние | Примечания |
|---|---|---|
| Core CSS | Устойчива | Основная выпускаемая доступная часть корневого пакета. |
| Утилиты CSS | Устойчива | Поддерживаемые служебные классы и именованные величины. |
| Компоненты CSS | Устойчива | Поддерживаемые слои составных частей CSS. |
| Встроенные темы | Устойчива | `default`, `dark`, `contrast`, `creative`, `enterprise`. |
| Порядок CLI для настройки и сборки | Устойчива | `init → validate → build` с `rarog.config.js` и `rarog.build.json`. |
| Исполняющая часть JS (`@rarog/js`) | Предварительна | Поддерживается, но API ещё расширяется. |
| Связки React (`@rarog/react`) | Опытны | Требуют отдельной проверки совместимости. |
| Связки Vue (`@rarog/vue`) | Опытны | Требуют отдельной проверки совместимости. |
| API дополнений | Опытна | Для больших изменений нужен RFC. |

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

## Процесс публикации

Каноническая цепочка выпуска в CI:

```bash
npm ci
npm run release:verify
npm run build
npm run test:release
npm run verify:artifacts
npm run pack:packages
```

После этого порядок выпуска публикует:
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

## Участие в разработке

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
