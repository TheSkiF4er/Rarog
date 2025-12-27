# Vue Guide

Официального Vue‑starter‑а в репозитории пока нет, но интеграция повторяет
React/Vite сценарий.

## 1. Установка

```bash
npm install rarog-css --save-dev
```

## 2. rarog.config.*

```ts
import type { RarogConfig } from "rarog-css/rarog.config.types";

const config: RarogConfig = {
  mode: "jit",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {}
};

export default config;
```

## 3. Vite + Vue

В `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { rarogPlugin } from 'rarog-css/tools/vite-plugin-rarog'

export default defineConfig({
  plugins: [
    vue(),
    rarogPlugin()
  ]
})
```

## 4. Подключение CSS

В `src/main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'

// Rarog CSS
import '../dist/rarog.jit.css'

createApp(App).mount('#app')
```

## 5. Пример компонента

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
