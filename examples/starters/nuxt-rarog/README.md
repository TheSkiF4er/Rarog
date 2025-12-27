# Rarog + Nuxt Starter

Пример интеграции Rarog с Nuxt 3 и пакетом `@rarog/vue`.

- CSS Rarog подключается через `nuxt.config.ts` (опция `css`).
- JS Core инициализируется через компонент `<RarogProvider>` в `app.vue`.
- Компоненты (modal/offcanvas и др.) используются через HTML‑структуру + data‑атрибуты.

## Запуск

```bash
# в корне репозитория
npm install
npm run build

cd examples/starters/nuxt-rarog
npm install
npm run dev
```
