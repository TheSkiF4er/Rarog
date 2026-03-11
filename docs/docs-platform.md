# Docs platform v2

Docs platform v2 делает документацию частью DX-стратегии Rarog, а не просто набором markdown-файлов.

## Pillars

1. **Searchability** — GitBook search + lookup-страницы для utilities, components, themes и migration.
2. **Live understanding** — интерактивный playground и copy-paste примеры.
3. **System thinking** — anatomy-разборы компонентов, a11y notes, token/theme explorer.
4. **Migration confidence** — пошаговые guides для перехода с Tailwind, Bootstrap и старых Rarog API.

## Content model

- `docs/SUMMARY.md` — canonical navigation tree
- `.gitbook.yaml` — GitBook root/structure
- `examples/playground/` — live demo surface
- `examples/starters/` — official starter catalog
- `tests/starters/smoke.mjs` — smoke baseline для starter fleet

## Competitive advantages

- docs привязаны к реальным package surfaces, а не абстрактным примерам;
- компоненты документируются вместе с anatomy и accessibility поведением;
- токены и темы объясняются как runtime system, а не только как CSS variables;
- starter-ы документируются рядом с install flow и smoke coverage.
