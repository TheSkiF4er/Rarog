// Nuxt 3 + Rarog starter config
export default defineNuxtConfig({
  css: [
    "rarog-css/dist/rarog-core.min.css",
    "rarog-css/dist/rarog-utilities.min.css",
    "rarog-css/dist/rarog-components.min.css",
    "rarog-css/dist/rarog.jit.css"
  ],
  app: {
    head: {
      title: "Rarog + Nuxt starter"
    }
  }
});
