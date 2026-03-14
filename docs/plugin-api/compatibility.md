# Совместимость плагинов и политика SemVer

## Compatibility contract

Набор средств расширения v1 стабилен внутри мажорной ветки Рарог 3.x.

Это означает:

- `apiVersion: 1` не меняется в patch/minor релизах 3.x;
- minor-релизы 3.x могут **добавлять** новые необязательные поля в `ctx.meta`, `helpers` и `manifest`;
- удаление или изменение смысла существующих стабильных полей требует нового major интерфейс.

## Engine compatibility

Каждый SDK-плагин должен указывать:

```js
engine: {
  rarog: ">=1.0.0 <2.0.0"
}
```

Во время загрузки среда выполнения проверяет:

- соответствие `engine.rarog` версии Рарог;
- соответствие `manifest.apiVersion` ожидаемой версии SDK.

Несовместимый расширение entry не падает молча: среда выполнения пропускает его и пишет warning.

## SemVer policy

### Для Рарог core

- **PATCH** — багфиксы, новые предупреждения, улучшения diagnostics, не ломающие контракт.
- **MINOR** — новые необязательные capability flags, новые вспомогательное средство-методы, новые first-party plugins.
- **MAJOR** — изменение stable contract, удаление устаревший-совместимости, новая `apiVersion`.

### Для расширение SDK

- **PATCH** — внутренние фиксы harness/generator без изменения public Поверхность.
- **MINOR** — расширение public Поверхность назад-совместимым способом.
- **MAJOR** — breaking changes в `createPlugin`, `setup(ctx)` или manifest schema.

### Для third-party plugins

Рекомендуемая политика:

- PATCH — CSS bugfix / Документация / tests;
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

Устаревший function plugins поддерживаются в 3.x как migration path.

Для 4.0 рекомендуется:

- оставить устаревший только через compatibility layer, либо
- удалить устаревший contract и требовать SDK-object plugins.
