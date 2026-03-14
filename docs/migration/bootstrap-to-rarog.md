# Bootstrap → Рарог migration guide

Этот гайд нужен для команд, которые уже используют Bootstrap и хотят перейти на Рарог постепенно, без big bang rewrite.

## Рекомендуемый путь миграции

1. Сначала запустите `rarog inspect classes`, чтобы понять смесь Bootstrap / Tailwind / Рарог классов в проекте.
2. Подключите compatibility preset `bootstrap-spacing`.
3. Переносите Компоновка и spacing раньше компонентов.
4. Потом мигрируйте кнопки, alerts, badges и form controls.
5. В конце удаляйте bootstrap-specific вспомогательные средства и проверяйте visual regression snapshots.

## средство командной строки MVP

```bash
rarog inspect classes src/**/*.html
rarog migrate bootstrap --input src/index.html --output src/index.migrated.html
rarog migrate bootstrap --input src/app.jsx --output src/app.jsx --write
```

## High-value mappings

| Bootstrap | Рарог | Комментарий |
| --- | --- | --- |
| `row` | `rg-row` | базовая grid-row модель |
| `col-12` | `rg-col-12` | прямое сопоставление |
| `col-md-6` | `rg-col-md-6` | тот же intent по breakpoint |
| `g-3` | `rg-gap-3` | лучше через preset |
| `justify-content-between` | `justify-between` | flex вспомогательное средство |
| `align-items-center` | `items-center` | выравнивание flex |
| `text-start` | `text-left` | упрощение логических классов |
| `fw-bold` | `font-bold` | typography вспомогательное средство |
| `rounded-pill` | `rounded-full` | сопоставление radius |
| `w-100` | `w-full` | вспомогательное средство размера |
| `btn btn-primary` | `btn btn-primary` | компонент почти не меняется |
| `alert alert-primary` | `alert alert-primary` | компонент почти не меняется |

## Зоны ручной проверки

Нужно перепроверять вручную:

- сложные формы с validation markup;
- верхняя панель / боковая панель композиции;
- utility-комбинации с `position-*`, `translate-middle`, `z-*`;
- кастомные bootstrap themes и Sass overrides.

## Рекомендуемый rollout

- **Неделя 1:** enable preset + inspect classes
- **Неделя 2:** миграция spacing/layout вспомогательные средства
- **Неделя 3:** миграция компонентов
- **Неделя 4:** удаление Bootstrap CSS из бандлов
