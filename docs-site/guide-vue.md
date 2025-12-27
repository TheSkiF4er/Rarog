# Vue Guide

В репозитории есть Nuxt/Vue‑starter (`examples/starters/nuxt-rarog`), а также
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


## 4. @rarog/vue и Nuxt‑starter

Для Vue 3 доступен пакет `@rarog/vue` с компонентами `RarogProvider`, `RarogModal`,
`RarogOffcanvas`, `RarogDropdown`.

Установка (в отдельном проекте):

```bash
npm install rarog-css @rarog/vue
```

Пример базовой интеграции в Nuxt 3 (упрощённо):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    "rarog-css/dist/rarog-core.min.css",
    "rarog-css/dist/rarog-utilities.min.css",
    "rarog-css/dist/rarog-components.min.css",
    "rarog-css/dist/rarog.jit.css"
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
