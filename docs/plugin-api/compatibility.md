# Совместимость плагинов и политика SemVer

## Compatibility contract

Plugin SDK v1 стабилен внутри мажорной ветки Rarog 3.x.

Это означает:

- `apiVersion: 1` не меняется в patch/minor релизах 3.x;
- minor-релизы 3.x могут **добавлять** новые необязательные поля в `ctx.meta`, `helpers` и `manifest`;
- удаление или изменение смысла существующих стабильных полей требует нового major API.

## Engine compatibility

Каждый SDK-плагин должен указывать:

```js
engine: {
  rarog: ">=1.0.0 <2.0.0"
}
```

Во время загрузки runtime проверяет:

- соответствие `engine.rarog` версии Rarog;
- соответствие `manifest.apiVersion` ожидаемой версии SDK.

Несовместимый plugin entry не падает молча: runtime пропускает его и пишет warning.

## SemVer policy

### Для Rarog core

- **PATCH** — багфиксы, новые предупреждения, улучшения diagnostics, не ломающие контракт.
- **MINOR** — новые необязательные capability flags, новые helper-методы, новые first-party plugins.
- **MAJOR** — изменение stable contract, удаление legacy-совместимости, новая `apiVersion`.

### Для plugin SDK

- **PATCH** — внутренние фиксы harness/generator без изменения public surface.
- **MINOR** — расширение public surface назад-совместимым способом.
- **MAJOR** — breaking changes в `createPlugin`, `setup(ctx)` или manifest schema.

### Для third-party plugins

Рекомендуемая политика:

- PATCH — CSS bugfix / docs / tests;
- MINOR — новые классы и компоненты назад-совместимым способом;
- MAJOR — удаление классов, rename публичных селекторов, изменение required engine range.

## Возможность flags

Текущие flags:

- `utilities`
- `components`
- `tokens`
- `themes`
- `js`
- `diagnostics`

Новые flags могут добавляться только минорными релизами.

## Backward compatibility

Legacy function plugins поддерживаются в 3.x как migration path.

Для 4.0 рекомендуется:

- оставить legacy только через compatibility layer, либо
- удалить legacy contract и требовать SDK-object plugins.
