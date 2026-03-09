# Getting Started

Этот раздел помогает быстро запустить **текущую поставляемую версию репозитория**, без предположений о внешнем CDN или несуществующих артефактах.

## Быстрый путь для нового проекта

```bash
npm install rarog
npx rarog init
npx rarog build
```

После этого у вас будут:
- `rarog.config.js` и `rarog.config.ts` для theme-конфига;
- `rarog.config.json` как build-manifest с путями вывода;
- `dist/tokens/*.css` и, при `mode: "jit"`, `dist/rarog.jit.css`;
- `examples/starter/index.html` как минимальная стартовая страница.

## Установка зависимостей

```bash
npm ci
```

## Сборка CSS

```bash
npm run build:css
```

Если нужно собрать весь репозиторный surface (CSS + JS + adapters), используйте:

```bash
npm run build
```

Сборка создаёт CSS-файлы в каталоге `dist/` у следующих пакетов:
- `packages/core/dist/`
- `packages/utilities/dist/`
- `packages/components/dist/`
- `packages/themes/dist/`

Минимальный набор для подключения:

```html
<link rel="stylesheet" href="/css/rarog-core.min.css">
<link rel="stylesheet" href="/css/rarog-utilities.min.css">
<link rel="stylesheet" href="/css/rarog-components.min.css">
<link rel="stylesheet" href="/css/rarog-theme-default.min.css">
```

## CLI

Локальный запуск CLI из репозитория:

```bash
node packages/cli/bin/rarog.js --help
node packages/cli/bin/rarog.js build
node packages/cli/bin/rarog.js validate
```

Если пакет установлен как зависимость проекта, можно использовать:

```bash
npx rarog build
```

## Конфиг

Поддерживаются:
- `rarog.config.ts` — приоритетный theme-config;
- `rarog.config.js` — fallback theme-config;
- `rarog.config.json` — build-manifest, а не theme-config.

Пример минимального `rarog.config.js`:

```js
module.exports = {
  mode: "full",
  content: ["./src/**/*.{html,php,js,jsx,ts,tsx,vue}", "./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"],
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

## JS-ядро: текущее состояние

Vanilla JS-ядро находится в `packages/js/src/rarog.esm.js`.

Важно:
- исходники JS-ядра лежат в `packages/js/src/`;
- publishable output создаётся через `npm run build:js` или полную сборку `npm run build`;
- для внешнего использования ориентируйтесь на артефакты из `packages/js/dist/`.

## Быстрый пример разметки

```html
<div class="rg-container-lg py-6">
  <div class="rg-row rg-gap-y-4">
    <div class="rg-col-12 rg-col-md-8">
      <div class="card">
        <div class="card-header">Добро пожаловать в Rarog</div>
        <div class="card-body">
          <p class="text-muted">
            Это базовый пример использования сетки и карточки.
          </p>
          <button class="btn btn-primary">Основная кнопка</button>
        </div>
      </div>
    </div>
    <div class="rg-col-12 rg-col-md-4">
      <div class="alert alert-info">
        <strong>Подсказка:</strong> responsive-утилиты используют префиксы `sm:`, `md:`, `lg:`, `xl:` и `2xl:`.
      </div>
    </div>
  </div>
</div>
```


## Build-manifest

`rarog.config.json` используется для путей вывода, а не для описания темы.

Пример:

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
