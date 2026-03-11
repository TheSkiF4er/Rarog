# CLI

Use the CLI for local development, builds, and diagnostics.

## Common commands

```bash
rarog build
rarog build --debug
rarog analyze
rarog doctor
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
