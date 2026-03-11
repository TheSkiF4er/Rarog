# Component anatomy

Component anatomy помогает объяснять не только внешний API, но и внутреннюю структуру, важную для theming, accessibility и composition.

## Shared anatomy model

Почти все компоненты Rarog можно описать через четыре слоя:

1. **Root** — контейнер и semantic role
2. **Control / trigger** — интерактивная часть
3. **Content / panel** — основное содержимое
4. **Affordances** — icon slots, badges, helper text, dismiss buttons

## Example: dialog

- root: `.modal`
- container: `.modal-dialog`
- header: `.modal-header`
- title: `.modal-title`
- body: `.modal-body`
- footer: `.modal-footer`

## Example: tabs

- list: tablist container
- trigger: each tab button with selected state
- panel: content surface tied through ARIA relationships

## Why it matters

Anatomy pages помогают:

- делать theme overrides без ломки компонента;
- стабильно оформлять visual tests;
- держать consistent accessibility checklist между реализациями React, Vue и vanilla.
