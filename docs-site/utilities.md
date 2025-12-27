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

## Effects & Filters

- Blur:
  - `blur-none`, `blur-sm`, `blur-md`, `blur-lg`
- Brightness:
  - `brightness-90`, `brightness-100`, `brightness-110`, `brightness-125`, `brightness-150`
- Contrast:
  - `contrast-75`, `contrast-100`, `contrast-125`, `contrast-150`
- Цветовые эффекты:
  - `grayscale`, `invert`, `sepia`
- Backdrop-фильтры (там, где поддерживаются браузером):
  - `backdrop-blur-none`, `backdrop-blur-sm`, `backdrop-blur-md`, `backdrop-blur-lg`
- Blend-режимы:
  - `mix-blend-normal/multiply/screen/overlay/darken/lighten/difference`
  - `bg-blend-normal/multiply/screen/overlay`

## Scroll & Overscroll

- Overscroll:
  - `overscroll-auto`, `overscroll-contain`, `overscroll-none`
- Поведение скролла:
  - `scroll-auto`, `scroll-smooth`
- Anchor-offset для заголовков:
  - `scroll-mt-0/1/2/3/4/5/6/8/10/12`
- Дополнительный отступ снизу при прокрутке:
  - `scroll-pb-0/1/2/3/4/5/6/8/10/12`

## Scroll Snap

- Ось:
  - `snap-none`, `snap-x`, `snap-y`, `snap-both`
- Выравнивание элементов:
  - `snap-start`, `snap-center`, `snap-end`

Пример:

```html
<div class="d-flex overflow-x-auto snap-x">
  <div class="snap-start w-64">Card 1</div>
  <div class="snap-start w-64">Card 2</div>
  <div class="snap-start w-64">Card 3</div>
</div>
```

## Multi-column / Columns

- `columns-2`, `columns-3`, `columns-4` — базовый многоколоночный layout для текста/списков.

Пример:

```html
<div class="columns-3 gap-4">
  <p>Длинный текст 1...</p>
  <p>Длинный текст 2...</p>
  <p>Длинный текст 3...</p>
</div>
```

## Print utilities

Утилиты для управления видимостью при печати (используются как обычные классы):

- `print:hidden` — скрыть элемент на печати;
- `print:block` — показать как `block`;
- `print:inline` — показать как `inline`;
- `print:flex` — показать как `flex`.

Пример:

```html
<div class="alert alert-info print:hidden">
  Это уведомление видно в браузере, но скрыто на печати.
</div>
```

## RTL / Logical spacing

Первый слой RTL/логических утилит (работают через `margin-inline-*` / `padding-inline-*`):

- Отступы по “логическому началу/концу”:
  - `ms-0/1/2/3/4/5/6/8/10/12` — `margin-inline-start`
  - `me-0/1/2/3/4/5/6/8/10/12` — `margin-inline-end`
- Внутренние отступы:
  - `ps-0/1/2/3/4/5/6/8/10/12` — `padding-inline-start`
  - `pe-0/1/2/3/4/5/6/8/10/12` — `padding-inline-end`

Используются совместно с `dir="rtl"` на `html` или контейнере.

## Visibility & Accessibility

- `d-none`, `overflow-hidden`, `overflow-auto`, `overflow-x-auto`, `overflow-y-auto`
- `sr-only`, `sr-only-focusable`

---

Подробнее см. исходник:

```text
packages/utilities/src/rarog-utilities.css
```
