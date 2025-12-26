# Changelog

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
