# Rarog CSS Framework 3.5.0

> **Rarog** — CSS-фреймворк и дизайн-система на базе design-tokens, utilities, компонентов и экспериментального JS-ядра.

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
  <a href="https://cajeer.ru/rarog">
    <img src="https://img.shields.io/badge/docs-cajeer.ru%2Frarog-blue?logo=readthedocs" alt="Docs" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202.0-green" alt="License" />
  </a>
</p>

- Автор: **TheSkiF4er**
- Лицензия: **Apache 2.0**
- Контакты: `support@cajeer.ru`
- Текущая стабильная ветка: **3.x**
- Текущая версия: **3.5.0**
- Документация: `https://cajeer.ru/rarog`

---

## Что реально есть в репозитории сейчас

Rarog уже включает:
- дизайн-токены: `rarog.tokens.json` и `design/figma.tokens.json`;
- CSS-слои: `packages/core/src`, `packages/utilities/src`, `packages/components/src`, `packages/themes/src`;
- CLI: `packages/cli/bin/rarog.js`;
- vanilla JS-ядро в исходниках: `packages/js/src/rarog.esm.js`;
- плагины CommonJS: `packages/plugin-forms/index.cjs`, `packages/plugin-typography/index.cjs`;
- документацию в `docs/`.

## Матрица стабильности surface

| Surface | Status | Примечание |
|---|---|---|
| Core CSS | Stable | Основной CSS-слой и design tokens. |
| Utilities | Stable | Utility API поддерживается как основной surface. |
| Components CSS | Stable | Компонентные CSS-слои входят в основной релиз. |
| Themes | Stable | Поставляемые темы публикуются как готовые CSS-артефакты. |
| CLI | Beta | Основные команды поддерживаются, но DX ещё развивается. |
| JS Runtime | Beta | Рабочий runtime, но контракт расширяется. |
| React bindings | Experimental | Требуют отдельной smoke/compatibility-проверки перед релизом. |
| Vue bindings | Experimental | Требуют отдельной smoke/compatibility-проверки перед релизом. |
| Plugin API | Experimental | Публичный контракт описан отдельно и может эволюционировать. |

Что пока **не стоит считать production-ready API**:
- React/Vue-адаптеры в `packages/react` и `packages/vue` всё ещё требуют отдельной smoke/compatibility-проверки перед релизом;
- часть UI-kit и ecosystem-заявлений в старых docs описывает целевое состояние, а не полностью поставляемый артефакт.

---

## Быстрый старт

### 1. Установка

```bash
npm ci
```

### 2. Сборка CSS-слоёв

```bash
npm run build:css
```

После сборки создаются CSS-артефакты в:
- `packages/core/dist/`
- `packages/utilities/dist/`
- `packages/components/dist/`
- `packages/themes/dist/`

### 3. Базовое подключение собранных файлов

```html
<link rel="stylesheet" href="/css/rarog-core.min.css">
<link rel="stylesheet" href="/css/rarog-utilities.min.css">
<link rel="stylesheet" href="/css/rarog-components.min.css">
<link rel="stylesheet" href="/css/rarog-theme-default.min.css">
```

### 4. Опционально: CLI

```bash
node packages/cli/bin/rarog.js --help
node packages/cli/bin/rarog.js build
node packages/cli/bin/rarog.js validate
```

---

## Минимальный пример разметки

```html
<div class="rg-container-lg mt-6">
  <div class="card shadow-md">
    <div class="card-header flex items-center justify-between">
      <h1 class="h5 mb-0">Добро пожаловать в Rarog 3.5.0</h1>
      <span class="badge badge-primary">3.x stable</span>
    </div>
    <div class="card-body">
      <p class="text-muted mb-4">
        Design-tokens, utilities и компоненты подключены как отдельные CSS-слои.
      </p>
      <button class="btn btn-primary btn-lg">Начать</button>
    </div>
  </div>
</div>
```

---

## Структура проекта

```text
packages/
  cli/
  components/
  core/
  js/
  plugin-forms/
  plugin-typography/
  react/
  themes/
  utilities/
  vue/
```

Коротко по пакетам:
- `core` — reset, globals, typography, tokens;
- `utilities` — utility-классы;
- `components` — компонентный CSS;
- `themes` — готовые темы;
- `js` — vanilla JS core;
- `react`, `vue` — экспериментальные placeholders;
- `plugin-*` — первые runtime-плагины.

---

## Разработка

Полезные команды:

```bash
npm run build
npm run test:unit
npm run test:adapters
npm run test:release
npm run docs:lint
```

Где:
- `npm run build` — каноническая полная сборка репозитория (`build:css + build:js + build:adapters`);
- `npm run build:css` — только CSS-слои, если менялся только CSS surface;
- `npm run test:unit` — source/runtime unit-контур для JS core и контрактных JS-поверхностей;
- `npm run test:adapters` — dist-smoke для React/Vue adapters; перед прогоном команда пересобирает `@rarog/js`, `@rarog/react` и `@rarog/vue`, чтобы не опираться на устаревший `dist`;
- `npm run test:release` — минимальный обязательный release gate (`test:unit + test:adapters + test:contracts`).
- `npm run docs:lint` — быстрая проверка docs-контракта без полной сборки VitePress.
- `npm run verify:artifacts` — post-build проверка содержимого publishable tarball через `npm pack --dry-run`.

Если нужно проверить CLI без глобальной установки:

```bash
node packages/cli/bin/rarog.js --help
```

---

## Документация

Основные документы в репозитории:
- `docs/getting-started.md`
- `docs/javascript.md`
- `docs/components.md`
- `docs/tokens.md`
- `docs/versioning.md`
- `CONTRIBUTING.md`
- `RELEASE.md`

---

## Contributing

Перед PR:
- прогоните `npm run build`;
- прогоните `npm run test:unit`;
- прогоните `npm run docs:lint`, если меняли README или docs.

Перед релизом дополнительно используйте `npm run test:release` как единый обязательный тестовый gate и `npm run verify:artifacts` после сборки, чтобы проверить реальный publish-surface.

Подробности — в `CONTRIBUTING.md`.
