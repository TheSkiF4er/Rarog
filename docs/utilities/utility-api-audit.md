# Utility API audit vs Tailwind

Этот аудит закрывает requested deliverables по utility parity и фиксирует текущий план добора API до Tailwind-like surface.

## Что уже сделано в этой итерации

- расширен utility surface для `layout`, `spacing`, `sizing`, `flex/grid`, `typography`, `colors`, `borders`, `radius`, `shadow`
- добавлены более широкие responsive-варианты на уровне source CSS
- расширены state/group/peer/data-state utility-варианты
- подготовлена parity-матрица и backlog в `docs/utilities/rarog-tailwind-parity.xlsx`

## Parity summary

| Area | Status | Notes |
| --- | --- | --- |
| layout | partially closed | добавлены display/flex/grid/basis/grow/shrink/grid-cols/grid-rows/span/gap |
| spacing | partially closed | добавлены axis spacing, auto margins, `space-x/y`, большая scale |
| sizing | partially closed | расширены `w/h/min/max`, fractions, screen/fit/aspect |
| flex/grid | partially closed | закрыты базовые alignment и grid span; ещё нужны order/auto-flow |
| typography | partially closed | расширены size/weight/leading/tracking/decoration/whitespace |
| backgrounds/colors | partially closed | semantic colors + palette shades 50-900 |
| borders/radius/shadow | partially closed | расширены border widths/sides, radius, shadow |
| states/variants | partially closed | добавлены hover/focus/active/disabled/group/peer/data-state + responsive generation |

## Main missing utilities

1. negative spacing и divide utilities
2. `order-*`, `grid-auto-flow-*`, `justify-items-*`, `place-self-*`
3. ring utilities и border-style variants
4. line clamp / prose / text balance helpers
5. gradients, background-position/size/repeat
6. skew, hue-rotate, saturate, drop-shadow filter
7. generic `aria-*` / generic `data-*` variants

## Prioritized backlog

### P1

- добить parity для phase-1 surface: layout, spacing, sizing, flex/grid, typography, colors, borders
- сделать variant generator шире, чем текущий статический слой
- улучшить unknown class diagnostics и arbitrary value validation

### P2

- ring/divide utilities
- advanced typography helpers
- gradients и advanced filters
- richer layout helpers (`order`, `grid-auto-flow`, `place-self`)

### P3

- generic aria/data variant DSL
- более полный Tailwind-style variant stacking

## Artifacts

- spreadsheet parity / missing / backlog: `docs/utilities/rarog-tailwind-parity.xlsx`
