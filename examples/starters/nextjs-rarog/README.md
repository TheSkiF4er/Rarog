# Rarog + Next.js Starter

Минимальный пример интеграции Rarog с Next.js 14 (App Router) и `@rarog/react`.

- Rarog CSS/JS подключается глобально через `app/layout.tsx`.
- JS Core инициализируется через `<RarogProvider>` (SPA/SSR‑friendly).
- Используются стандартные компоненты: modal, offcanvas, alerts.

## Запуск (после сборки Rarog в корне монорепы)

```bash
# в корне репозитория
npm install
npm run build   # rarog build + сборка CSS/JS

cd examples/starters/nextjs-rarog
npm install
npm run dev
```
