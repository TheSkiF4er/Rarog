# Chakra UI → Rarog

## Когда миграция особенно уместна

Переход особенно логичен, если команда упёрлась в React-only контур и хочет более широкую историю theming/runtime.

## Стратегия сопоставления

- Chakra theme tokens → Rarog semantic tokens
- Chakra component variants → Rarog component classes + tokens
- app shell layouts → Rarog grid + utilities

## Рекомендуемый путь

1. Сначала перенесите vocabulary темы.
2. Затем переведите app shell и primitives.
3. После этого мигрируйте form-heavy и dashboard-heavy страницы.
