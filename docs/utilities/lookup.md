# Справочник утилит

Справочник утилит — это быстрый навигатор по наиболее частым задачам и соответствующим utility-классам Рарог.

## Компоновка и spacing

- stack с gap → `d-flex flex-column gap-*`
- horizontal cluster → `d-flex gap-* flex-wrap align-items-center`
- responsive columns → `rg-row` + `rg-col-*`
- Панель shell → `d-grid`, `grid-cols-*`, `min-h-screen`, `p-*`

## Размеры

- фиксированная ширина → `w-*` / arbitrary `w-[320px]`
- panel с минимальной высотой → `min-h-*`
- секция на весь viewport → `min-h-screen`

## Типографика

- иерархия заголовков → `h1`…`h6`
- акценты в основном тексте → `fw-semibold`, `text-muted`
- усечение → `text-truncate`

## Состояния и варианты

- hover → `hover:*`
- focus-visible ring → `focus:*`
- responsive → `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- contextual/data variants → `data-*`, `group-*`, `peer-*`

## Связанные документы

- [Аудит Utility интерфейс vs Tailwind](utility-api-audit.md)
- [Миграция с Tailwind](../migration/from-tailwind.md)
