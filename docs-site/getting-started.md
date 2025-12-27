# Getting Started

Этот раздел поможет быстро запустить Rarog в новом или существующем проекте.

## Установка

### Вариант 1. Подключение готовых CSS-файлов

Самый быстрый путь — использовать уже собранные файлы из `dist/`:

```html
<link rel="stylesheet" href="/css/rarog-core.min.css">
<link rel="stylesheet" href="/css/rarog-utilities.min.css">
<link rel="stylesheet" href="/css/rarog-components.min.css">
```

### Вариант 2. NPM + сборка

```bash
npm install rarog-css --save-dev
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
