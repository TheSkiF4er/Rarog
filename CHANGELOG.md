# Changelog


## [1.4.0] - 2025-12-27

### Добавлено
- Цветовые шкалы для ключевых тонов:
  - `--rarog-color-primary-50` … `--rarog-color-primary-900`;
  - аналогичные шкалы для `secondary`, `success`, `danger`, `warning`, `info`.
- Базовые semantic alias'ы для дизайн-системы:
  - фон: `--rarog-color-bg-elevated`, `--rarog-color-bg-elevated-soft`;
  - границы: `--rarog-color-border-subtle`, `--rarog-color-border-strong`;
  - вспомогательные: `--rarog-color-focus-ring`, `--rarog-color-accent-soft`.
- High-contrast тема:
  - новая тема `rarog-theme-contrast` на базе селектора `:root.theme-contrast`;
  - усиленный контраст текста, фона и границ, более заметный `focus-ring`.
- JSON-представление токенов:
  - файл `rarog.tokens.json` с экспортом цветовых шкал, spacing, radius и shadow-токенов;
  - подготовка к интеграции с Figma/Design Tokens tooling.
- Улучшения системы тем:
  - актуализированные темы `default` и `dark` с учётом новых semantic-переменных;
  - конфигурация сборки поддерживает минимум три темы: `default`, `dark`, `contrast`.

### Изменено
- Обновлён файл цветовых токенов `packages/core/src/tokens/_color.css` до версии v2 (шкалы + semantic alias'ы).
- Обновлён раздел документации по темизации (Theming & Design Tokens).


## [1.3.0] - 2025-12-27

### Добавлено
- Компоненты оповещений (alerts):
  - `.alert`, `.alert-success`, `.alert-danger`, `.alert-warning`, `.alert-info`;
  - вспомогательные классы `.alert-title` и `.alert-description`.
- Компоненты бейджей (badges):
  - `.badge`, `.badge-primary`, `.badge-secondary`, `.badge-outline`.
- Компоненты списков и навигации:
  - list group: `.list-group`, `.list-group-item`, модификаторы `.list-group-item-action`, `.list-group-item-active`;
  - breadcrumbs: `.breadcrumb`, `.breadcrumb-item`, `.breadcrumb-item-active`.
- Навигация и табы:
  - `.nav`, `.nav-link`, `.nav-link-active`;
  - `.nav-tabs` для таб-интерфейса на чистом CSS.
- Пагинация и прогресс:
  - `.pagination`, `.page-item`, `.page-link`, модификаторы `.page-item-active`, `.page-item-disabled`;
  - `.progress`, `.progress-bar`.
- Улучшения форм:
  - layout-классы `.form-inline`, `.form-row`, `.form-horizontal`;
  - helper-класс `.form-help` для текста под полями ввода.

### Изменено
- Обновлён сборочный вход компонентов `rarog-components.css` (подключены новые модульные файлы компонентов).


## [1.2.0] - 2025-12-27

### Добавлено
- 12-колоночная сетка rarog-grid:
  - базовые классы `.rg-row`, `.rg-col`, `.rg-col-auto`;
  - фиксированные колонки `.rg-col-1` … `.rg-col-12`;
  - responsive-варианты `.rg-col-sm-*`, `.rg-col-md-*`, `.rg-col-lg-*`, `.rg-col-xl-*`, `.rg-col-2xl-*`.
- Управление порядком и смещениями колонок:
  - `.rg-order-0` … `.rg-order-12` и responsive-варианты `.rg-order-{sm,md,lg,xl,2xl}-N`;
  - `.rg-offset-0` … `.rg-offset-11` и responsive-варианты `.rg-offset-{sm,md,lg,xl,2xl}-N`.
- Токены gutter'ов сетки:
  - `--rarog-grid-gap-x`, `--rarog-grid-gap-y` в `tokens/_grid.css`.
- Варианты контейнеров:
  - `.rg-container-sm` и `.rg-container-lg` с фиксированными `max-width` на основе брейкпоинтов;
  - утилита `.rg-container-nopad` для контейнера без горизонтальных отступов.
- Новый модуль утилит сетки `packages/utilities/src/_grid.css` и обновлённый вход `rarog-utilities.css`.

### Изменено
- `.grid-2`, `.grid-3`, `.grid-4` помечены как legacy-хелперы (сохранены для обратной совместимости, предпочтительно использовать `.rg-row`/`.rg-col`).


## [1.1.0] - 2025-12-26

### Добавлено
- Токены брейкпоинтов в ядре (`--rarog-breakpoint-sm`, `md`, `lg`, `xl`, `2xl`) с рекомендуемыми значениями 640 / 768 / 1024 / 1280 / 1536 px.
- Базовый набор responsive-утилит с префиксами `sm:`, `md:`, `lg:`, `xl:` и `2xl:` для:
  - display (`d-block`, `d-inline`, `d-inline-block`, `d-flex`, `d-inline-flex`, `d-grid`, `d-none`),
  - направления flex (`flex-row`, `flex-column`),
  - выравнивания (`justify-*`, `items-*`),
  - выравнивания текста (`text-left`, `text-center`, `text-right`),
  - базовых отступов (`mt-1..4`, `mb-1..4`, `p-2..4`).
- State-утилиты для псевдоклассов `:hover` и `:focus`:
  - `hover:bg-primary`, `hover:text-primary`, `hover:underline`,
  - `focus:border-primary`.
- Служебные утилиты:
  - `d-none` в layout-слое,
  - overflow-классы (`overflow-hidden`, `overflow-auto`, `overflow-x-*`, `overflow-y-*`),
  - утилиты доступности `.sr-only` и `.sr-only-focusable`.

### Изменено
- Обновлён сборочный вход `rarog-utilities.css` для подключения новых файлов утилит.
- Обновлён core-вход `rarog-core.css` с импортом токенов брейкпоинтов.


Все заметные изменения в этом проекте будут документироваться в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2025-12-11

### Добавлено
- Базовое ядро Rarog Core с дизайн‑токенами (цвета, отступы, радиусы, тени, типографика).
- Utility‑слой для layout, spacing, цвета, типографики и размеров.
- Компонентный слой с базовыми компонентами: кнопки, карточки, контейнер.
- Базовые темы: светлая (default) и тёмная (dark).
- Структура монорепозитория `packages/*`.
- Документация (черновик) и демо‑страницы.
- Конфигурация сборки и npm‑скрипты.
- Шаблоны GitHub Issue и Pull Request.
