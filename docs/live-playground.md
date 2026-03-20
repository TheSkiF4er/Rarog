# Живой playground

Интерактивный playground расположен в `examples/playground/` и служит общей живой площадкой для demos, troubleshooting и handoff между docs, design и development.

## Что он покрывает

- overlay-поведения: modal, offcanvas, toast;
- интерактивные primitives: dropdown, popover, tooltip;
- form widgets: select, combobox, tags input;
- data surfaces: sortable table;
- переключение тем и scoped themes;
- обозреватель токенов для raw / semantic / runtime слоёв.

## Как запускать локально

```bash
npm run docs:dev
```

Для живых примеров можно также открыть `examples/playground/index.html` напрямую или поднять локальный static server.

## Как docs ссылаются на playground

GitBook-страницы используют playground как canonical live reference. Это позволяет держать документацию лёгкой, а интерактивность — в одном месте.
