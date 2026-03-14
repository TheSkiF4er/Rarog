# Программа сравнительных замеров «Рарог»

This directory is the reproducible сравнительный замер рабочее пространство for Рарог.

## Что измеряется

- build speed
- JIT speed
- output size
- среда выполнения cost
- theme switch cost
- Компонент render overhead

## Компоновка

- `fixtures/jit-app/` — minimal app used by the JIT сравнительный замер
- `results/latest.json` — latest machine-readable сравнительный замер snapshot
- `results/latest.md` — latest markdown summary
- `scenarios/framework-baselines.json` — comparison baselines for Bootstrap, Tailwind, UnoCSS, shadcn/ui stack, Chakra UI and MUI

## Run locally

```bash
npm run bench:run
npm run bench:publish
```

`bench:run` regenerates the local snapshot. `bench:publish` also copies the latest snapshot into `docs/benchmarks/` so Документация can render the current public page.

## Reproducibility model

Рарог numbers are measured directly from this repository. Cross-framework comparisons are intentionally stored as scenario baselines until each competitor checkout is wired into CI with pinned versions and fixture parity.

That means the harness is reproducible Сегодня for Рарог and structurally ready for external framework checkouts without changing the report format.
