# Theming

Rarog поддерживает несколько тем (default, dark, contrast), а также свои темы
через переопределение CSS-переменных.

Базовые токены задаются в:

- `packages/core/src/tokens/_color.css`
- `packages/core/src/tokens/_spacing.css`
- `packages/core/src/tokens/_radius.css`
- `packages/core/src/tokens/_shadow.css`
- `packages/core/src/tokens/_breakpoints.css`

Для кастомизации:

1. Скопируйте `rarog.config.js`.
2. Переопределите `theme.colors`, `spacing`, `radius`, `shadow`, `screens`.
3. Выполните:

```bash
npx rarog build
```

4. Подключите собственный файл темы (если нужно) после базового `rarog-core.css`.


## Готовые theme packs (3.3.0+)

Начиная с 3.3.0, вместе с базовыми темами (`default`, `dark`, `contrast`) в Rarog
появились преднастроенные theme‑packs:

- `.theme-enterprise` — спокойная B2B‑палитра для дашбордов и внутренних продуктов.
- `.theme-creative` — более яркий вариант для лендингов, промо и креативных проектов.

Они реализованы как отдельные CSS‑файлы в пакете `packages/themes`:

- `rarog-theme-default.css`
- `rarog-theme-dark.css`
- `rarog-theme-contrast.css`
- `rarog-theme-enterprise.css`
- `rarog-theme-creative.css`

Пример подключения альтернативной темы через класс на `<html>`:

```html
<html class="theme-enterprise">
  <head>
    <link rel="stylesheet" href="/css/rarog-core.css">
    <link rel="stylesheet" href="/css/rarog-utilities.css">
    <link rel="stylesheet" href="/css/rarog-components.css">
    <link rel="stylesheet" href="/css/rarog-theme-enterprise.css">
  </head>
  ...
</html>
```

Темы переопределяют семантические переменные:

- `--rarog-color-bg`, `--rarog-color-bg-soft`, `--rarog-color-bg-elevated-*`
- `--rarog-color-surface`
- `--rarog-color-border-*`
- `--rarog-color-text`, `--rarog-color-text-muted`
- `--rarog-color-focus-ring`, `--rarog-color-accent-soft`

за счёт чего все компоненты и утилиты автоматически перекрашиваются.

## Semantic vs raw tokens

`rarog.tokens.json` теперь чётко разделяет:

- **сырые шкалы** (`tokens.color.primary.*`, `tokens.spacing.*`, `tokens.radius.*`);
- **семантику** (`tokens.color.semantic.*`, `tokens.semantic.*`);
- **темы** (`tokens.themes.default/dark/contrast/enterprise/creative`).

Это упрощает интеграцию с дизайн‑инструментами и поддерживает сценарий
«одна дизайн‑система → несколько тем в коде и в Figma».
