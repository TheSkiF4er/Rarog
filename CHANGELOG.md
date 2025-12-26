# Changelog

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
