# Согласующий слой Vue v1

`@rarog/vue` provides Vue 3 and Пригодный для Nuxt оболочки around Рарог базовые элементы and `@rarog/js`.

## Что входит

- расширение install path for app-wide registration
- core wrapped Компонентs for forms, feedback and Компоновка
- всплывающий слой оболочки for modal, боковая панель, dropdown and tooltip
- composable вспомогательные средства for direct instance access
- Nuxt стартовый шаблон Пример

## Рекомендуемое применение

```ts
import RarogPlugin from "@rarog/vue";
```

Register the plugin once, then use `<RarogProvider>` at the shell level.

## Компонент coverage

- Кнопка
- Поле ввода
- Текстовая область
- Поле выбора
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
- Модальное окно
- Боковая панель
- Выпадающее меню

## Nuxt notes

The согласующий слой defers DOM work until mounted, so SSR output stays stable and client activation is predictable.

## Примеры

- `examples/starters/nuxt-rarog`
