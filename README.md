# Rarog

**Rarog — лёгкая, современная и модульная CSS‑система для создания красивых и доступных интерфейсов.**

[![Build Status](https://img.shields.io/github/actions/workflow/status/TheSkiF4er/rarog/.github/workflows/ci.yml?branch=main)](https://github.com/TheSkiF4er/rarog/actions)
[![npm version](https://img.shields.io/npm/v/@rarog/core?label=%40rarog%2Fcore)](https://www.npmjs.com/package/@rarog/core)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

Rarog — это **элементно-ориентированный CSS-фреймворк**, основанный на идее, что интерфейс должен собираться как "поток взаимодействующих сил", а не просто набор классов или компонентов.

---

## Коротко

Rarog сочетает удобство классических UI‑фреймворков (готовые компоненты, шаблоны) с гибкостью утилитарных подходов (настройка токенов, утилиты пространства). Проект спроектирован для производительности, модульности и удобства интеграции с любым фронтенд‑стеком (vanilla, React, Vue, Svelte).

Ключевые принципы:

* **Модульность:** минимальное ядро + набор опциональных компонентов.
* **Токены:** тема на основе CSS‑переменных (цвета, spacing, radius, shadows).
* **A11Y:** компоненты с учётом ARIA и WCAG рекомендаций.
* **Интеграция:** лёгкая обёртка для React и vanilla‑JS helpers.
* **Инструменты:** CLI, theme generator, сборка с tree‑shaking.

---

## Кому полезен

* Командам SaaS и продуктам, которым нужна нейтральная, настраиваемая UI‑система.
* Стартапам и прототипам, где важна скорость разработки.
* Проектам, которым требуется доступная и легко брендуемая дизайн‑система.

---

## Быстрый старт

### CDN (самый быстрый способ попробовать)

```html
<link rel="stylesheet" href="https://cdn.example.com/rarog/latest/rarog.min.css">
```

### npm / pnpm

```bash
pnpm add @rarog/core
# или
npm install @rarog/core
```

Обычный импорт в проект:

```css
@import "@rarog/core/dist/rarog.css";
```

### Пример: кнопка

```html
<button class="r-btn r-btn--primary u-px-4 u-py-2">Сохранить</button>
```

---

## Структура пакета

Монорепо организовано по пакетам (pnpm workspaces):

* `packages/core` — CSS‑ядро (tokens, utilities, компоненты).
* `packages/js` — vanilla JS helpers (modal, dropdown, focus trap).
* `packages/react` — React wrapper (опционально).
* `docs` — документация (Docusaurus).
* `infra` — инфраструктура для деплоя и CI/CD.

---

## Конфиг и темизация

Тема задаётся в `rarog.config.js`, пример:

```js
module.exports = {
  name: 'rarog',
  version: '0.1.0',
  theme: {
    colors: { primary: '30 120 255', bg: '255 255 255' },
    spacing: [0,4,8,12,16,20],
    radius: { sm: '6px', md: '12px' }
  }
}
```

Сборщик/CLI `generate-theme.js` генерирует CSS‑переменные и JSON‑токены по конфигу.

---

## Документация и примеры

Полная документация, примеры и live playground находятся в `docs/`.

Запуск локально:

```bash
pnpm install
pnpm --filter docs dev
```

---

## Компоненты (основные)

* `r-btn` — кнопки: primary, secondary, ghost, loading state
* `r-input`, `r-select`, `r-textarea` — элементы форм
* `r-card` — карточки с actions
* `r-modal` — модальные окна с focus trap
* `r-dropdown`, `r-toast`, `r-nav`, `r-table`, `r-tabs`, `r-accordion`

Каждый компонент:

* семантическая разметка
* ARIA‑атрибуты
* минимальный vanilla‑JS для интерактивности
* опциональные wrappers для React/Vue

---

## Интеграция с React

Пример использования `@rarog/react`:

```jsx
import { Button } from '@rarog/react';

export default function Demo() {
  return <Button variant="primary">Сохранить</Button>
}
```

---

## CI / Release / DevFlow

* CI: GitHub Actions — lint, typecheck, build, тесты, security scans, a11y. (см. `.github/workflows/ci.yml`)
* Релизы: `semantic-release` для автоматического bump версии, changelog и публикации пакетов.
* Пакеты публикуются в npm под scope `@rarog/*`.
* Документация деплоится в GitHub Pages (или S3+CloudFront).

---

## Вклад и вкладчики

См. `CONTRIBUTING.md` для правил взноса, шаблонов issue/PR и требований к тестам.

Кодекс поведения — `CODE_OF_CONDUCT.md`.

Как сообщать о проблемах безопасности — `SECURITY.md`.

---

## Лицензия

Проект распространяется под лицензией **Apache‑2.0**. Полный текст лицензии — в файле `LICENSE`.

---

## Контакты

Автор: **TheSkiF4er**

Если хотите поддержать проект — смотрите `.github/FUNDING.yml`.
