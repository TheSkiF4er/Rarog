# @rarog/react — React-компоненты Rarog

**Кратко:** `@rarog/react` предоставляет легкие, доступные (a11y-first) React-обёртки для UI-элементов Rarog: кнопки, модальные окна и утилиты для простого интегрирования дизайн‑системы Rarog в React‑приложения.

Автор: **TheSkiF4er** · Лицензия: **Apache‑2.0**

---

## Цели пакета

* Предоставить маленький набор высококачественных, типизированных React‑компонентов (Button, Modal и пр.).
* Сохранить zero-runtime-подход для CSS: стили рендерятся через классы Rarog, тема контролируется через CSS‑переменные.
* Обеспечить доступность (keyboard, aria, focus management) «из коробки».
* Поддержать SSR/SSG, гибкую кастомизацию и легкость встраивания в существующие проекты.

---

## Установка

```bash
pnpm add @rarog/react
# или
npm install @rarog/react
```

Обязательно установить peer‑зависимости в проекте:

```bash
pnpm add react react-dom
```

Подключите CSS ядро Rarog (например, `@rarog/core/dist/rarog.css`) в ваш проект, чтобы компоненты корректно отображались:

```js
import '@rarog/core/dist/rarog.css';
import '@rarog/react';
```

---

## Quick Start — минимальный пример

```tsx
import React from 'react';
import { Button } from '@rarog/react';
import Modal from '@rarog/react/Modal';

export default function App() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button variant="primary" onClick={() => setOpen(true)}>Открыть</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div style={{ padding: 24 }}>
          <h2>Пример модального окна</h2>
          <p>Контент модального окна...</p>
          <Button variant="secondary" onClick={() => setOpen(false)}>Закрыть</Button>
        </div>
      </Modal>
    </div>
  );
}
```

---

## Компоненты и API

> Ниже — описание основных компонентов, включённых в пакет (версии API см. типы в `dist/index.d.ts`).

### `Button`

**Props (основные):**

* `variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'` — визуальный вариант;
* `size?: 'xs' | 'sm' | 'md' | 'lg'` — размер;
* `loading?: boolean` — состояние загрузки (показывает спиннер и выставляет `aria-busy`);
* `asAnchor?: boolean` — рендерить как `<a>` (с пропуском href);
* `disabled?: boolean` — явно отключить кнопку;
* `...rest` — любые стандартные атрибуты `<button>`.

**Особенности:**

* forwardRef; поддержка `aria-busy`, `aria-disabled`; визуальные классы соответствуют Rarog naming (shape, skin, react-press и т.д.).

### `Modal`

**Props (основные):**

* `isOpen: boolean` — состояние открытия;
* `onClose: () => void` — обязательный коллбек при закрытии;
* `ariaLabel?: string` — альтернатива заголовку для aria;
* `closeOnEsc?: boolean` (по умолчанию `true`);
* `closeOnBackdrop?: boolean` (по умолчанию `true`);
* `preventScroll?: boolean` (по умолчанию `true`) — блокировать прокрутку боди;
* `portalTarget?: Element | null` — место для портала (по умолчанию `document.body`);
* `returnFocusRef?: RefObject<HTMLElement>` — куда вернуть фокус после закрытия;
* `initialFocusRef?: RefObject<HTMLElement> | string` — элемент, который должен получить фокус внутри модала.

**Особенности:**

* focus trap, keyboard navigation, возврат фокуса, управление backdrop и scroll locking.
* Рендерится в портал по‑умолчанию — пригодно для SSR (проверяет окружение).

---

## Стилизация и темизация

`@rarog/react` не содержит «встроенных» CSS, а опирается на CSS‑ядро Rarog (`@rarog/core`), которое предоставляет классы и переменные.

Рекомендации:

* Подключайте `@rarog/core` или ваш production‑сборник CSS до рендеринга приложений.
* Для кастомизации темы используйте `rarog.config.js` → `generate-theme.js` (генерация CSS‑переменных).
* Компоненты используют семантические классы вида `btn-primary`, `shape-round-md`, `dens-2` — вы можете переопределять эти классы в своём проекте.

---

## SSR и Accessibility

* Компоненты безопасны для SSR: `Modal` проверяет окружение перед использованием `document`/`window`.
* Все интерактивные элементы содержат ARIA‑атрибуты (`aria-modal`, `aria-busy`, `aria-controls`, и т.д.).
* Рекомендуется добавить автоматические a11y‑проверки в CI (axe, jest-axe) для end-to-end контроля.

---

## Тесты и CI

* Локально:

  ```bash
  pnpm install
  pnpm --filter @rarog/react run build
  pnpm --filter @rarog/react run test
  ```

* CI: проект содержит общий workflow (`.github/workflows/ci.yml`) — lint, build, test, coverage и security scans.

---

## Разработка и вклад

Если вы хотите внести изменения:

1. Форкните репозиторий и создайте ветку `feat/...` или `fix/...`.
2. Следуйте `CONTRIBUTING.md` в корне: формат коммитов, eslint/prettier, tests.
3. Запустите `pnpm -w install && pnpm -w run build` и добавьте тесты для новых API.
4. Откройте PR с описанием изменений и ссылками на связанный issue.

---

## Совместимость и peer dependencies

Пакет ежемесячно поддерживает текущую LTS‑ветку React. В `package.json` указаны peer‑зависимости `react` и `react-dom`.

---

## Примечания по производительности

* Компоненты минимальны и не включают heavy runtime. Для продакшна используйте tree‑shaking и собирайте проект с оптимизациями (production build).
* Для сложного позиционирования всплывающих панелей рекомендуется подключать Popper.js и использовать классы Rarog лишь для стилизации.

---

## Лицензия

Проект распространяется под лицензией **Apache‑2.0**. См. `LICENSE` в корне репозитория.
