// Nuxt 3 + Rarog starter config
export default defineNuxtConfig({
  css: [
    "rarog/dist/rarog-core.min.css",
    "rarog/dist/rarog-utilities.min.css",
    "rarog/dist/rarog-components.min.css",
    "rarog/dist/rarog.jit.css"
  ],
  app: {
    head: {
      title: "Rarog + Nuxt starter"
    }
  }
});
