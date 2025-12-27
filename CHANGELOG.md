# Changelog






## [2.0.0] - 2025-12-27

### Добавлено
- Раздел **API Reference** в docs-сайте, фиксирующий список поддерживаемых утилит, компонентов и JS-API ветки 2.x.
- Разделы **Migration 1.x → 2.x** и **Versioning & Support**:
  - описаны правила миграции (в т.ч. отказ от legacy-классов `.grid-2`, `.grid-3`, `.grid-4`);
  - задокументирована политика семантического версионирования и поддержки 2.x.
- Обновлён README:
  - позиционирование Rarog как альтернативы связке Tailwind CSS + Bootstrap;
  - акцент на связке design tokens + utilities + components + JS core;
  - упоминание интеграции с Cajeer-экосистемой и сторонними стекками.

### Изменено
- Удалены legacy helper-классы `.grid-2`, `.grid-3`, `.grid-4` из layout-утилит (заменены на сетку `.rg-row`/`.rg-col-*`).
- Классический HTML-документационный файл (`docs/index.html`) обновлён с учётом удаления legacy-классов и новой ветки 2.x.
- Версия пакета, токенов и конфигов обновлена до 2.0.0.

## [1.8.0] - 2025-12-27

### Добавлено
- Docs v2 на базе VitePress:
  - отдельный docs-сайт с разделами: Getting Started, Tokens, Utilities, Components, JavaScript, Theming, Integration Guides, Playground;
  - конфигурация в `docs-site/.vitepress/config.ts` с базовым путём `/rarog/` (готово к деплою, например, на `https://docs.cajeer.ru/rarog`).
- Примерные проекты (starters) в директории `examples/starters`:
  - `html-basic` — чистый HTML starter с подключением Rarog из `dist/` и демонстрацией сетки, карточек, alerts и модалки;
  - `laravel` — базовый гайд по интеграции Rarog в Laravel-проект с использованием JIT-режима;
  - `vite-react` — Vite + React starter с подключением Rarog и стартовым макетом.
- Встроенный Playground:
  - страница `Playground` в docs-сайте с iframe на CodeSandbox и инструкцией по локальному playground на базе Vite + React starter.

### Изменено
- README дополнен ссылками на docs-сайт и директорию с примерами.
- Версия пакета и конфигов обновлена до 1.8.0.

## [1.7.0] - 2025-12-27

### Добавлено
- Режим сборки `mode: "jit"` в `rarog.config.js/ts` и поддержка массива `content` для указания путей к файлам проекта.
- Поддержка JIT / tree-shaking в CLI (`rarog build`):
  - анализ классов в файлах по паттернам `./resources/**/*.{html,php,js,jsx,ts,tsx,vue}`;
  - генерация урезанного CSS `dist/rarog.jit.css` только с используемыми утилитами и компонентами;
  - сохранение дизайн-токенов в JIT-сборке (цвета, spacing, radius, shadow, breakpoints).
- Базовая поддержка произвольных значений (arbitrary values) по Tailwind‑подобному синтаксису:
  - размеры: `w-[...]`, `h-[...]`;
  - цвета: `bg-[...]`, `text-[...]`.
- Расширенная документация:
  - раздел «Build modes» с описанием режимов `full` и `jit`;
  - раздел «Arbitrary values» с примерами использования произвольных значений.

## [1.6.0] - 2025-12-27

### Добавлено
- Новый формат конфига `rarog.config.js/ts`:
  - секция `theme` (цвета, spacing, radius, shadow);
  - секция `screens` для управления брейкпоинтами;
  - секция `extend` для расширения токенов без перезаписи базовых значений;
  - поле `plugins` как задел под будущие расширения.
- Rarog CLI (`rarog`):
  - команда `rarog build` — пересборка CSS-токенов и `rarog.tokens.json` из конфига;
  - команда `rarog init` — генерация стартового `rarog.config.js/ts` и примера проекта (`examples/starter`);
  - команда `rarog docs` — обёртка над `node tools/docs-dev.mjs` для локального просмотра документации.
- Связка config → tokens:
  - генерация файлов `packages/core/src/tokens/_color.css`, `_spacing.css`, `_radius.css`, `_shadow.css`, `_breakpoints.css` на основе `rarog.config.js`;
  - обновление `rarog.tokens.json` как единого JSON-представления токенов.

### Изменено
- Версия пакета и внутренних конфигов обновлена до 1.6.0.
- Документация дополнена разделом "Config & CLI" с примерами использования `rarog.config.*` и команды `rarog`.
- Добавлен регрессионный тест `tests/rarog-build-regress.test.mjs`, проверяющий, что дефолтная сборка токенов совпадает с текущими файлами 1.5.x.

## [1.5.0] - 2025-12-27

### Добавлено
- JS Core v1 для интерактивных компонентов без jQuery:
  - единый бандл `rarog.js` (UMD) и модульная версия `rarog.esm.js` (ESM);
  - классы `Rarog.Dropdown`, `Rarog.Collapse`, `Rarog.Modal`.
- Data-API:
  - атрибуты `data-rg-toggle="dropdown|collapse|modal"`, `data-rg-target="#id"`;
  - поддержка закрытия модалки через `data-rg-dismiss="modal"`.
- Базовая доступность (a11y):
  - автоматическая установка ARIA-атрибутов для dropdown/collapse/modal;
  - фокус-ловушка и закрытие по ESC для модальных окон;
  - навигация по пунктам dropdown с помощью стрелок.
- Минимальная CSS-поддержка для интерактивных компонентов:
  - базовые стили для `.dropdown`, `.dropdown-menu`, `.collapse`, `.modal`, `.modal-dialog` и т.д.
- Простые браузерные тесты:
  - файл `tests/rarog-js-core.test.html` с проверкой базового поведения dropdown, collapse и modal.
- Документация:
  - раздел "JavaScript" в `docs/index.html` с примерами Data-API и JS-API.

### Изменено
- Обновлены версии пакетов и заголовки сборочных файлов до 1.5.0.


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
