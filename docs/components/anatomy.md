# Anatomy компонентов

Anatomy компонентов помогает объяснять не только внешний API, но и внутреннюю структуру, важную для theming, accessibility и composition.

## Общая модель anatomy

Почти все компоненты Rarog можно описать через четыре слоя:

1. **Root** — контейнер и semantic role
2. **Control / trigger** — интерактивная часть
3. **Content / panel** — основное содержимое
4. **Affordances** — icon slots, badges, helper text, dismiss buttons

## Пример: dialog

- root: `.modal`
- container: `.modal-dialog`
- header: `.modal-header`
- title: `.modal-title`
- body: `.modal-body`
- footer: `.modal-footer`

## Пример: tabs

- list: контейнер tablist
- trigger: кнопка вкладки с selected-state
- panel: поверхность контента, связанная через ARIA-отношения

## Почему это важно

Anatomy-страницы помогают:

- делать theme overrides без поломки компонента;
- стабильно оформлять визуальные тесты;
- держать consistent accessibility checklist между React, Vue и vanilla-реализациями.
