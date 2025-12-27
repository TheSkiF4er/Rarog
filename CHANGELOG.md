# Changelog







## [2.8.0] - 2025-12-27

### Добавлено
- Accessibility & Internationalization:
  - новая страница **Accessibility** с чек-листом по ключевым компонентам и примерами доступных форм;
  - расширенные a11y-утилиты: `not-sr-only`, `focus-ring`, `focus-outline-none`, `motion-safe:animate-*`;
  - обновлённые рекомендации по доступности компонентов в разделе **Components**.
- EN-документация (MVP):
  - базовые страницы `/en/` (Getting Started, Why Rarog, Tokens, Utilities);
  - англоязычные React и Laravel guides (`/en/guide-react`, `/en/guide-laravel`);
  - переключатель языка (RU → EN) в навигации docs-сайта.

### Изменено
- Версия фреймворка обновлена до `2.8.0`.
- README дополнен ссылками на английскую документацию.

## [2.7.0] - 2025-12-27

### Добавлено
- Components v3 & JS Core v3:
  - Carousel / Slider: `.carousel`, `.carousel-item`, `.carousel-control-prev/next`, `.carousel-indicators` + JS-API `Rarog.Carousel.getOrCreate(el)`, autoplay и swipes (MVP);
  - Stepper / Wizard: `.stepper`, `.stepper-step`, `.stepper-content` + JS-API `Rarog.Stepper.getOrCreate(el)` и события `rg:stepper:*`;
  - Advanced Navbar & Offcanvas: sticky navbar-паттерн, улучшенные position-варианты для offcanvas;
  - Data-heavy patterns: `table-toolbar` и admin-таблицы.
- JS Core v3:
  - единый EventBus (`Rarog.Events`) для всех `rg:*` событий;
  - lifecycle-API: `Rarog.init`, `Rarog.dispose`, `Rarog.reinit` для SPA/SSR-сценариев;
  - debug-режим через глобальные флаги `window.RAROG_DEBUG` / `RAROG_DEV`.

### Изменено
- Обновлён разделы **Components**, **JavaScript** и **Cookbook**:
  - примеры carousel/landing, stepper-wizard, data-heavy admin layout.
- Версия фреймворка обновлена до `2.7.0`.

## [2.6.0] - 2025-12-27

### Добавлено
- Utilities v3 & Advanced Effects:
  - filter-утилиты: `blur-*`, `brightness-*`, `contrast-*`, `grayscale`, `invert`, `sepia`;
  - backdrop-фильтры: `backdrop-blur-*`;
  - blend-режимы: `mix-blend-*`, `bg-blend-*`.
- Scroll & overscroll:
  - `overscroll-auto/contain/none`;
  - `scroll-auto`, `scroll-smooth`;
  - anchor-offset-утилиты: `scroll-mt-*`, `scroll-pb-*`.
- Scroll snap:
  - `snap-x`, `snap-y`, `snap-both`, `snap-none`;
  - `snap-start`, `snap-center`, `snap-end`.
- Multi-column helpers:
  - `columns-2`, `columns-3`, `columns-4` для текстового layout.
- Print utilities:
  - `print:hidden`, `print:block`, `print:inline`, `print:flex`.
- RTL / logical spacing:
  - `ms-*`, `me-*` на `margin-inline-*`;
  - `ps-*`, `pe-*` на `padding-inline-*`.

### Изменено
- Обновлён раздел **Utilities** в документации:
  - отдельные секции Effects & Filters, Scroll & Overscroll, Scroll Snap, Multi-column, Print, RTL.
- Версия фреймворка обновлена до `2.6.0`.


## [2.5.0] - 2025-12-27

### Добавлено
- Раздел **Cookbook & Patterns**:
  - layout‑паттерны (двухколоночный layout, sidebar + content, dashboard, landing);
  - UI‑паттерны (модалки, alerts/notifications, формы).
- Отдельные **Guides под стеки**:
  - `guide-laravel` — подробный Laravel Guide;
  - `guide-react` — React + Vite;
  - `guide-vue`, `guide-nextjs`, `guide-cajeer-stack`.
- Страница **Why Rarog**:
  - позиционирование как альтернатива Tailwind + Bootstrap;
  - таблица сравнения по tokens/utilities/components/JS/JIT/DX.
- Страница **Performance & Bundle Size**:
  - описание full vs JIT;
  - рекомендации по оптимизации `content`, arbitrary values и тем.
- Страница **Branding**:
  - мини‑брендбук (название, тэглайн, цвета, tone of voice).

### Изменено
- Обновлён VitePress‑navigation:
  - добавлены разделы Cookbook, Guides, Why Rarog, Performance, Branding.
- Версия фреймворка обновлена до `2.5.0`.


## [2.4.0] - 2025-12-27

### Добавлено
- VSCode extension (alpha) в `tools/vscode-rarog`:
  - автодополнение классов Rarog на основе словаря;
  - hover-доки по классам.
- Скрипт генерации словаря классов:
  - `tools/generate-class-dictionary.mjs` → `tools/vscode-rarog/rarog-classmap.json`.
- Plugin API v1:
  - `plugins` в `rarog.config.*` теперь принимает RarogPlugin (функция или строка-путь);
  - CLI вызывает плагины в JIT-режиме и подключает их CSS к `dist/rarog.jit.css`.
- Официальные плагины:
  - `packages/plugin-forms` — утилиты и улучшения для форм;
  - `packages/plugin-typography` — `.prose` и расширенный типографический слой.
- Экспорт токенов для Figma:
  - `design/figma.tokens.json` — JSON-формат, совместимый с Tokens Studio / Design Tokens tooling.

### Изменено
- Документация:
  - добавлена страница **IDE & Plugins**;
  - в разделе **Tokens** добавлена секция про Figma-интеграцию.
- Версия фреймворка обновлена до `2.4.0`.

## [2.3.0] - 2025-12-27

### Добавлено
- Variant-префиксы:
  - `group-hover:*` (через контейнер `.group` + дочерние классы `group-hover:...`);
  - `peer-checked:*` / `peer-focus:*` (на базе `.peer` + соседние элементы);
  - `data-[state=open]:*` для простых data-состояний.
- JIT arbitrary values v2:
  - поддержка `rounded-[...]`, `shadow-[...]`, `gap-[...]`, `border-[...]`;
  - простая валидация значений для защиты от CSS-инъекций.
- JIT v2:
  - поиск классов не только в `class="..."`, но и в `className`, `element.classList.add(...)`,
    а также в вызовах `clsx(...)` / `cx(...)` / `classnames(...)`.
- Официальный Vite-плагин (`tools/vite-plugin-rarog.js`), интегрированный в starter
  `examples/starters/vite-react`.

### Изменено
- Обновлена документация:
  - новый раздел **Variants & JIT**;
  - расширен раздел **Integration Guides** (Vite-плагин, рекомендации для Webpack).
- Версии пакета и токенов обновлены до `2.3.0`.

## [2.2.0] - 2025-12-27

### Добавлено
- Компонент `Navbar` с примером responsive-хедера и интеграцией с Offcanvas.
- Новый компонент `Offcanvas` (`.offcanvas`, `.offcanvas-end`, `.offcanvas-bottom`) с JS-ядром:
  открытие/закрытие, backdrop, блокировка скролла `body`, ARIA-атрибуты.
- Компонент `Toast` (`.toast`, `.toast-header`, `.toast-body`) с JS-API и auto-hide.
- Компоненты `Tooltip` и `Popover`:
  инициализация по `data-rg-toggle="tooltip|popover"`, упрощённое позиционирование и ARIA.
- Таблицы v2 (`.table`, `.table-striped`, `.table-hover`, `.table-bordered`, `.table-responsive`).
- Forms v2:
  `input-group`, `form-floating` (floating labels), CSS-валидация (`.is-valid`, `.is-invalid`,
  `.valid-feedback`, `.invalid-feedback`).
- Расширен JS Core:
  новые классы `Offcanvas`, `Toast`, `Tooltip`, `Popover`, единый Data-API и event API
  (`rg:modal:show/hide`, `rg:dropdown:show/hide`, `rg:collapse:show/hide`, `rg:offcanvas:*`,
  `rg:toast:*`, `rg:tooltip:*`, `rg:popover:*`).

### Изменено
- Обновлена документация:
  - раздел **Components** дополнен примерами Navbar + Offcanvas, Tables v2, Forms v2, Toasts, Tooltips/Popovers;
  - раздел **JavaScript** описывает полный список компонентов JS, Data-API и события.
- Пример `examples/starters/html-basic` обновлён: добавлены Navbar и Offcanvas на главной странице.
- Версия пакета и токенов обновлена до `2.2.0`.

## [2.1.0] - 2025-12-27

### Добавлено
- Новый partial `_position.css` с утилитами позиционирования и z-слоя:
  - `relative`, `absolute`, `fixed`, `sticky`;
  - `top-0/1/2/full`, `right-*`, `bottom-*`, `left-*`;
  - `z-0/10/20/30/40/50`, `z-auto`.
- Расширенный `_sizing.css`:
  - фракции ширины и высоты (`w-1/2`, `w-1/3`, `w-2/3`, `h-1/2`, `h-1/3`, `h-2/3`);
  - `w-full`, `w-screen`, `h-full`, `h-screen`;
  - min/max-утилиты (`min-w-full`, `max-w-full`, `min-h-full`, `max-h-full`);
  - aspect ratio (`aspect-video`, `aspect-square`).
- Новый partial `_effects.css`:
  - скругления (`rounded-none/sm/md/lg/full`);
  - тени (`shadow-none/xs/sm/md/lg/xl/2xl`);
  - границы (`border`, `border-0`, `border-t/b/l/r`, `border-*` по semantic-цветам);
  - transitions (`transition*`, `duration-*`, `ease-*`) и анимации (`animate-spin`, `animate-pulse`).
- Расширен `_typography.css`:
  - размеры текста (`text-xs` … `text-4xl`);
  - веса (`font-normal`, `font-medium`, `font-semibold`, `font-bold`);
  - line-height (`leading-none` … `leading-loose`).
- Обновлён раздел **Utilities** в VitePress-документации и добавлен примерный блок в `docs/index.html`.

### Изменено
- Расширен JIT-фильтр `isRarogClass`:
  - добавлена поддержка новых префиксов (`relative/absolute`, `top-*`, `z-*`, `aspect-*`, `rounded*`, `shadow-*`,
    `border*`, `transition*`, `duration-*`, `ease-*`, `animate-*`, `font-*`, `leading-*`), чтобы новые утилиты
    корректно попадали в JIT-сборку.
- Версии пакетов и токенов обновлены до `2.1.0`.

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
