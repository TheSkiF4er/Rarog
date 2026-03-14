# Набор макетов «Рарог» для Figma (3.3.0)

Этот каталог описывает структуру официального Figma‑набора для Рарог.

## Состав Design Kit

- **Foundations**
 - Цвета (палитры + semantic‑токены)
 - Типографика (шкалы кеглей, line‑height, веса)
 - Spacing (шкала отступов)
 - Radius (радиусы скругления)
 - Shadow (типы теней)

- **Компоненты**
 - Buttons (Основной / Дополнительный / outline / ghost, размеры sm/md/lg)
 - Inputs / Текстareas / Selects / Combobox / Tags input
 - Cards / Panels / Alerts / Badges / Toasts
 - Верхняя панель / Боковая колонка / Tabs / Breadcrumbs / Pagination
 - Модальное окноs / Drawers (Боковая панель) / Steppers / Carousel
 - Tables (включая data‑table паттерн с toolbar)

- **Компоновка‑паттерны**
 - Двухколоночный Компоновка (боковая колонка + content)
 - Панель (боковая колонка + topbar + cards + таблицы)
 - Marketing landing (hero + features + тарифы + CTA)
 - SaaS‑Компоновка (auth, Настройки, Расчёты)

## Связь с токенами

Figma‑kit использует те же токены, что и кодовый слой:

- `rarog.tokens.json` — основной источник правды по токенам;
- `design/figma.tokens.json` — адаптация под Tokens Studio / Figma Design Tokens.

Рекомендуемый flow:

1. Импортировать `design/figma.tokens.json` в Tokens Studio.
2. Привязать цветов/типографику/spacing к стилям Figma.
3. Использовать эти стили в компонентах Design Kit.
4. При изменении токенов в `rarog.config.*` → пересобрать `rarog.tokens.json`
 и `design/figma.tokens.json` и выполнить обновление в Tokens Studio.

## Темы

Начиная с 3.3.0, Рарог поддерживает набор преднастроенных тем:

- `default` — базовая тема фреймворка;
- `dark` — тёмная тема;
- `contrast` — повышенный контраст;
- `enterprise` — спокойная B2B‑палитра;
- `creative` — более «живой» набор для маркетинга/side‑проектов.

Для каждой темы можно завести отдельную Figma‑страницу или использовать
theme‑поддержку Tokens Studio (brand/theme tokens), импортируя соответствующие
моды из `design/figma.tokens.json`.
