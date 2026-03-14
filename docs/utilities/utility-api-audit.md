# Проверка полноты вспомогательного интерфейса относительно Tailwind

Этот аудит закрывает запрошенные deliverables по utility parity и фиксирует текущий план добора интерфейс до Tailwind-like Поверхность.

## Что уже сделано в этой итерации

- расширен utility Поверхность для `layout`, `spacing`, `sizing`, `flex/grid`, `typography`, `colors`, `borders`, `radius`, `shadow`
- добавлены более широкие responsive-варианты на уровне source CSS
- расширены state/group/peer/data-state utility-варианты
- подготовлена parity-матрица и очередь задач в `docs/utilities/rarog-tailwind-parity.xlsx`

## Parity summary

| Area | Состояние | Примечания |
| --- | --- | --- |
| Компоновка | partially closed | добавлены display/flex/grid/basis/grow/shrink/grid-cols/grid-rows/span/gap |
| spacing | partially closed | добавлены axis spacing, auto margins, `space-x/y`, большая scale |
| sizing | partially closed | расширены `w/h/min/max`, fractions, screen/fit/aspect |
| flex/grid | partially closed | закрыты базовые alignment и grid span; ещё нужны order/auto-flow |
| typography | partially closed | расширены size/weight/leading/tracking/decoration/whitespace |
| backgrounds/colors | partially closed | semantic colors + palette shades 50-900 |
| borders/radius/shadow | partially closed | расширены Граница widths/sides, radius, shadow |
| states/variants | partially closed | добавлены hover/focus/active/disabled/group/peer/data-state + responsive generation |

## Main missing вспомогательные классы

1. negative spacing и divide вспомогательные классы
2. `order-*`, `grid-auto-flow-*`, `justify-items-*`, `place-self-*`
3. ring вспомогательные классы и Граница-style variants
4. line clamp / prose / Текст balance вспомогательные средства
5. gradients, background-position/size/repeat
6. skew, hue-rotate, saturate, drop-shadow filter
7. generic `aria-*` / generic `data-*` variants

## Prioritized очередь задач

### P1

- добить parity для phase-1 Поверхность: Компоновка, spacing, sizing, flex/grid, typography, colors, Границаs
- сделать variant generator шире, чем текущий статический слой
- улучшить unknown class diagnostics и arbitrary value validation

### P2

- ring/divide вспомогательные классы
- advanced typography вспомогательные средства
- gradients и advanced filters
- richer Компоновка вспомогательные средства (`order`, `grid-auto-flow`, `place-self`)

### P3

- generic aria/data variant DSL
- более полный Tailwind-style variant stacking

## Artifacts

- spreadsheet parity / missing / очередь задач: `docs/utilities/rarog-tailwind-parity.xlsx`
