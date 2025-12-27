# Rarog Figma Design Kit (3.3.0)

Этот каталог описывает структуру официального Figma‑набора для Rarog.

## Состав Design Kit

- **Foundations**
  - Цвета (палитры + semantic‑токены)
  - Типографика (шкалы кеглей, line‑height, веса)
  - Spacing (шкала отступов)
  - Radius (радиусы скругления)
  - Shadow (типы теней)

- **Компоненты**
  - Buttons (primary / secondary / outline / ghost, размеры sm/md/lg)
  - Inputs / Textareas / Selects / Combobox / Tags input
  - Cards / Panels / Alerts / Badges / Toasts
  - Navbar / Sidebar / Tabs / Breadcrumbs / Pagination
  - Modals / Drawers (Offcanvas) / Steppers / Carousel
  - Tables (включая data‑table паттерн с toolbar)

- **Layout‑паттерны**
  - Двухколоночный layout (sidebar + content)
  - Dashboard (sidebar + topbar + cards + таблицы)
  - Marketing landing (hero + features + pricing + CTA)
  - SaaS‑layout (auth, settings, billing)

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

Начиная с 3.3.0, Rarog поддерживает набор преднастроенных тем:

- `default` — базовая тема фреймворка;
- `dark` — тёмная тема;
- `contrast` — повышенный контраст;
- `enterprise` — спокойная B2B‑палитра;
- `creative` — более «живой» набор для маркетинга/side‑проектов.

Для каждой темы можно завести отдельную Figma‑страницу или использовать
theme‑поддержку Tokens Studio (brand/theme tokens), импортируя соответствующие
моды из `design/figma.tokens.json`.
