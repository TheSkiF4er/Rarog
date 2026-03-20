# Быстрый старт

Раздел для первого знакомства с Rarog, быстрого старта и выбора подходящего сценария интеграции.

## Включено legacy sources

- `getting-started.md`
- `integration-guides.md`
- `guide-react.md`
- `guide-vue.md`
- `guide-nextjs.md`
- `guide-laravel.md`
- `guide-cajeer-stack.md`

## Imported from `getting-started.md`

## Быстрый старт

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

#### Сборка manifest

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

### Поверхность root-пакета

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
import { defineКонфигурация } from 'vite'
import react from '@vitejs/plugin-react'
import { rarogPlugin } from '../tools/vite-plugin-rarog'

export default defineКонфигурация({
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


## Imported from `guide-react.md`

## React Guide

Rarog хорошо сочетается с проектами на React. В репозитории есть starter:

- `examples/starters/vite-react`

### 1. Стартовый проект

Быстрый запуск starter‑а из монорепы Rarog:

```bash
cd examples/starters/vite-react
npm install
cd ../../..
npm run build     # каноническая полная сборка Rarog
cd examples/starters/vite-react
npm run dev
```

Открой `http://localhost:5173` — там уже используется ряд классов Rarog.

### 2. Интеграция в свой React‑проект

#### Установка

```bash
npm install rarog --save-dev
```

#### rarog.config.ts

В корне проекта:

```ts
import type { RarogКонфигурация } from "rarog/rarog.config.types";

const config: RarogКонфигурация = {
  mode: "jit",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    // при необходимости — расширяем токены
  }
};

export default config;
```

#### Vite + React

В `vite.config.ts`:

```ts
import { defineКонфигурация } from 'vite'
import react from '@vitejs/plugin-react'
import { rarogPlugin } from 'rarog/tools/vite-plugin-rarog'

export default defineКонфигурация({
  plugins: [
    react(),
    rarogPlugin()
  ]
})
```

`rarogPlugin()` будет дергать `rarog build` в JIT‑режиме при изменении файлов.

#### Подключение CSS

Входной файл React‑приложения:

```ts
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Подключаем собранный CSS Rarog
import '../../dist/rarog.jit.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 3. Использование variants & plugins

Классы Rarog хорошо ложатся на React‑компоненты:

```tsx
export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'btn btn-primary',
        'group-hover:bg-primary-600',
        'disabled:opacity-50 disabled:pointer-events-none',
        props.className
      ].filter(Boolean).join(' ')}
    />
  );
}
```

JIT найдёт классы в:

- строковых литералах;
- `className="..."`;
- `classList.add(...)`;
- `clsx(...)` / `cx(...)` / `classnames(...)`.

Подробнее — в разделе [Variants & JIT](/variants-jit).

### UI‑киты как React‑страницы

UI‑киты из монорепы можно использовать как основу для React‑компонентов:

- `examples/ui-kits/admin-dashboard/index.html` → страница `/admin`;
- `examples/ui-kits/landing-kit/index.html` → публичный лендинг;
- `examples/ui-kits/saas-starter/*.html` → auth/dashboard/settings.

Типичный flow:

1. Копируете HTML‑разметку в JSX/TSX.
2. Заменяете статические тексты и списки на пропсы/стейт.
3. Подключаете Rarog CSS/JS как описано выше (через Vite plugin/JIT).


### 4. @rarog/react: обёртки над JS‑ядром

Начиная с версии 3.4.0 доступен пакет `@rarog/react` с лёгкими обёртками над
JS‑ядром Rarog.

Установка (в реальном проекте):

```bash
npm install rarog @rarog/react
```

Базовый пример с `<RarogProvider>` и модалкой:

```tsx
import React from "react";
import { RarogProvider, RarogModal } from "@rarog/react";
import "rarog/dist/rarog-core.min.css";
import "rarog/dist/rarog-utilities.min.css";
import "rarog/dist/rarog-components.min.css";
import "rarog/dist/rarog.jit.css";

export function App() {
  return (
    <RarogProvider>
      <main className="rg-container-lg py-10">
        <button
          type="button"
          className="btn btn-primary"
          data-rg-toggle="modal"
          data-rg-target="#demoModal"
        >
          Открыть модалку
        </button>

        <RarogModal id="demoModal" title="Rarog Modal">
          <p className="mb-0">
            Содержимое модального окна. JS‑логика берётся из Rarog JS Core,
            React‑компоненты отвечают за удобную разметку.
          </p>
        </RarogModal>
      </main>
    </RarogProvider>
  );
}
```

`RarogProvider` обеспечивает SPA/SSR‑friendly инициализацию: при монтировании
дерева выполняется `Rarog.init(root)`, при размонтировании — `Rarog.dispose(root)`.


### Accessibility in React wrappers

При использовании `@rarog/react` сохраняйте доступную разметку на уровне JSX:

- передавайте явный заголовок внутрь `RarogModal` / `RarogOffcanvas`, чтобы JS core мог связать `aria-labelledby`;
- используйте настоящие `<button type="button">` для dismiss/open controls;
- не удаляйте focus outline без альтернативного `:focus-visible`;
- проверяйте keyboard flow после рендера React-компонента, а не только на уровне HTML-шаблона.


## Imported from `guide-vue.md`

## Vue Guide

В репозитории есть Nuxt/Vue‑starter (`examples/starters/nuxt-rarog`), а также
React/Vite сценарий.

### 1. Установка

```bash
npm install rarog --save-dev
```

### 2. rarog.config.*

```ts
import type { RarogКонфигурация } from "rarog/rarog.config.types";

const config: RarogКонфигурация = {
  mode: "jit",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {}
};

export default config;
```

### 3. Vite + Vue

В `vite.config.ts`:

```ts
import { defineКонфигурация } from 'vite'
import vue from '@vitejs/plugin-vue'
import { rarogPlugin } from 'rarog/tools/vite-plugin-rarog'

export default defineКонфигурация({
  plugins: [
    vue(),
    rarogPlugin()
  ]
})
```

### 4. Подключение CSS

В `src/main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'

// Rarog CSS
import '../dist/rarog.jit.css'

createApp(App).mount('#app')
```

### 5. Пример компонента

```vue
<template>
  <div class="rg-container-lg py-8">
    <div class="card p-6">
      <h1 class="text-2xl font-semibold mb-4">Vue + Rarog</h1>
      <p class="text-muted mb-4">
        Tailwind‑подобные утилиты, Bootstrap‑подобные компоненты.
      </p>
      <button class="btn btn-primary">Действие</button>
    </div>
  </div>
</template>
```

JIT будет анализировать все `.vue` файлы, поэтому классы попадут в итоговый CSS.


### 4. @rarog/vue и Nuxt‑starter

Для Vue 3 доступен пакет `@rarog/vue` с компонентами `RarogProvider`, `RarogModal`,
`RarogOffcanvas`, `RarogDropdown`.

Установка (в отдельном проекте):

```bash
npm install rarog @rarog/vue
```

Пример базовой интеграции в Nuxt 3 (упрощённо):

```ts
// nuxt.config.ts
export default defineNuxtКонфигурация({
  css: [
    "rarog/dist/rarog-core.min.css",
    "rarog/dist/rarog-utilities.min.css",
    "rarog/dist/rarog-components.min.css",
    "rarog/dist/rarog.jit.css"
  ]
});
```

```vue
<!-- app.vue -->
<template>
  <RarogProvider>
    <button
      type="button"
      class="btn btn-primary"
      data-rg-toggle="modal"
      data-rg-target="#demoModal"
    >
      Открыть модалку
    </button>

    <RarogModal id="demoModal" title="Rarog Modal">
      <p class="mb-0">Контент модального окна.</p>
    </RarogModal>
  </RarogProvider>
</template>

<script setup lang="ts">
import { RarogProvider, RarogModal } from "@rarog/vue";
</script>
```

Готовый пример Nuxt‑интеграции лежит в `examples/starters/nuxt-rarog`.


### Accessibility in Vue wrappers

Для `@rarog/vue` действуют те же правила, что и для чистого JS core:

- модалки и offcanvas должны содержать реальный title/body для корректного `aria-labelledby` и `aria-describedby`;
- управляющие элементы должны быть кнопками, а не `div` с обработчиком клика;
- при `v-if` / `Teleport` важно сохранять предсказуемые id и порядок фокуса;
- keyboard navigation стоит проверять уже в mounted-состоянии приложения.


## Imported from `guide-nextjs.md`

## Next.js Guide

Rarog можно использовать и в приложениях на Next.js (13/14+).

### 1. Установка

```bash
npm install rarog --save-dev
```

### 2. rarog.config.*

В корне Next‑проекта:

```ts
import type { RarogКонфигурация } from "rarog/rarog.config.types";

const config: RarogКонфигурация = {
  mode: "jit",
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {}
};

export default config;
```

### 3. Скрипты сборки

В `package.json`:

```json
{
  "scripts": {
    "rarog:build": "rarog build",
    "dev": "npm run rarog:build && next dev",
    "build": "npm run rarog:build && next build"
  }
}
```

### 4. Подключение CSS

В `app/layout.tsx` (Next 13+):

```tsx
import '../dist/rarog.jit.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  )
}
```

### 5. Типовой layout

```tsx
export default function Page() {
  return (
    <main className="rg-container-lg py-10">
      <div className="card p-8">
        <h1 className="text-3xl font-semibold mb-4">Next.js + Rarog</h1>
        <p className="text-muted mb-4">
          Используйте JIT‑режим Rarog для минимального CSS‑бандла.
        </p>
        <a className="btn btn-primary" href="/dashboard">
          Перейти в dashboard
        </a>
      </div>
    </main>
  );
}
```

---

Оптимизации и особенности JIT описаны в разделе [Performance & Bundle Size](/performance).

### Использование UI‑китов в Next.js

Любой из HTML‑layout’ов из `examples/ui-kits` можно перенести в `app/` или
`pages/`:

- Admin dashboard → `/app/(dashboard)/page.tsx`;
- Landing Kit → `/app/page.tsx`;
- SaaS Starter → `/app/(auth)/login/page.tsx`, `/app/(app)/dashboard/page.tsx` и т.п.

Важно:

- классы Rarog остаются без изменений;
- сборка CSS/JS происходит через `rarog build` и подключается в `_app`/layout.


## Imported from `guide-laravel.md`

## Laravel Guide

Этот гайд показывает, как интегрировать Rarog в Laravel‑проект. В репозитории
есть черновой starter:

- `examples/starters/laravel`

### 1. Установка

В уже существующем Laravel‑приложении:

```bash
npm install rarog --save-dev
```

(Если ты используешь монорепу с самим Rarog, можно линковать пакет локально.)

### 2. Конфигурация Rarog

Создай `rarog.config.js` в корне Laravel‑проекта (не в монорепе):

```js
/** @type {import('rarog/rarog.config.types').RarogКонфигурация} */
module.exports = {
  mode: "jit",
  content: [
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.{js,jsx,ts,tsx,vue}"
  ],
  theme: {
    // по желанию — переопределить цвета/spacing под бренд проекта
  }
};
```

### 3. Сборка CSS

В `package.json` Laravel‑проекта:

```json
{
  "scripts": {
    "rarog:build": "rarog build",
    "dev": "npm run rarog:build && vite",
    "build": "npm run rarog:build && vite build"
  }
}
```

После этого:

```bash
npm run rarog:build
```

Rarog сгенерирует CSS (по умолчанию `dist/rarog.css` или `dist/rarog.jit.css`
в зависимости от режима).

### 4. Подключение в Blade

Подключи CSS в layout, который используется во всех Blade‑шаблонах:

```blade
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>@yield('title', 'Laravel + Rarog')</title>
    @vite('resources/js/app.js')
    <link rel="stylesheet" href="{{ mix('dist/rarog.jit.css') }}">
  </head>
  <body class="bg-slate-50">
    <div class="rg-container-lg py-6">
      @yield('content')
    </div>
  </body>
</html>
```

(В зависимости от сборки можно использовать `@vite`, `mix()` или статический путь.)

### 5. Использование классов Rarog

Пример Blade‑шаблона:

```blade
@extends('layouts.app')

@section('title', 'Rarog Dashboard')

@section('content')
  <div class="card p-6">
    <h1 class="text-2xl font-semibold mb-4">Laravel + Rarog</h1>
    <p class="text-muted mb-4">
      Это пример admin‑экрана на Blade c утилитами и компонентами Rarog.
    </p>
    <a href="{{ route('projects.create') }}" class="btn btn-primary">
      Новый проект
    </a>
  </div>
@endsection
```

### 6. Отладка JIT

Если какие‑то классы «пропадают» в сборке:

1. Проверь `content` в `rarog.config.*` — охватывают ли они все Blade/JS файлы.
2. Убедись, что классы не строятся динамически строковой конкатенацией.
3. Для сложных случаев можно использовать функцию `clsx()` — JIT умеет её разбирать.

Для более подробной информации см. разделы:

- [Integration Guides](/integration-guides)
- [Variants & JIT](/variants-jit)

### Использование UI‑китов (Admin & SaaS)

В монорепе Rarog есть готовые примеры layout’ов, которые можно напрямую
переносить в Blade‑шаблоны:

- `examples/ui-kits/admin-dashboard/index.html` — админ‑панель;
- `examples/ui-kits/landing-kit/index.html` — лендинг;
- `examples/ui-kits/saas-starter/*.html` — SaaS‑layout’ы.

Рекомендуемый подход:

1. Скопировать нужный HTML‑layout в `resources/views/...`.
2. Заменить демо‑данные на Blade‑переменные.
3. Убедиться, что Rarog собирается через `rarog build` и подключён в layout’ах.


## Imported from `guide-cajeer-stack.md`

## Cajeer Stack Guide

Rarog задуман как «родной» CSS‑слой для экосистемы Cajeer (Cajeer CMS, CajeerEngine,
Farog, Warog и др.), но не привязан к ней жёстко.

Этот гайд описывает общие принципы интеграции.

### 1. Где жить Rarog в Cajeer‑стеке

Рекомендуемый вариант:

- отдельный репозиторий/пакет `rarog` (как сейчас);
- все Cajeer‑проекты (CMS, панели, админки, лендинги) подключают готовый CSS/JS:

  - `dist/rarog.css` или `dist/rarog.jit.css`,
  - `dist/rarog.js`.

### 2. Конфигурация под Cajeer‑проект

В веб‑приложении на базе Cajeer/CajeerEngine:

```ts
// rarog.config.cajeer.ts
import type { RarogКонфигурация } from "rarog/rarog.config.types";

const config: RarogКонфигурация = {
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

### 3. Встраивание в шаблоны

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

### 4. Паттерны под Cajeer‑панели

Для админок и внутренних тулз рекомендуется:

- использовать `rg-container-lg`, `rg-row`, `rg-col-*` для layout;
- `card`, `alert`, `badge`, `navbar`, `offcanvas`, `modal`, `toast` для компонентов;
- `@rarog/plugin-forms` и `@rarog/plugin-typography` для форм и контентных страниц.

Комбинируя Rarog с Cajeer‑бэком, ты получаешь:

- единый визуальный язык всех панелей и сайтов;
- минимальный custom‑CSS;
- возможность переиспользовать дизайн‑токены в Figma (`design/figma.tokens.json`).

### UI‑киты для Cajeer‑стека

Rarog UI‑киты удобно использовать как базовые layout’ы для админок и лендингов
Cajeer:

- Admin dashboard — панели управления CajeerEngine/новыми CMS;
- Landing Kit — промо‑страницы продуктов Cajeer;
- SaaS Starter — кабинеты и биллинг‑разделы.

Подход:

- копируете HTML в шаблоны Cajeer;
- оставляете классы Rarog как есть;
- подключаете Rarog как общий CSS/JS‑слой для всего проекта.
