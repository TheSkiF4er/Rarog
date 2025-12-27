# Variants & JIT

Rarog 2.3.0 добавляет более умный Tailwind-style движок:

- поддержка variant-префиксов (`group-hover:`, `peer-*`, `data-[state=…]:*`);
- расширенные arbitrary values (`rounded-[...]`, `shadow-[...]`, `gap-[...]`, `border-[...]`);
- улучшенный JIT-анализ (поиск классов в `classList.add(...)`, `clsx(...)`, `cx(...)`);
- официальная интеграция с Vite через плагин.

## Variants

### group-hover

Контейнер:

```html
<div class="group">
  <button class="btn group-hover:bg-primary group-hover:text-primary">
    Наведи на контейнер
  </button>
</div>
```

CSS (предсобранный слой):

- `.group` — вспомогательный класс-контейнер;
- `.group:hover .group-hover\:bg-primary { ... }`
- `.group:hover .group-hover\:text-primary { ... }`
- `.group:hover .group-hover\:border-primary { ... }`

### peer-checked / peer-focus

```html
<label class="d-flex items-center gap-2">
  <input type="checkbox" class="peer" />
  <span class="peer-checked:bg-primary peer-checked:text-primary peer-focus:border-primary px-2 py-1 rounded-md">
    Активируется от состояния input
  </span>
</label>
```

CSS:

- `.peer:checked ~ .peer-checked\:bg-primary { ... }`
- `.peer:checked ~ .peer-checked\:text-primary { ... }`
- `.peer:focus ~ .peer-focus\:border-primary { ... }`

### data-[state=open]:*

```html
<button
  class="btn data-[state=open]:bg-primary data-[state=open]:border-primary"
  data-state="open"
>
  Кнопка в состоянии open
</button>
```

CSS:

- `.data-\[state\=open\]\:bg-primary[data-state="open"] { ... }`
- `.data-\[state\=open\]\:border-primary[data-state="open"] { ... }`

## Arbitrary values v2

JIT поддерживает:

- `w-[320px]`, `h-[50vh]`
- `bg-[rgba(15,23,42,0.9)]`, `text-[#0f172a]`
- `rounded-[1.5rem]`
- `shadow-[0_20px_60px_rgba(15,23,42,0.45)]`
- `gap-[1.5rem]`
- `border-[3px]`

Пример:

```html
<div class="card rounded-[1.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
  ...
</div>
```

Все значения проходят простую фильтрацию (запрещены `;` и `}`), чтобы избежать инъекций.

## JIT v2: поиск классов

Помимо обычных `class="..."` и `className="..."`, JIT теперь смотрит в:

- `element.classList.add('btn', 'btn-primary', 'group-hover:bg-primary')`
- `clsx('btn', isActive && 'btn-primary')`
- `cx('alert', kind === 'error' && 'alert-danger')`
- `classnames('badge', size && 'badge-lg')`

Это позволяет использовать Rarog util-классы во фреймворковых проектах без потерь при tree-shaking.

## Config: variants

В `rarog.config.ts/js` появилась секция:

```ts
variants: {
  group: ["hover"],
  peer: ["checked", "focus"],
  data: ["state"]
}
```

Сейчас она используется как декларация поддерживаемых variants. В будущих версиях может
расшириться до полноценного маппинга variant → генерация CSS.

## Build modes и интеграция

В `rarog.config.ts` по-прежнему доступны режимы:

- `mode: "full"` — собрать полный CSS.
- `mode: "jit"` — собрать минимальный CSS по результатам анализа проекта.

Для Vite есть официальный плагин:

```ts
// tools/vite-plugin-rarog.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rarogPlugin } from './tools/vite-plugin-rarog'

export default defineConfig({
  plugins: [
    react(),
    rarogPlugin()
  ]
})
```

Starter-проект `examples/starters/vite-react` уже настроен на использование плагина и JIT-режима.
