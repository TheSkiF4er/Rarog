# Платформа документации

Платформа документации делает документацию частью DX-стратегии Rarog, а не просто набором markdown-файлов.

## Опорные принципы

1. **Поисковость** — GitBook search + lookup-страницы для utilities, components, themes и migration.
2. **Живое понимание** — интерактивный playground и copy-paste примеры.
3. **Системное мышление** — anatomy-разборы компонентов, a11y notes, token/theme explorer.
4. **Уверенность в миграции** — пошаговые guides для перехода с Tailwind, Bootstrap и старых Rarog API.

## Модель контента

- `docs/SUMMARY.md` — canonical navigation tree
- `.gitbook.yaml` — корень и структура GitBook
- `examples/playground/` — живая demo-поверхность
- `examples/starters/` — каталог официальных стартеров
- `tests/starters/smoke.mjs` — smoke baseline для набора стартеров

## Конкурентные преимущества

- docs привязаны к реальным package surfaces, а не к абстрактным примерам;
- компоненты документируются вместе с anatomy и accessibility-поведением;
- токены и темы объясняются как runtime system, а не только как CSS variables;
- стартеры документируются рядом с install flow и smoke coverage.
