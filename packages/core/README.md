# @rarog/core — ядро дизайна Rarog

**Кратко:** `@rarog/core` — это набор токенов, утилит и базовых компонентов CSS, реализующих концепцию *Dual Token Grid* (Force + Skin). Пакет содержит всё необходимое, чтобы быстро интегрировать визуальную систему Rarog в проекты: переменные (tokens), утилиты для spacing/density, готовые компоненты (btn, card, modal) и точки расширения для генерации тем.

Автор: **TheSkiF4er** · Лицензия: **Apache‑2.0**

---

## Цели пакета

* Предоставить стабильный, предсказуемый базовый набор CSS‑токенов и переменных.
* Дать возможности для быстрой темы‑фикации (generate-theme) и поддержки light/dark пресетов.
* Снизить порог входа: простая интеграция в monorepo и standalone‑проекты.
* Обеспечить высокое качество доступности и UX‑поведения (focus states, reduced motion).

---

## Ключевые концепции

### Dual Token Grid

* **Force tokens** — задают поведение и «характер» интерфейса: плотность (`--force-dens-*`), импульс (`--force-imp-*`), масса, напряжение.
* **Skin tokens** — визуальные токены: цвета (`--tone-*`), глубина (`--depth-*`), свечение (`--glow-*`), радиусы, spacing.

Это позволяет быстро менять не только цвета, но и «характер» UI одной переменной.

---

## Что внутри

```
packages/core/
├─ src/
│  ├─ tokens/index.scss
│  ├─ utilities/spacing.scss
│  ├─ components/btn.scss
│  ├─ components/card.scss
│  ├─ components/modal.scss
│  └─ index.scss
├─ rarog.config.js
├─ README.md
└─ package.json
```

* `tokens/index.scss` — основной набор CSS‑переменных (рекомендуется генерировать в production).
* `utilities/` — spacing, flow, helper‑классы и responsive‑утилиты.
* `components/` — готовые стили для кнопок, карточек и модальных окон (семантика, a11y, density).
* `index.scss` — точка входа для сборки CSS ядра.

---

## Быстрая установка

**В монорепо (pnpm):**

```bash
pnpm add -w @rarog/core
```

**В отдельный проект:**

```bash
npm install @rarog/core
# затем подключите CSS (например в entry point вашего приложения)
import '@rarog/core/dist/rarog.css';
```

---

## Quick start (локально)

1. Установите зависимости и соберите CSS:

```bash
pnpm install
pnpm --filter @rarog/core run build
```

2. Подключите `dist/rarog.css` в приложение или сборщик.

3. Используйте семантические классы:

```html
<button class="r-btn btn-primary btn-size-md dens-2">Сохранить</button>
<div class="r-card">...</div>
```

---

## Темизация и генерация токенов

* Основной конфиг: `packages/core/rarog.config.js`. Он содержит dual token grid, пресеты компонентов и настройки генератора тем.
* Скрипт `scripts/generate-theme.js` (в корне) может читать `rarog.config.js` и генерировать `rarog.theme.css` и `rarog.theme.json`.
* Рекомендуемый порядок подключения CSS в приложении:

  1. `@rarog/core/dist/rarog.css` (ядро)
  2. `rarog.theme.css` (сгенерированные переменные — переопределяют токены)

Это позволяет переключать темы без пересборки компонентов.

---

## Компоненты и утилиты

* **r-btn**: доступная кнопка с состоянием `loading`, несколькими вариантами (primary, secondary, ghost, danger, link), размерами и density.
* **r-card**: семантическая карточка с header/body/footer, вариантами elevation и density.
* **r-modal**: модальное окно с backdrop, focus‑trap подсветкой и variant sizes.
* **utilities/spacing.scss**: система отступов, `r-stack`, `r-flow`, классы `u-p-*`, `u-m-*` и responsive префиксы (sm:/md:/lg:).

Каждый компонент реализует ARIA‑практики и имеет CSS‑hook’и для JS‑повышения интерактивности (data-атрибуты).

---

## Сборка и CI

* Основной процесс сборки CSS использует `sass` + `postcss`:

  * `npm run build` — соберёт `dist/rarog.css`, выполнит PostCSS и минификацию.
  * `npm run dev` — watch для быстрого локального тестирования.
* В CI рекомендуется запускать: `lint:scss`, `build` и visual regression tests (по желанию).

Примерный pipeline: lint → build → test → publish

---

## Рекомендации по интеграции

* Рендерьте UI‑компоненты (React/Vue) без встраивания стилей — подключайте `@rarog/core` глобально и управляйте темой через переменные.
* Для сложного позиционирования (поповеры) рекомендуется использовать Popper.js и применять классы Rarog для стилей.
* Для производительности: генерируйте `rarog.theme.css` с минимальным набором переменных для конкретного бренда и подключайте его поверх `rarog.css`.

---

## Вклад и разработка

Пожалуйста, руководствуйтесь `CONTRIBUTING.md` в корне репозитория. Вклады принимаются через PR с:

* описанием изменения и мотивации;
* тестами/визуальными примерами (если меняются компоненты);
* соответствием lint/prettier правилам.

Для локальной работы с пакетом:

```bash
pnpm -w install
pnpm --filter @rarog/core dev
```

---

## Полезные ссылки

* `rarog.config.js` — конфиг токенов и тем (в `packages/core`)
* `src/index.scss` — точка входа CSS
* `dist/` — собранные артефакты после `npm run build`

---

## Лицензия

Apache‑2.0 — см. файл `LICENSE` в корне репозитория.
