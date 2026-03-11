# Live playground

Интерактивный playground расположен в `examples/playground/` и служит общей live-площадкой для demos, troubleshooting и handoff между docs, design и development.

## What it covers

- overlay behaviors: modal, offcanvas, toast
- interactive primitives: dropdown, popover, tooltip
- form widgets: select, combobox, tags input
- data surfaces: sortable table
- theme switching and scoped themes
- token browser for raw / semantic / runtime layers

## How to run locally

```bash
npm run docs:dev
```

Для live examples можно также открыть `examples/playground/index.html` напрямую или поднять локальный static server.

## How docs link to it

GitBook-страницы используют playground как canonical live reference. Это позволяет держать документацию легкой, а интерактивность — в одном месте.
