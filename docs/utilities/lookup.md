# Utility lookup

Utility lookup — это быстрый навигатор по наиболее частым задачам и соответствующим utility-классам Rarog.

## Layout and spacing

- stack with gaps → `d-flex flex-column gap-*`
- horizontal cluster → `d-flex gap-* flex-wrap align-items-center`
- responsive columns → `rg-row` + `rg-col-*`
- dashboard shell → `d-grid`, `grid-cols-*`, `min-h-screen`, `p-*`

## Sizing

- fixed width → `w-*` / arbitrary `w-[320px]`
- min height panel → `min-h-*`
- full viewport section → `min-h-screen`

## Typography

- title hierarchy → `h1`…`h6`
- body emphasis → `fw-semibold`, `text-muted`
- truncation → `text-truncate`

## States and variants

- hover → `hover:*`
- focus-visible ring → `focus:*`
- responsive → `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- contextual/data variants → `data-*`, `group-*`, `peer-*`

## Related docs

- [Utility API audit vs Tailwind](utility-api-audit.md)
- [Migration from Tailwind](../migration/from-tailwind.md)
