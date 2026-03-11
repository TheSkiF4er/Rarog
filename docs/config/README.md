# Config

Конфигурация Rarog: canonical config, build manifest, content scanning, variants и связанные настройки.

## Included legacy sources

- `getting-started.md`
- `integration-guides.md`
- `theming.md`
- `tokens.md`
- `variants-jit.md`
- `performance.md`

## Imported from `getting-started.md`

## Getting Started

Этот раздел описывает **канонический install/build flow** для текущего состояния репозитория.

### Быстрый путь для нового проекта

```bash
npm install rarog
npx rarog init
npx rarog validate
npx rarog build
```

После `init` создаются ровно три файла:
- `rarog.config.js`
- `rarog.build.json`
- `src/index.html`

После `build` по умолчанию появляются:
- `dist/tokens/_color.css`
- `dist/tokens/_spacing.css`
- `dist/tokens/_radius.css`
- `dist/tokens/_shadow.css`
- `dist/tokens/_breakpoints.css`
- `dist/rarog.jit.css`

### Канонические конфиги

#### Theme config

Канонический theme-config:
- `rarog.config.js`

Compatibility-path:
- `rarog.config.ts`

`rarog init` по умолчанию создаёт только `rarog.config.js`.

Минимальный пример:

```js
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,php,js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#0f172a"
        }
      }
    }
  }
};
```

#### Build manifest

Канонический build-manifest:
- `rarog.build.json`

Legacy fallback:
- `rarog.config.json`

Пример минимального `rarog.build.json`:

```json
{
  "version": 1,
  "tokens": {
    "colors": "dist/tokens/_color.css",
    "spacing": "dist/tokens/_spacing.css",
    "radius": "dist/tokens/_radius.css",
    "shadow": "dist/tokens/_shadow.css",
    "breakpoints": "dist/tokens/_breakpoints.css"
  },
  "outputs": {
    "jitCss": "dist/rarog.jit.css"
  }
}
```

### CLI flow

#### `rarog init`

Создаёт стартовый проект без сюрпризов:
- один theme-config;
- один build-manifest;
- один smoke HTML input.

#### `rarog validate`

Проверяет:
- theme-config surface;
- build-manifest surface;
- предупреждения по legacy/multi-config состояниям.

#### `rarog build`

Делает каноническую пользовательскую сборку:
- генерирует token CSS по путям из `rarog.build.json`;
- в режиме `jit` пишет `outputs.jitCss`;
- если classes не найдены, CLI использует предсказуемый fallback bundle, а не молча публикует пустой output.

### Сборка репозитория

Для разработки самого монорепо:

```bash
npm ci
npm run build
npm run test:ci
npm run verify:artifacts
```

Где:
- `npm run build` — полная сборка (`build:css + build:js + build:adapters`);
- `npm run verify:artifacts` — запускается **после полной сборки**;
- `npm run test:ci` — включает temp-project smoke test (`init → validate → build → output exists`).

### Root package surface

Root `rarog` публикует CSS surface через:
- `style`
- subpath exports

Root `main` для CSS не используется.

Поддерживаемые entrypoints:
- `rarog/core`
- `rarog/utilities`
- `rarog/components`
- `rarog/themes/default`
- `rarog/themes/dark`
- `rarog/themes/contrast`
- `rarog/themes/creative`
- `rarog/themes/enterprise`
- `rarog/cli`


## Imported from `integration-guides.md`

## Integration Guides

Rarog не привязан к конкретному фреймворку и хорошо интегрируется с:

- Чистым HTML/статическими сайтами
- Laravel / PHP
- Vite + React / Vue / Svelte
- Любым backend-шаблонизатором (Twig, Blade, Jinja2 и т.д.)

См. директорию `examples/` в репозитории:

- `examples/starters/html-basic` — чистый HTML starter
- `examples/starters/laravel` — Laravel + Rarog
- `examples/starters/vite-react` — Vite + React + Rarog

Каждый starter содержит отдельный `README` и пример минимального проекта.

### Vite + Rarog (официальный плагин)

Для Vite-проектов рекомендуется использовать плагин:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rarogPlugin } from '../tools/vite-plugin-rarog'

export default defineConfig({
  plugins: [
    react(),
    rarogPlugin()
  ]
})
```

Плагин автоматически вызывает `rarog build` в JIT-режиме при старте dev-сервера и при изменении файлов в `resources/`.

### Webpack / другие сборщики

Для Webpack и других bundler'ов можно:

- либо вызывать `rarog build` из npm-скриптов перед `webpack build`;
- либо написать лёгкий плагин на базе `child_process.spawn('rarog', ['build'])`.

Простой сценарий через npm-скрипты:

```json
{
  "scripts": {
    "build:css": "rarog build",
    "build:app": "webpack --mode production",
    "build": "npm run build:css && npm run build:app"
  }
}
```


### SPA/SSR‑стартовые проекты

В репозитории есть готовые starters для SPA/SSR‑стеков:

- `examples/starters/nextjs-rarog` — Next.js 14 (App Router) + Rarog + `@rarog/react`;
- `examples/starters/nuxt-rarog` — Nuxt 3 + Rarog + `@rarog/vue`;
- `examples/starters/sveltekit-rarog` — SvelteKit + Rarog.

Они демонстрируют:

- подключение CSS/JS Rarog в SSR‑фреймворках;
- использование JS‑ядра в SPA‑навигации;
- работу Rarog в гибридном режиме (SSR + client hydration).

### Microfrontends / Module Federation (MVP)

Rarog можно использовать в микрофронтендах при общей дизайн‑системе:

- выносите токены и темы в общий пакет (например, `rarog` + темы);
- подключайте общий CSS‑бандл (или несколько тем) во все микрофронты;
- JS‑ядро можно шарить как singleton‑модуль (Webpack Module Federation, Vite + `remoteEntry` и т.п.).

Основные рекомендации:

- использовать единый источник токенов (`rarog.tokens.json` + theme‑packs);
- следить, чтобы Rarog JS Core подключался один раз (singleton);
- для каждого микрофронта вызывать `Rarog.init(root)` / `Rarog.dispose(root)` на уровне его контейнера.


## Imported from `theming.md`

## Theming

Rarog поддерживает несколько тем (default, dark, contrast), а также свои темы
через переопределение CSS-переменных.

Базовые токены задаются в:

- `packages/core/src/tokens/_color.css`
- `packages/core/src/tokens/_spacing.css`
- `packages/core/src/tokens/_radius.css`
- `packages/core/src/tokens/_shadow.css`
- `packages/core/src/tokens/_breakpoints.css`

Для кастомизации:

1. Скопируйте `rarog.config.js`.
2. Переопределите `theme.colors`, `spacing`, `radius`, `shadow`, `screens`.
3. Выполните:

```bash
npx rarog build
```

4. Подключите собственный файл темы (если нужно) после базового `rarog-core.css`.


### Готовые theme packs (3.3.0+)

Начиная с 3.3.0, вместе с базовыми темами (`default`, `dark`, `contrast`) в Rarog
появились преднастроенные theme‑packs:

- `.theme-enterprise` — спокойная B2B‑палитра для дашбордов и внутренних продуктов.
- `.theme-creative` — более яркий вариант для лендингов, промо и креативных проектов.

Они реализованы как отдельные CSS‑файлы в пакете `packages/themes`:

- `rarog-theme-default.css`
- `rarog-theme-dark.css`
- `rarog-theme-contrast.css`
- `rarog-theme-enterprise.css`
- `rarog-theme-creative.css`

Пример подключения альтернативной темы через класс на `<html>`:

```html
<html class="theme-enterprise">
  <head>
    <link rel="stylesheet" href="/css/rarog-core.css">
    <link rel="stylesheet" href="/css/rarog-utilities.css">
    <link rel="stylesheet" href="/css/rarog-components.css">
    <link rel="stylesheet" href="/css/rarog-theme-enterprise.css">
  </head>
  ...
</html>
```

Темы переопределяют семантические переменные:

- `--rarog-color-bg`, `--rarog-color-bg-soft`, `--rarog-color-bg-elevated-*`
- `--rarog-color-surface`
- `--rarog-color-border-*`
- `--rarog-color-text`, `--rarog-color-text-muted`
- `--rarog-color-focus-ring`, `--rarog-color-accent-soft`

за счёт чего все компоненты и утилиты автоматически перекрашиваются.

### Semantic vs raw tokens

`rarog.tokens.json` теперь чётко разделяет:

- **сырые шкалы** (`tokens.color.primary.*`, `tokens.spacing.*`, `tokens.radius.*`);
- **семантику** (`tokens.color.semantic.*`, `tokens.semantic.*`);
- **темы** (`tokens.themes.default/dark/contrast/enterprise/creative`).

Это упрощает интеграцию с дизайн‑инструментами и поддерживает сценарий
«одна дизайн‑система → несколько тем в коде и в Figma».


## Imported from `tokens.md`

## Tokens

Rarog строится вокруг универсального слоя дизайн-токенов.

Основные группы токенов:

- Цвета (`_color.css` и `rarog.tokens.json`)
- Отступы (`_spacing.css`)
- Радиусы (`_radius.css`)
- Тени (`_shadow.css`)
- Брейкпоинты (`_breakpoints.css`)

Все эти файлы генерируются командой:

```bash
npx rarog build
```

на основе `rarog.config.js` / `rarog.config.ts`.

### Интеграция с Figma

Для использования тех же токенов в дизайн-системе доступен экспорт:

- файл `design/figma.tokens.json` — совместим с Tokens Studio / Design Tokens tooling.

Подробнее про импорт в Figma и Tokens Studio см. раздел **IDE & Plugins**.

### Token pipeline v2 (3.3.0+)

В 3.3.0 структура `rarog.tokens.json` была уточнена под сценарий «полноценная
дизайн‑система»:

- `tokens.color.*` — «сырые» палитры (primary, secondary, success, danger, info…);
- `tokens.spacing`, `tokens.radius`, `tokens.shadow`, `tokens.layout` — атомарные шкалы;
- `tokens.color.semantic` и `tokens.semantic` — семантические токены (фон, текст, бордеры);
- `tokens.themes.*` — набор тем (`default`, `dark`, `contrast`, `enterprise`, `creative`),
  каждая из которых задаёт свой набор `semantic`‑значений.

Экспорт в Figma теперь строится поверх этой структуры:

- `design/figma.tokens.json` содержит как базовые шкалы, так и semantic‑слой и темы;
- Figma‑kit (см. `design/figma-kit/`) использует эти токены как единственный источник правды.

Базовый flow:
1. Настраиваете токены в `rarog.config.*`.
2. Запускаете `npx rarog build` для генерации CSS и `rarog.tokens.json`.
3. Обновляете `design/figma.tokens.json` (через тот же пайплайн).
4. Обновляете токены в Figma (Tokens Studio или аналог).


## Imported from `variants-jit.md`

## Variants & JIT

Rarog 2.3.0 добавляет более умный Tailwind-style движок:

- поддержка variant-префиксов (`group-hover:`, `peer-*`, `data-[state=…]:*`);
- расширенные arbitrary values (`rounded-[...]`, `shadow-[...]`, `gap-[...]`, `border-[...]`);
- улучшенный JIT-анализ (поиск классов в `classList.add(...)`, `clsx(...)`, `cx(...)`);
- официальная интеграция с Vite через плагин.

### Variants

#### group-hover

Контейнер:

```html
<div class="group">
  <button class="btn group-hover:bg-primary group-hover:text-primary">
    Наведи на контейнер
  </button>
</div>
```

CSS (предсобранный слой):

- `.group` — вспомогательный класс-контейнер;
- `.group:hover .group-hover\:bg-primary { ... }`
- `.group:hover .group-hover\:text-primary { ... }`
- `.group:hover .group-hover\:border-primary { ... }`

#### peer-checked / peer-focus

```html
<label class="d-flex items-center gap-2">
  <input type="checkbox" class="peer" />
  <span class="peer-checked:bg-primary peer-checked:text-primary peer-focus:border-primary px-2 py-1 rounded-md">
    Активируется от состояния input
  </span>
</label>
```

CSS:

- `.peer:checked ~ .peer-checked\:bg-primary { ... }`
- `.peer:checked ~ .peer-checked\:text-primary { ... }`
- `.peer:focus ~ .peer-focus\:border-primary { ... }`

#### data-[state=open]:*

```html
<button
  class="btn data-[state=open]:bg-primary data-[state=open]:border-primary"
  data-state="open"
>
  Кнопка в состоянии open
</button>
```

CSS:

- `.data-\[state\=open\]\:bg-primary[data-state="open"] { ... }`
- `.data-\[state\=open\]\:border-primary[data-state="open"] { ... }`

### Arbitrary values v2

JIT поддерживает:

- `w-[320px]`, `h-[50vh]`
- `bg-[rgba(15,23,42,0.9)]`, `text-[#0f172a]`
- `rounded-[1.5rem]`
- `shadow-[0_20px_60px_rgba(15,23,42,0.45)]`
- `gap-[1.5rem]`
- `border-[3px]`

Пример:

```html
<div class="card rounded-[1.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
  ...
</div>
```

Все значения проходят простую фильтрацию (запрещены `;` и `}`), чтобы избежать инъекций.

### JIT v2: поиск классов

Помимо обычных `class="..."` и `className="..."`, JIT теперь смотрит в:

- `element.classList.add('btn', 'btn-primary', 'group-hover:bg-primary')`
- `clsx('btn', isActive && 'btn-primary')`
- `cx('alert', kind === 'error' && 'alert-danger')`
- `classnames('badge', size && 'badge-lg')`

Это позволяет использовать Rarog util-классы во фреймворковых проектах без потерь при tree-shaking.

### Config: variants

В `rarog.config.ts/js` появилась секция:

```ts
variants: {
  group: ["hover"],
  peer: ["checked", "focus"],
  data: ["state"]
}
```

Сейчас она используется как декларация поддерживаемых variants. В будущих версиях может
расшириться до полноценного маппинга variant → генерация CSS.

### Build modes и интеграция

В `rarog.config.ts` по-прежнему доступны режимы:

- `mode: "full"` — собрать полный CSS.
- `mode: "jit"` — собрать минимальный CSS по результатам анализа проекта.

Для Vite есть официальный плагин:

```ts
// tools/vite-plugin-rarog.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rarogPlugin } from './tools/vite-plugin-rarog'

export default defineConfig({
  plugins: [
    react(),
    rarogPlugin()
  ]
})
```

Starter-проект `examples/starters/vite-react` уже настроен на использование плагина и JIT-режима.


## Imported from `performance.md`

## Performance & Bundle Size

Rarog изначально спроектирован так, чтобы:

- full‑сборка была предсказуемой и стабильной;
- JIT‑режим давал **заметное** уменьшение итогового CSS;
- было понятно, как получить минимальный бандл без магии.

### Full vs JIT (концептуально)

Условный пример (ориентировочные, не жёсткие цифры):

| Тип проекта                      | Режим | Размер CSS (сырой) | Gzip‑оценка |
|----------------------------------|-------|---------------------|-------------|
| Малый лендинг                    | full  | 70–90 KB            | 15–25 KB    |
| Малый лендинг                    | jit   | 20–35 KB            | 6–12 KB     |
| Admin‑панель (dashboard)         | full  | 90–130 KB           | 25–35 KB    |
| Admin‑панель (dashboard)         | jit   | 35–60 KB            | 10–20 KB    |

Точные значения зависят от:

- используемых компонентов и утилит;
- объёма layout‑ов и вариаций;
- количества responsive/state/variant‑классов.

### Режимы сборки

В `rarog.config.*`:

```ts
const config: RarogConfig = {
  mode: "jit", // или "full"
  // ...
};
```

- `mode: "full"` — генерируется полный CSS: все утилиты, компоненты, темы.
- `mode: "jit"` — JIT‑движок анализирует `content` и собирает только используемые классы.

### Как работает JIT (кратко)

JIT ищет классы в:

- `class="..."` в HTML/Blade/шаблонах;
- `className="..."` в JSX/TSX;
- `element.classList.add('btn', 'btn-primary')` в JS;
- `clsx('btn', isActive && 'btn-primary')` и аналогичных вызовах (`cx`, `classnames`).

Он поддерживает:

- responsive‑префиксы (`sm:`, `md:`, `lg:`, `xl:`);
- state‑префиксы (`hover:`, `focus:`, `group-hover:`, `peer-checked:` и т.д.);
- arbitrary values (`w-[320px]`, `bg-[#0f172a]`, `rounded-[1.5rem]`, ...).

### Рекомендации по оптимизации

#### 1. Чистые `content`‑пути

В `rarog.config.*` следи, чтобы `content`:

- охватывал только реальные шаблоны/компоненты;
- **не** включал большие vendor‑директории и автогенерируемые файлы.

Плохо:

```ts
content: ["./**/*.php", "./**/*.js"]
```

Хорошо:

```ts
content: [
  "./resources/views/**/*.blade.php",
  "./resources/js/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{vue,ts,tsx}"
]
```

#### 2. Избегать конкатенации

Не делай:

```ts
const cls = "btn-" + variant;      // JIT это не увидит
```

Лучше:

```ts
const cls = variant === "primary" ? "btn btn-primary" : "btn btn-secondary";
```

или:

```ts
clsx("btn", variant === "primary" && "btn-primary");
```

#### 3. Ограниченные arbitrary values

Арbitrary‑классы (`w-[320px]`, `bg-[#0f172a]`) удобны, но злоупотребление ими
может раздуть CSS за счёт множества уникальных значений.

Рекомендация:

- использовать токены там, где это возможно (`w-64`, `bg-primary-600`);
- arbitrary — для редких edge‑кейсов и прототипирования.

#### 4. Отдельные бандлы для тем

Если у тебя несколько тем:

- default / dark / contrast и т.п.,
- можно собирать их в отдельные файлы:

  - `rarog.theme.default.css`,
  - `rarog.theme.dark.css`,
  - `rarog.theme.contrast.css`.

И подгружать только нужное (через `<link>` или динамический импорт).

### Проверка размеров

Рекомендуется:

```bash
## сборка
rarog build

## оценка размеров (Linux/macOS)
gzip -c dist/rarog.jit.css | wc -c
gzip -c dist/rarog.css | wc -c
```

Так можно сравнить full vs JIT на реальном проекте.

---

Для деталей и примеров использования см. также:

- [Variants & JIT](/variants-jit)
- разделы гайдов по конкретным стекам (Laravel/React/Next.js).


### Performance v2 и размеры бандлов

Для Rarog 3.x мы разделяем несколько сценариев сборки:

- **full** — полный набор токенов, утилит и компонент;
- **jit** — только реально используемые классы по анализу `content`;
- **split** — несколько CSS-бандлов под разные части системы (публичный сайт, админка и т.п.).

Рекомендуемый подход:

1. На стадии прототипа — использовать full-сборку (быстрый старт).
2. Для production — включить `mode: "jit"` в `rarog.config.*` и
   ограничить `content` только реальными путями проекта.
3. Для больших систем — рассмотреть split-сборку:
   - общий foundation (tokens + base utilities),
   - отдельный бандл для admin UI,
   - отдельный бандл для публичной витрины/лендингов.

Также важно:

- кешировать результаты JIT-сборки (особенно в CI) — это поддерживается
  через стандартные механизмы кеша (`node_modules/.cache`, CI cache);
- по возможности не держать «мертвые» layout-страницы в одном репо
  без необходимости — JIT всё равно увидит классы и не сможет их выкинуть.
