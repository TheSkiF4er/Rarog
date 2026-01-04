# Vue Guide (EN)

How to use Rarog with Vue (Vite-based setup):

- install `rarog`,
- import CSS/JS in your entry file,
- let JIT watch your `.vue` files via `rarog.config.*`,
- build production CSS via `rarog build`.

From there you can port any of the HTML-based examples / UI kits into
Vue components.


## 4. @rarog/vue and Nuxt starter

For Vue 3 there is an `@rarog/vue` package with `RarogProvider`, `RarogModal`,
`RarogOffcanvas`, `RarogDropdown` components.

Install:

```bash
npm install rarog @rarog/vue
```

Basic Nuxt 3 example:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    "rarog/dist/rarog-core.min.css",
    "rarog/dist/rarog-utilities.min.css",
    "rarog/dist/rarog-components.min.css",
    "rarog/dist/rarog.jit.css"
  ]
});
```

```vue
<template>
  <RarogProvider>
    <button
      type="button"
      class="btn btn-primary"
      data-rg-toggle="modal"
      data-rg-target="#demoModal"
    >
      Open modal
    </button>

    <RarogModal id="demoModal" title="Rarog Modal">
      <p class="mb-0">Modal content.</p>
    </RarogModal>
  </RarogProvider>
</template>

<script setup lang="ts">
import { RarogProvider, RarogModal } from "@rarog/vue";
</script>
```

The repo contains a ready‑to‑run Nuxt starter in `examples/starters/nuxt-rarog`.
