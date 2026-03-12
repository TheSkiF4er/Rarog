# Chakra UI to Rarog

## Best fit for migration

Переход особенно логичен, если команда упёрлась в React-only scope и хочет более широкий theming/runtime story.

## Mapping strategy

- Chakra theme tokens → Rarog semantic tokens
- Chakra component variants → Rarog component classes + tokens
- app shell layouts → Rarog grid + utilities

## Recommended path

1. Сначала перенесите theme vocabulary.
2. Затем переведите app shell и primitives.
3. После этого мигрируйте form-heavy и dashboard-heavy страницы.
