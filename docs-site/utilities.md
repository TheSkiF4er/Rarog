# Utilities

Утилиты Rarog позволяют верстать большинство интерфейсов без написания кастомного CSS.

## Layout & Display

- `d-block`, `d-inline`, `d-inline-block`
- `d-flex`, `d-inline-flex`, `d-grid`, `d-none`
- `flex-row`, `flex-column`, `flex-wrap`, `flex-nowrap`
- `justify-*`, `items-*`, `gap-*`
- responsive-варианты: `sm:*`, `md:*`, `lg:*`, `xl:*`, `xl2:*`

## Position & Z-index

- Позиционирование:
  - `relative`, `absolute`, `fixed`, `sticky`
- Координаты:
  - `top-0`, `right-0`, `bottom-0`, `left-0`
  - `top-1/2`, `left-1/2`, `right-1/2`, `bottom-1/2`
  - `top-full`, `left-full`, `right-full`, `bottom-full`
- Z-слой:
  - `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`, `z-auto`

## Sizing & Aspect ratio

- Ширина:
  - `w-1/2`, `w-1/3`, `w-2/3`, `w-full`, `w-screen`
- Высота:
  - `h-1/2`, `h-1/3`, `h-2/3`, `h-full`, `h-screen`
- Min/Max:
  - `min-w-full`, `max-w-full`, `min-h-full`, `max-h-full`
- Aspect ratio:
  - `aspect-video` (16:9)
  - `aspect-square` (1:1)

## Borders, Radius, Shadow & Effects

- Скругления:
  - `rounded-none`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`
- Тени:
  - `shadow-none`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`
- Границы:
  - `border`, `border-0`, `border-t`, `border-b`, `border-l`, `border-r`
  - `border-primary`, `border-secondary`, `border-success`, `border-danger`, `border-warning`, `border-info`
- Transitions:
  - `transition`, `transition-colors`, `transition-opacity`, `transition-transform`
  - `duration-75/100/150/200/300/500/700/1000`
  - `ease-linear`, `ease-in`, `ease-out`, `ease-in-out`
- Animations:
  - `animate-spin`, `animate-pulse`

## Typography

- Размеры текста:
  - `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`
- Вес шрифта:
  - `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- Межстрочный интервал:
  - `leading-none`, `leading-tight`, `leading-snug`, `leading-normal`, `leading-relaxed`, `leading-loose`
- Выравнивание:
  - `text-left`, `text-center`, `text-right`

## Visibility & Accessibility

- `d-none`, `overflow-hidden`, `overflow-auto`, `overflow-x-auto`, `overflow-y-auto`
- `sr-only`, `sr-only-focusable`

---

Подробнее см. исходник:

```text
packages/utilities/src/rarog-utilities.css
```
