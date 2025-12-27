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

