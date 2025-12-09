# @rarog/js — Vanilla JS утилиты для Rarog

**Кратко:** это компактная, zero‑deps библиотека утилит для фронтенд‑части Rarog: accessible Dropdown, Modal, FocusTrap и вспомогательные функции (инициализация по атрибутам, helpers для ARIA и delegation). Пакет предназначен для progressive enhancement — лёгкая интеграция в любые проекты (vanilla, серверный рендеринг, микрофронтенды).

Автор: TheSkiF4er · Лицензия: Apache‑2.0

---

## Почему использовать @rarog/js

* Никаких внешних зависимостей — чистый TypeScript/JS и минимальный runtime.
* A11Y‑ориентированный API: aria‑атрибуты, focus trapping, keyboard support.
* Малый размер и предсказуемое поведение — удобно для встраивания в design systems.
* Подходит для monorepo (pnpm workspaces) и standalone установки через npm/pnpm.

---

## Быстрая установка

```bash
pnpm add @rarog/js
# или
npm install @rarog/js
```

В браузере (ESM):

```html
<script type="module">
  import Rarog from '/node_modules/@rarog/js/dist/index.esm.js';
  // или
  import { initDropdowns, initModals } from '/node_modules/@rarog/js/dist/index.esm.js';
</script>
```

---

## API — основные сущности

> Полная типизация доступна в `dist/index.d.ts`.

### initDropdowns(root = document)

Автоматически инициализирует все дропдауны по атрибутам `data-rarog-dropdown-trigger`.
Возвращает массив созданных экземпляров `Dropdown`.

**Пример использования:**

```html
<button data-rarog-dropdown-trigger data-rarog-dropdown-panel="#menu">Menu</button>
<div id="menu" role="menu" style="display:none">...</div>
<script type="module">
  import { initDropdowns } from '@rarog/js';
  initDropdowns();
</script>
```

### initModals(root = document)

Инициализирует все модальные окна на странице по атрибуту `data-rarog-modal`. Возвращает массив `Modal`.

**Пример:**

```html
<div data-rarog-modal id="myModal"> ... <button data-rarog-close>Close</button></div>
<script type="module">
  import { initModals } from '@rarog/js';
  initModals();
</script>
```

### Dropdown (class)

Конструктор: `new Dropdown({ trigger, panel, autoClose = true, focusTrap = false, returnFocus = true })`.

Методы:

* `openDropdown()` — открыть
* `closeDropdown()` — закрыть
* `toggle()` — переключить
* `destroy()` — удалить все слушатели

Особенности:

* Устанавливает `aria-controls`, `aria-haspopup`, `aria-expanded`.
* Простая позиционирующая логика (absolute) — для сложного позиционирования используйте Popper и передайте свои стили/логику.

### Modal (class)

Конструктор: `new Modal({ modal, openClass, backdrop, closeOnEsc, closeOnBackdrop, preventScroll, returnFocus })`.

Методы:

* `open()` / `close()` / `toggle()` / `destroy()`.

Особенности:

* focus‑trap, возврат фокуса на элемент открытия, блокировка прокрутки (preventScroll), опциональный backdrop.
* Генерирует события `rarog:open` и `rarog:close` на DOM‑элементе модала.

### Утилиты

* `uid(prefix)` — уникальный id.
* `on(root, event, selector|handler, handler?)` — event delegation helper.
* ARIA helpers: `setAriaExpanded`, `attr` и др.

---

## Атрибутная интеграция (progressive enhancement)

Библиотека поддерживает простую интеграцию через `data-*` атрибуты, поэтому HTML можно писать как статичный markup, а затем улучшать поведение при подключении скрипта:

* `data-rarog-dropdown-trigger` + `data-rarog-dropdown-panel="#id"`
* `data-rarog-modal` — пометить элемент как модал
* `data-rarog-close` — кнопка внутри модала/панели для закрытия

---

## Примеры

**Dropdown — простой:**

```html
<button data-rarog-dropdown-trigger data-rarog-dropdown-panel="#menu">Open</button>
<ul id="menu" role="menu" style="display:none">
  <li role="menuitem">Item 1</li>
  <li role="menuitem">Item 2</li>
</ul>
<script type="module">
  import { initDropdowns } from '@rarog/js';
  initDropdowns();
</script>
```

**Modal — вызов из JS:**

```js
import { Modal } from '@rarog/js';
const el = document.getElementById('myModal');
const modal = new Modal({ modal: el });
document.getElementById('openBtn').addEventListener('click', () => modal.open());
```

---

## Тесты и CI

* Тесты написаны на `vitest`.
* CI workflow собирает, запускает линтеры и тесты (см. `.github/workflows/ci.yml` в корне проекта).

Команды локально (в пакете):

```bash
pnpm install
pnpm run build
pnpm run test
pnpm run lint
```

---

## Сборка и публикация

Проект содержит конфигурации TypeScript для сборки CJS/ESM и типов. Скрипты в `package.json`:

* `build` — собрать `dist/` (cjs, esm, types)
* `prepublishOnly` — гарантирует сборку и тесты перед публикацией

---

## Вклад

Пожалуйста, следуйте `CONTRIBUTING.md` в корне репозитория. Для изменения API — откройте issue с обсуждением дизайна и обратной совместимости.

---

## Лицензия

Apache‑2.0 — см. файл `LICENSE` в корне репозитория.
