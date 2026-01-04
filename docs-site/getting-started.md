# Getting Started

Этот раздел поможет быстро запустить Rarog в новом или существующем проекте.

## Установка

### Вариант 0. Официальное CDN cdn.cajeer.ru

Если нужен максимально быстрый старт без сборки и конфигурации, можно подключить Rarog
напрямую через официальный CDN.

Версионированный пример (рекомендуется для продакшена):

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.cajeer.ru/rarog/3.5.0/rarog.min.css">
<link rel="stylesheet" href="https://cdn.cajeer.ru/rarog/3.5.0/themes/default.css">

<!-- JavaScript-ядро (опционально, только если вы используете JS-компоненты) -->
<script src="https://cdn.cajeer.ru/rarog/3.5.0/rarog.umd.js" defer></script>
```

Для экспериментов можно использовать алиас `latest` (если он настроен на стороне CDN):

```html
<link rel="stylesheet" href="https://cdn.cajeer.ru/rarog/latest/rarog.min.css">
<link rel="stylesheet" href="https://cdn.cajeer.ru/rarog/latest/themes/default.css">
<script src="https://cdn.cajeer.ru/rarog/latest/rarog.umd.js" defer></script>
```

После этого можно сразу использовать utility-классы, компоненты и JS‑поведение.

### Вариант 1. Подключение готовых CSS-файлов

Самый быстрый путь — использовать уже собранные файлы из `dist/`:

```html
<link rel="stylesheet" href="/css/rarog-core.min.css">
<link rel="stylesheet" href="/css/rarog-utilities.min.css">
<link rel="stylesheet" href="/css/rarog-components.min.css">
```

### Вариант 2. NPM + сборка

```bash
npm install rarog --save-dev
```

В `package.json` вашего проекта:

```json
{
  "scripts": {
    "rarog:build": "rarog build"
  }
}
```

А в `rarog.config.js`:

```js
module.exports = {
  mode: "full",
  content: ["./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"],
  theme: { /* ...см. базовый конфиг */ },
  screens: { /* ... */ }
}
```

После чего:

```bash
npx rarog build
```

## Быстрый пример разметки

```html
<div class="rg-container-lg py-6">
  <div class="rg-row rg-gap-y-4">
    <div class="rg-col-12 rg-col-md-8">
      <div class="card">
        <div class="card-header">
          Добро пожаловать в Rarog
        </div>
        <div class="card-body">
          <p class="text-muted">
            Это базовый пример использования сетки и карточки.
          </p>
          <button class="btn btn-primary">
            Основная кнопка
          </button>
        </div>
      </div>
    </div>
    <div class="rg-col-12 rg-col-md-4">
      <div class="alert alert-info">
        <strong>Подсказка:</strong> Responsive-утилиты начинаются с префиксов `sm:`, `md:`, `lg:`, `xl:`.
      </div>
    </div>
  </div>
</div>
```
