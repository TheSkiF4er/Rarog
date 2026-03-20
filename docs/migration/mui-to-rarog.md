# MUI → Rarog

## Когда миграция особенно уместна

Подходит командам, которым нужен более лёгкий platform layer, сильнее white-label story и меньше React-specific lock-in.

## Стратегия сопоставления

- MUI palette / shape / shadows → Rarog tokens
- MUI layout wrappers → Rarog layout utilities
- MUI themed apps → Rarog multi-theme manifests

## Рекомендуемый путь

1. Зафиксируйте design tokens.
2. Поднимите один showcase-flow на Rarog.
3. Затем заменяйте сложные app sections поэтапно.
