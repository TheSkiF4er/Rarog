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
