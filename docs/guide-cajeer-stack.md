# Cajeer Stack Guide

Rarog задуман как «родной» CSS‑слой для экосистемы Cajeer (Cajeer CMS, CajeerEngine,
Farog, Warog и др.), но не привязан к ней жёстко.

Этот гайд описывает общие принципы интеграции.

## 1. Где жить Rarog в Cajeer‑стеке

Рекомендуемый вариант:

- отдельный репозиторий/пакет `rarog` (как сейчас);
- все Cajeer‑проекты (CMS, панели, админки, лендинги) подключают готовый CSS/JS:

  - `dist/rarog.css` или `dist/rarog.jit.css`,
  - `dist/rarog.js`.

## 2. Конфигурация под Cajeer‑проект

В веб‑приложении на базе Cajeer/CajeerEngine:

```ts
// rarog.config.cajeer.ts
import type { RarogConfig } from "rarog/rarog.config.types";

const config: RarogConfig = {
  mode: "jit",
  content: [
    "./templates/**/*.tpl.php",
    "./themes/**/*.php",
    "./resources/views/**/*.php",
    "./resources/js/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    // можно задать «Cajeer‑тему» через токены
  },
  plugins: [
    "./packages/plugin-forms/index.cjs",
    "./packages/plugin-typography/index.cjs"
  ]
};

export default config;
```

## 3. Встраивание в шаблоны

В шаблонах Cajeer‑CMS (условный пример):

```php
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title><?= $pageTitle ?? 'Cajeer + Rarog' ?></title>
    <link rel="stylesheet" href="/assets/css/rarog.jit.css" />
  </head>
  <body class="bg-slate-50">
    <header class="navbar">
      <!-- navbar на Rarog -->
    </header>

    <main class="rg-container-lg py-8">
      <?= $content ?>
    </main>

    <script src="/assets/js/rarog.js"></script>
  </body>
</html>
```

## 4. Паттерны под Cajeer‑панели

Для админок и внутренних тулз рекомендуется:

- использовать `rg-container-lg`, `rg-row`, `rg-col-*` для layout;
- `card`, `alert`, `badge`, `navbar`, `offcanvas`, `modal`, `toast` для компонентов;
- `@rarog/plugin-forms` и `@rarog/plugin-typography` для форм и контентных страниц.

Комбинируя Rarog с Cajeer‑бэком, ты получаешь:

- единый визуальный язык всех панелей и сайтов;
- минимальный custom‑CSS;
- возможность переиспользовать дизайн‑токены в Figma (`design/figma.tokens.json`).

## UI‑киты для Cajeer‑стека

Rarog UI‑киты удобно использовать как базовые layout’ы для админок и лендингов
Cajeer:

- Admin dashboard — панели управления CajeerEngine/новыми CMS;
- Landing Kit — промо‑страницы продуктов Cajeer;
- SaaS Starter — кабинеты и биллинг‑разделы.

Подход:

- копируете HTML в шаблоны Cajeer;
- оставляете классы Rarog как есть;
- подключаете Rarog как общий CSS/JS‑слой для всего проекта.
