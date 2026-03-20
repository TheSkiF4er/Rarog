# Базовый уровень доступности

Rarog теперь рассматривает accessibility как релизный baseline, а не как позднее улучшение.

## Базовые правила

- keyboard-first interactions для всех интерактивных компонентов;
- ARIA-паттерны только там, где нативной семантики недостаточно;
- общий visible focus ring через `:focus-visible`;
- `prefers-reduced-motion` соблюдается в overlays, loaders и transitions;
- color и surface tokens выбраны с ориентиром на AA-контраст по умолчанию;
- каждый компонент поставляется с чек-листом и точкой визуальной/a11y-регрессии.

## Автоматические проверки

- покрытие Vitest/jsdom для tabs, dialogs, select semantics и keyboard interactions;
- Playwright visual regression с включённым reduced motion;
- addon Storybook для a11y доступен для ручной проверки.

## Ручной чек-лист

Используйте `docs/accessibility-checklist-template.md` для каждого изменения компонента.
