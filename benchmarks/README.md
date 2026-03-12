# Rarog benchmark program

This directory is the reproducible benchmark workspace for Rarog.

## What we measure

- build speed
- JIT speed
- output size
- runtime cost
- theme switch cost
- component render overhead

## Layout

- `fixtures/jit-app/` — minimal app used by the JIT benchmark
- `results/latest.json` — latest machine-readable benchmark snapshot
- `results/latest.md` — latest markdown summary
- `scenarios/framework-baselines.json` — comparison baselines for Bootstrap, Tailwind, UnoCSS, shadcn/ui stack, Chakra UI and MUI

## Run locally

```bash
npm run bench:run
npm run bench:publish
```

`bench:run` regenerates the local snapshot. `bench:publish` also copies the latest snapshot into `docs/benchmarks/` so docs can render the current public page.

## Reproducibility model

Rarog numbers are measured directly from this repository. Cross-framework comparisons are intentionally stored as scenario baselines until each competitor checkout is wired into CI with pinned versions and fixture parity.

That means the harness is reproducible today for Rarog and structurally ready for external framework checkouts without changing the report format.
