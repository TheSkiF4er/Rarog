# Семантические токены

Семантические токены are the stable интерфейс between design tokens and Компонентs.

## Naming system

Рарог uses intent-first names instead of direct palette names for shared UI Поверхностьs:

- `bg`, `bgSoft`, `bgElevated`, `bgElevatedSoft`
- `surface`
- `border`, `borderSubtle`, `borderStrong`
- `text`, `textMuted`, `muted`
- `focusRing`, `accentSoft`
- `primary`, `primaryForeground`, `secondary`, `secondaryForeground`

## Why this matters

A Компонент should ask for `surface` or `textMuted`, not `slate-100` or `blue-600`. This lets themes switch from SaaS to enterprise to под стороннюю марку without touching Компонент CSS.

## Mapping guidance

- raw blue/teal/etc. -> semantic `primary` / `secondary`
- neutral ramps -> `bg*`, `surface`, `border*`, `text*`
- focus styles -> `focusRing`
- selection and quiet emphasis -> `accentSoft`

## Компонент hooks

Примеры of Компонент-token usage:

- `button.radius -> {shape.control}`
- `card.shadow -> {shadow.md}`
- `input.focusRing -> {semantic.color.focusRing}`
