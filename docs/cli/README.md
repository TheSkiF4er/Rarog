# CLI

Use the CLI for local development, builds, and diagnostics.

## Common commands

```bash
rarog build
rarog build --debug
rarog analyze
rarog doctor
rarog token inspect rarog.tokens.json --path=tokens.color.semantic
rarog token diff rarog.tokens.json snapshots/rarog.tokens.prev.json
rarog theme diff packages/themes/presets/enterprise-plus.json themes/acme.json
rarog component scaffold PricingCard --dir src/components
rarog audit a11y src
rarog audit bundle dist
rarog inspect classes src/index.html
rarog migrate bootstrap --input src/index.html --output src/index.migrated.html
rarog migrate tailwind --input src/App.tsx --output src/App.rg.tsx
```

## When to use the CLI

Use the CLI when you want to:

* run local development flows
* build production output
* inspect config or runtime behavior

## See also

* [Config](../config/README.md)
* [Build](../build/README.md)


## JIT diagnostics

- `rarog build --debug` — пишет debug JSON рядом с JIT output
- `rarog analyze` — показывает scan summary и unknown utility-like classes
- `rarog doctor` — быстро проверяет config/build/JIT surface


## Migration toolkit

- `rarog inspect classes` — показывает mix из Rarog / Bootstrap / Tailwind классов
- `rarog migrate bootstrap` — first-pass codemod для Bootstrap-разметки
- `rarog migrate tailwind` — first-pass codemod для Tailwind-разметки


## Pro tools

- `rarog token inspect` — показывает leaf token values по файлу или dot-path
- `rarog token diff` — сравнивает два token JSON snapshot
- `rarog theme diff` — сравнивает semantic/runtime theme manifests
- `rarog component scaffold` — генерирует starter component files
- `rarog audit a11y` — лёгкий static accessibility audit
- `rarog audit bundle` — проверяет размеры CSS/JS output

Подробнее: [CLI Pro tools](./pro-tools.md)


## CLI Pro workflow

Rarog CLI Pro теперь включает эксплуатационные команды для quality bar и design-system governance:

- `rarog doctor`
- `rarog token inspect`
- `rarog token diff`
- `rarog theme diff`
- `rarog component scaffold`
- `rarog audit a11y`
- `rarog audit bundle`

Для release-готовности используйте также:

- `npm run test:starters-install`
- `npm run test:package-matrix`
- `npm run test:examples-ci`
- `npm run docs:links`
- `npm run test:exports`
- `npm run quality:gates`
