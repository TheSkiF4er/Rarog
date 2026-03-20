# Семантические токены

Семантические токены are the stable API between design tokens and components.

## Naming system

Rarog uses intent-first names instead of direct palette names for shared UI surfaces:

- `bg`, `bgSoft`, `bgElevated`, `bgElevatedSoft`
- `surface`
- `border`, `borderSubtle`, `borderStrong`
- `text`, `textMuted`, `muted`
- `focusRing`, `accentSoft`
- `primary`, `primaryForeground`, `secondary`, `secondaryForeground`

## Why this matters

A component should ask for `surface` or `textMuted`, not `slate-100` or `blue-600`. This lets themes switch from SaaS to enterprise to white-label without touching component CSS.

## Mapping guidance

- raw blue/teal/etc. -> semantic `primary` / `secondary`
- neutral ramps -> `bg*`, `surface`, `border*`, `text*`
- focus styles -> `focusRing`
- selection and quiet emphasis -> `accentSoft`

## Component hooks

Examples of component-token usage:

- `button.radius -> {shape.control}`
- `card.shadow -> {shadow.md}`
- `input.focusRing -> {semantic.color.focusRing}`
