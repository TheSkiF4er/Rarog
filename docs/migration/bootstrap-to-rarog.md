# Bootstrap → Rarog migration guide

Этот гайд нужен для команд, которые уже используют Bootstrap и хотят перейти на Rarog постепенно, без «big bang rewrite».

## Recommended migration path

1. Сначала запустите `rarog inspect classes`, чтобы понять смесь Bootstrap / Tailwind / Rarog классов в проекте.
2. Подключите compatibility preset `bootstrap-spacing`.
3. Переносите layout и spacing раньше компонентов.
4. Потом мигрируйте кнопки, alerts, badges, form controls.
5. В конце удаляйте bootstrap-specific helpers и проверяйте визуальные regression snapshots.

## CLI MVP

```bash
rarog inspect classes src/**/*.html
rarog migrate bootstrap --input src/index.html --output src/index.migrated.html
rarog migrate bootstrap --input src/app.jsx --output src/app.jsx --write
```

## High-value mappings

| Bootstrap | Rarog | Notes |
| --- | --- | --- |
| `row` | `rg-row` | базовая grid-row модель |
| `col-12` | `rg-col-12` | direct mapping |
| `col-md-6` | `rg-col-md-6` | same breakpoint intent |
| `g-3` | `rg-gap-3` | лучше через preset |
| `justify-content-between` | `justify-between` | flex helper |
| `align-items-center` | `items-center` | flex alignment |
| `text-start` | `text-left` | logical simplification |
| `fw-bold` | `font-bold` | typography helper |
| `rounded-pill` | `rounded-full` | radius mapping |
| `w-100` | `w-full` | sizing helper |
| `btn btn-primary` | `btn btn-primary` | component survives nearly unchanged |
| `alert alert-primary` | `alert alert-primary` | component survives nearly unchanged |

## Manual review zones

Нужно перепроверять вручную:

- complex forms with validation markup
- navbar / offcanvas compositions
- utility combinations with `position-*`, `translate-middle`, `z-*`
- custom bootstrap themes and Sass overrides

## Suggested rollout

- **Week 1:** enable preset + inspect classes
- **Week 2:** migrate spacing/layout helpers
- **Week 3:** migrate components
- **Week 4:** remove bootstrap CSS from bundles
