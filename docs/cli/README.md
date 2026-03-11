# CLI

Команды CLI, рабочие циклы для разработки и диагностика проекта.

## Included legacy sources

- `getting-started.md`
- `playground.md`
- `storybook.md`
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


## Imported from `playground.md`

## Playground

Rarog теперь включает локальный demo playground без отдельной сборки.

### Запуск

```bash
npm run playground
```

Открой `http://127.0.0.1:4173/examples/playground/`.

### Что умеет playground

- переключение сцен (`Modal`, `Dropdown`, `Forms`, `DataTable`)
- смена темы
- RTL toggle
- логирование runtime-событий

Playground использует исходные CSS entrypoints и `packages/js/src/rarog.esm.js`, поэтому хорошо подходит для быстрой ручной проверки компонентов и lifecycle.


## Imported from `storybook.md`

## Storybook

Rarog теперь включает локальный Storybook-контур для HTML/JS Core компонентов.

### Запуск

```bash
npm install
npm run storybook
```

По умолчанию Storybook поднимается на `http://127.0.0.1:6006`.

### Что уже покрыто

- Foundations / Button
- Overlays / Modal
- Overlays / Dropdown
- Data / DataTable

Storybook собран на `@storybook/html-vite`, поэтому истории работают прямо с исходными CSS entrypoints и `packages/js/src/rarog.esm.js`.


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
