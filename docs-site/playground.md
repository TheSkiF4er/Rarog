# Playground

Rarog теперь включает локальный demo playground без отдельной сборки.

## Запуск

```bash
npm run playground
```

Открой `http://127.0.0.1:4173/examples/playground/`.

## Что умеет playground

- переключение сцен (`Modal`, `Dropdown`, `Forms`, `DataTable`)
- смена темы
- RTL toggle
- логирование runtime-событий

Playground использует исходные CSS entrypoints и `packages/js/src/rarog.esm.js`, поэтому хорошо подходит для быстрой ручной проверки компонентов и lifecycle.
