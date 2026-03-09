# Getting Started

Этот раздел помогает быстро запустить **текущую поставляемую версию репозитория**, без предположений о внешнем CDN или несуществующих артефактах.

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
- `rarog.config.js`
- `rarog.config.ts`
- `rarog.config.json`

Пример минимального `rarog.config.js`:

```js
module.exports = {
  mode: "full",
  content: ["./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"],
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
