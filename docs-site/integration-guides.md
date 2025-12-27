# Integration Guides

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

## Vite + Rarog (официальный плагин)

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

## Webpack / другие сборщики

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


## SPA/SSR‑стартовые проекты

В репозитории есть готовые starters для SPA/SSR‑стеков:

- `examples/starters/nextjs-rarog` — Next.js 14 (App Router) + Rarog + `@rarog/react`;
- `examples/starters/nuxt-rarog` — Nuxt 3 + Rarog + `@rarog/vue`;
- `examples/starters/sveltekit-rarog` — SvelteKit + Rarog.

Они демонстрируют:

- подключение CSS/JS Rarog в SSR‑фреймворках;
- использование JS‑ядра в SPA‑навигации;
- работу Rarog в гибридном режиме (SSR + client hydration).

## Microfrontends / Module Federation (MVP)

Rarog можно использовать в микрофронтендах при общей дизайн‑системе:

- выносите токены и темы в общий пакет (например, `rarog-css` + темы);
- подключайте общий CSS‑бандл (или несколько тем) во все микрофронты;
- JS‑ядро можно шарить как singleton‑модуль (Webpack Module Federation, Vite + `remoteEntry` и т.п.).

Основные рекомендации:

- использовать единый источник токенов (`rarog.tokens.json` + theme‑packs);
- следить, чтобы Rarog JS Core подключался один раз (singleton);
- для каждого микрофронта вызывать `Rarog.init(root)` / `Rarog.dispose(root)` на уровне его контейнера.
