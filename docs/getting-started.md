# Getting Started

Этот раздел описывает **канонический install/build flow** для текущего состояния репозитория.

## Быстрый путь для нового проекта

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

## Канонические конфиги

### Theme config

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

### Build manifest

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

## CLI flow

### `rarog init`

Создаёт стартовый проект без сюрпризов:
- один theme-config;
- один build-manifest;
- один smoke HTML input.

### `rarog validate`

Проверяет:
- theme-config surface;
- build-manifest surface;
- предупреждения по legacy/multi-config состояниям.

### `rarog build`

Делает каноническую пользовательскую сборку:
- генерирует token CSS по путям из `rarog.build.json`;
- в режиме `jit` пишет `outputs.jitCss`;
- если classes не найдены, CLI использует предсказуемый fallback bundle, а не молча публикует пустой output.

## Сборка репозитория

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

## Root package surface

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
