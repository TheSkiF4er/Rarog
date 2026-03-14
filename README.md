# «Рарог» — каркас каскадных таблиц стилей 1.0.0

> **Рарог** — каркас каскадных таблиц стилей и система оформления на основе токенов оформления, вспомогательных классов, компонентов и средства командной строки.

<p align="left">
  <a href="https://github.com/TheSkiF4er/rarog/actions/workflows/ci.yml">
    <img src="https://github.com/TheSkiF4er/rarog/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://www.npmjs.com/package/rarog">
    <img src="https://img.shields.io/npm/v/rarog.svg?logo=npm" alt="npm" />
  </a>
  <a href="https://github.com/TheSkiF4er/rarog/releases">
    <img src="https://img.shields.io/github/v/release/TheSkiF4er/rarog?logo=github" alt="GitHub выпуск" />
  </a>
  <a href="https://docs.skif4er.ru/rarog">
    <img src="https://img.shields.io/badge/docs-docs.skif4er.ru%2Frarog-blue?logo=readthedocs" alt="Документация" />
  </a>
</p>

- Текущая стабильная ветка: **1.x**
- Текущая версия: **1.0.0**
- Документация: `https://docs.skif4er.ru/rarog`

## Канонический порядок установки, сборки и публикации

### Для пользователя средства командной строки

```bash
npm install rarog
npx rarog init
npx rarog validate
npx rarog build
```

По умолчанию `init` создаёт ровно три файла:
- `rarog.config.js` — каноническое описание темы;
- `rarog.build.json` — каноническое описание сборки;
- `src/index.html` — минимальный вход для краткого проверочного теста JIT.

`rarog.config.ts` поддерживается только как путь совместимости. `rarog.config.json` остаётся устаревшим форматом для описания сборки и больше не является каноническим путём.

### Для разработки репозитория

```bash
npm ci
npm run build
npm run test:ci
npm run verify:artifacts
```

Где:
- `npm run build` — каноническая полная сборка (`build:css + build:js + build:adapters`);
- `npm run test:ci` — модульные проверки, проверки согласующих слоёв, контрактов и краткий проверочный тест временного проекта;
- `npm run verify:artifacts` — послесборочная проверка пригодного для публикации архива tarball;
- `npm run pack:packages` — упаковка всех пригодных для публикации пакетов в `.artifacts/`.

## Поверхность корневого пакета

Корневой пакет предсказуемо публикует CSS-поверхность:
- `style` → `./packages/core/dist/rarog-core.min.css`
- экспорт по вложенным путям:
 - `rarog/core`
 - `rarog/utilities`
 - `rarog/components`
 - `rarog/themes/default`
 - `rarog/themes/dark`
 - `rarog/themes/contrast`
 - `rarog/themes/creative`
 - `rarog/themes/enterprise`
 - `rarog/cli`

Сомнительный корневой `main` для CSS больше не используется, чтобы не ломать инструментарий.

## Матрица поверхностей

| Поверхность | Состояние | Примечания |
|---|---|---|
| Core CSS | Стабильное | Основной публикация Поверхность root package. |
| Утилиты CSS | Стабильное | Поддерживаемые вспомогательные классы и токены. |
| Компоненты CSS | Стабильное | Поддерживаемые компонентные CSS-слои. |
| Встроенные темы | Стабильное | `default`, `dark`, `contrast`, `creative`, `enterprise`. |
| Порядок настройки и сборки через командную строку | Стабильное | `init → validate → build` с `rarog.config.js` и `rarog.build.json`. |
| Исполняемое ядро JS (`@rarog/js`) | Предварительное | Поддерживается, но интерфейс ещё расширяется. |
| React-привязки (`@rarog/react`) | Экспериментальное | Требуют отдельной проверки совместимости. |
| Vue-привязки (`@rarog/vue`) | Экспериментальное | Требуют отдельной проверки совместимости. |
| Интерфейс расширений | Экспериментальное | Для крупных изменений нужен RFC. |

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

### Локальный запуск средства командной строки из репозитория

```bash
node packages/cli/bin/rarog.js --help
node packages/cli/bin/rarog.js validate
node packages/cli/bin/rarog.js build
```

## Процесс публикации

Канонический порядок публикации в CI:

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

## Внесение вклада

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
