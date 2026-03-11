# Theme engine

Theme engine turns themes into a first-class product feature.

## Supported scenarios

- light / dark
- multi-brand
- per-tenant themes
- runtime switching
- scoped themes
- theme diffing

## CLI

```bash
rarog theme create themes/acme.json --name=acme --extends=default
rarog theme diff packages/themes/presets/aurora.json packages/themes/presets/graphite.json
rarog theme validate packages/themes/presets/enterprise-plus.json
```

## Official polished themes

- `aurora` — bright SaaS
- `graphite` — dark operations UI
- `enterprise-plus` — white-label B2B baseline

## Runtime model

A tenant wrapper can opt into a theme via `data-rg-theme="..."`. Theme CSS only overrides semantic/runtime variables, so utilities and components continue to work unchanged.
