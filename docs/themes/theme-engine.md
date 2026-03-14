# Движок тем

Движок тем turns themes into a first-class product feature.

## Поддерживаемые сценарии

- light / dark
- multi-brand
- per-tenant themes
- среда выполнения switching
- scoped themes
- theme diffing

## средство командной строки

```bash
rarog theme create themes/acme.json --name=acme --extends=default
rarog theme diff packages/themes/presets/aurora.json packages/themes/presets/graphite.json
rarog theme validate packages/themes/presets/enterprise-plus.json
```

## Official polished themes

- `aurora` — bright SaaS
- `graphite` — dark operations UI
- `enterprise-plus` — под стороннюю марку B2B базовый уровень

## Рантайм model

A tenant оболочка can opt into a theme via `data-rg-theme="..."`. Theme CSS only overrides semantic/runtime variables, so вспомогательные классы and Компонентs Продолжить to work unchanged.


## Конструктор тем

A браузерный конструктор тем is available in `examples/ui-kits/white-label-demo/index.html`. It supports token editing, режим сравнения, import/export and предпросмотр доступности.
