# Storybook

Rarog теперь включает локальный Storybook-контур для HTML/JS Core компонентов.

## Запуск

```bash
npm install
npm run storybook
```

По умолчанию Storybook поднимается на `http://127.0.0.1:6006`.

## Что уже покрыто

- Foundations / Button
- Overlays / Modal
- Overlays / Dropdown
- Data / DataTable

Storybook собран на `@storybook/html-vite`, поэтому истории работают прямо с исходными CSS entrypoints и `packages/js/src/rarog.esm.js`.
