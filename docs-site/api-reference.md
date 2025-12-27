# API Reference (Rarog 2.x)

Этот раздел фиксирует публичное API ветки **2.x**: какие утилиты и компоненты
считаются стабильными и поддерживаются с гарантиями семантического версионирования.

## Utilities (утилиты)

### Layout & Display

- `d-block`, `d-inline`, `d-inline-block`
- `d-flex`, `d-inline-flex`, `d-grid`, `d-none`
- `flex-row`, `flex-column`, `flex-wrap`, `flex-nowrap`
- Выравнивание:
  - `justify-start`, `justify-center`, `justify-between`, `justify-end`
  - `items-start`, `items-center`, `items-baseline`, `items-end`
- Gap:
  - `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-6`
- Overflow:
  - `overflow-hidden`, `overflow-auto`, `overflow-x-auto`, `overflow-y-auto`

### Spacing

На основе токенов `--rarog-space-*`:

- Margin:
  - `mt-0..6`, `mb-0..6`, `ml-0..6`, `mr-0..6`
  - `mx-0..6`, `my-0..6`
- Padding:
  - `pt-0..6`, `pb-0..6`, `pl-0..6`, `pr-0..6`
  - `px-0..6`, `py-0..6`

### Typography

- Выравнивание: `text-left`, `text-center`, `text-right`
- Состояния текста: `text-muted`, `text-primary`, `text-secondary`, `text-success`, `text-danger`, `text-warning`, `text-info`
- Размер/вес (если определены в вашей теме) — через кастомные классы или utility-слой проекта.

### Color utilities

- `bg-primary`, `bg-secondary`, `bg-success`, `bg-danger`, `bg-warning`, `bg-info`
- `border-primary`, `border-secondary`, `border-success`, `border-danger`, `border-warning`, `border-info`

Привязаны к токенам из `theme.colors` и `theme.colors.semantic`.

### Responsive / State

- Responsive-префиксы:
  - `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- State-префиксы:
  - `hover:`, `focus:`
- Поддерживаемые комбинации:
  - `sm:d-flex`, `md:d-none`, `lg:text-center`, `xl:mt-4` и аналогичные для других утилит.
  - `hover:bg-primary`, `hover:text-primary`, `hover:underline`
  - `focus:border-primary`, `focus:outline-none` (с учётом требований доступности).

### Accessibility & Helpers

- `sr-only` — скрытый для глаз, доступный для screen reader.
- Вспомогательные классы для layout/spacing типового использования.

## Components (компоненты)

Компоненты Rarog 2.x считаются стабильными при условии соблюдения базовой структуры
разметки и классов.

### Buttons

- Базовые классы:
  - `.btn`
- Варианты:
  - `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`, `.btn-warning`, `.btn-info`
  - `.btn-outline`, `.btn-ghost`
  - `.btn-sm`, `.btn-lg` (если включены в вашей сборке)

### Alerts

- `.alert`
- Варианты:
  - `.alert-success`, `.alert-danger`, `.alert-warning`, `.alert-info`

### Badges

- `.badge`
- Варианты:
  - `.badge-primary`, `.badge-secondary`, `.badge-outline`

### List Group

- `.list-group`
- `.list-group-item`

### Breadcrumbs

- `.breadcrumb`
- `.breadcrumb-item`

### Nav & Tabs

- `.nav`
- `.nav-link`, `.nav-link-active`
- `.nav-tabs` (CSS-реализация табов)

### Pagination

- `.pagination`
- `.page-item`
- `.page-link`

### Progress

- `.progress`
- `.progress-bar`

### Forms

- `.form-group`
- `.form-row`
- Inline-form классы и утилиты выравнивания.

### Grid & Layout

- Контейнеры:
  - `.rg-container-sm`, `.rg-container-lg`
- Ряды и колонки:
  - `.rg-row`
  - `.rg-col-1` … `.rg-col-12`
  - Responsive-варианты: `.rg-col-sm-*`, `.rg-col-md-*`, `.rg-col-lg-*`, `.rg-col-xl-*`, `.rg-col-2xl-*`
- Order/offset:
  - `.rg-order-1` … `.rg-order-12`
  - `.rg-offset-1` … `.rg-offset-11` (+ responsive-варианты)
- Gutter:
  - переменные `--rarog-grid-gap-x`, `--rarog-grid-gap-y` и соответствующие утилиты, если включены.

## JavaScript API

Набор JS-компонентов в 2.x:

- `Dropdown`
- `Collapse`
- `Modal`

Каждый компонент имеет:

- Data-API (атрибуты `data-rg-toggle`, `data-rg-target`, `data-rg-dismiss`).
- JS-API (например, `Rarog.Modal.getOrCreate(element)`).

Подробности см. раздел «JavaScript», здесь зафиксирован именно список поддерживаемых сущностей.

## Гарантии стабильности

- Все перечисленные утилиты, компоненты и JS-API считаются стабильными в ветке **2.x**.
- В минорных релизах 2.x (`2.1.0`, `2.2.0` и т.д.):
  - **допускается добавление** новых утилит/компонентов;
  - **не допускается** изменение или удаление уже описанных здесь API без миграционного гайда и мажорного релиза.
- В patch-релизах (`2.0.1`, `2.0.2`):
  - только исправления багов и улучшения без изменения публичного API.
