# Vue adapter v1

`@rarog/vue` provides Vue 3 and Nuxt-friendly wrappers around Rarog primitives and `@rarog/js`.

## What is included

- plugin install path for app-wide registration
- core wrapped components for forms, feedback and layout
- overlay wrappers for modal, offcanvas, dropdown and tooltip
- composable helpers for direct instance access
- Nuxt starter example

## Recommended usage

```ts
import RarogPlugin from "@rarog/vue";
```

Register the plugin once, then use `<RarogProvider>` at the shell level.

## Component coverage

- Кнопка
- Поле ввода
- Текстовая область
- ВыборField
- Чекбокс
- Радиокнопка
- Переключатель
- Карточка
- Алерт
- Бейдж
- Спиннер
- Скелетон
- Вкладки
- Аккордеон
- Подсказка
- Modal
- Offcanvas
- Выпадающее меню

## Nuxt notes

The adapter defers DOM work until mounted, so SSR output stays stable and client activation is predictable.

## Examples

- `examples/starters/nuxt-rarog`
