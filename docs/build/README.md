# Build

Материалы по сборке, JIT, оптимизации размера бандла и проверке артефактов.

## Included legacy sources

- `performance.md`
- `variants-jit.md`
- `integration-guides.md`
- `storybook.md`

## Imported from `performance.md`

## Performance & Bundle Size

Rarog изначально спроектирован так, чтобы:

- full‑сборка была предсказуемой и стабильной;
- JIT‑режим давал **заметное** уменьшение итогового CSS;
- было понятно, как получить минимальный бандл без магии.

### Full vs JIT (концептуально)

Условный пример (ориентировочные, не жёсткие цифры):

| Тип проекта                      | Режим | Размер CSS (сырой) | Gzip‑оценка |
|----------------------------------|-------|---------------------|-------------|
| Малый лендинг                    | full  | 70–90 KB            | 15–25 KB    |
| Малый лендинг                    | jit   | 20–35 KB            | 6–12 KB     |
| Admin‑панель (dashboard)         | full  | 90–130 KB           | 25–35 KB    |
| Admin‑панель (dashboard)         | jit   | 35–60 KB            | 10–20 KB    |

Точные значения зависят от:

- используемых компонентов и утилит;
- объёма layout‑ов и вариаций;
- количества responsive/state/variant‑классов.

### Режимы сборки

В `rarog.config.*`:

```ts
const config: RarogConfig = {
  mode: "jit", // или "full"
  // ...
};
```

- `mode: "full"` — генерируется полный CSS: все утилиты, компоненты, темы.
- `mode: "jit"` — JIT‑движок анализирует `content` и собирает только используемые классы.

### Как работает JIT (кратко)

JIT ищет классы в:

- `class="..."` в HTML/Blade/шаблонах;
- `className="..."` в JSX/TSX;
- `element.classList.add('btn', 'btn-primary')` в JS;
- `clsx('btn', isActive && 'btn-primary')` и аналогичных вызовах (`cx`, `classnames`).

Он поддерживает:

- responsive‑префиксы (`sm:`, `md:`, `lg:`, `xl:`);
- state‑префиксы (`hover:`, `focus:`, `group-hover:`, `peer-checked:` и т.д.);
- arbitrary values (`w-[320px]`, `bg-[#0f172a]`, `rounded-[1.5rem]`, ...).

### Рекомендации по оптимизации

#### 1. Чистые `content`‑пути

В `rarog.config.*` следи, чтобы `content`:

- охватывал только реальные шаблоны/компоненты;
- **не** включал большие vendor‑директории и автогенерируемые файлы.

Плохо:

```ts
content: ["./**/*.php", "./**/*.js"]
```

Хорошо:

```ts
content: [
  "./resources/views/**/*.blade.php",
  "./resources/js/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{vue,ts,tsx}"
]
```

#### 2. Избегать конкатенации

Не делай:

```ts
const cls = "btn-" + variant;      // JIT это не увидит
```

Лучше:

```ts
const cls = variant === "primary" ? "btn btn-primary" : "btn btn-secondary";
```

или:

```ts
clsx("btn", variant === "primary" && "btn-primary");
```

#### 3. Ограниченные arbitrary values

Арbitrary‑классы (`w-[320px]`, `bg-[#0f172a]`) удобны, но злоупотребление ими
может раздуть CSS за счёт множества уникальных значений.

Рекомендация:

- использовать токены там, где это возможно (`w-64`, `bg-primary-600`);
- arbitrary — для редких edge‑кейсов и прототипирования.

#### 4. Отдельные бандлы для тем

Если у тебя несколько тем:

- default / dark / contrast и т.п.,
- можно собирать их в отдельные файлы:

  - `rarog.theme.default.css`,
  - `rarog.theme.dark.css`,
  - `rarog.theme.contrast.css`.

И подгружать только нужное (через `<link>` или динамический импорт).

### Проверка размеров

Рекомендуется:

```bash
## сборка
rarog build

## оценка размеров (Linux/macOS)
gzip -c dist/rarog.jit.css | wc -c
gzip -c dist/rarog.css | wc -c
```

Так можно сравнить full vs JIT на реальном проекте.

---

Для деталей и примеров использования см. также:

- [Variants & JIT](/variants-jit)
- разделы гайдов по конкретным стекам (Laravel/React/Next.js).


### Performance v2 и размеры бандлов

Для Rarog 3.x мы разделяем несколько сценариев сборки:

- **full** — полный набор токенов, утилит и компонент;
- **jit** — только реально используемые классы по анализу `content`;
- **split** — несколько CSS-бандлов под разные части системы (публичный сайт, админка и т.п.).

Рекомендуемый подход:

1. На стадии прототипа — использовать full-сборку (быстрый старт).
2. Для production — включить `mode: "jit"` в `rarog.config.*` и
   ограничить `content` только реальными путями проекта.
3. Для больших систем — рассмотреть split-сборку:
   - общий foundation (tokens + base utilities),
   - отдельный бандл для admin UI,
   - отдельный бандл для публичной витрины/лендингов.

Также важно:

- кешировать результаты JIT-сборки (особенно в CI) — это поддерживается
  через стандартные механизмы кеша (`node_modules/.cache`, CI cache);
- по возможности не держать «мертвые» layout-страницы в одном репо
  без необходимости — JIT всё равно увидит классы и не сможет их выкинуть.


## Imported from `variants-jit.md`

## Variants & JIT

Rarog 2.3.0 добавляет более умный Tailwind-style движок:

- поддержка variant-префиксов (`group-hover:`, `peer-*`, `data-[state=…]:*`);
- расширенные arbitrary values (`rounded-[...]`, `shadow-[...]`, `gap-[...]`, `border-[...]`);
- улучшенный JIT-анализ (поиск классов в `classList.add(...)`, `clsx(...)`, `cx(...)`);
- официальная интеграция с Vite через плагин.

### Variants

#### group-hover

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

#### peer-checked / peer-focus

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

#### data-[state=open]:*

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

### Arbitrary values v2

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

### JIT v2: поиск классов

Помимо обычных `class="..."` и `className="..."`, JIT теперь смотрит в:

- `element.classList.add('btn', 'btn-primary', 'group-hover:bg-primary')`
- `clsx('btn', isActive && 'btn-primary')`
- `cx('alert', kind === 'error' && 'alert-danger')`
- `classnames('badge', size && 'badge-lg')`

Это позволяет использовать Rarog util-классы во фреймворковых проектах без потерь при tree-shaking.

### Config: variants

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

### Build modes и интеграция

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


## Imported from `integration-guides.md`

## Integration Guides

Rarog не привязан к конкретному фреймворку и хорошо интегрируется с:

- Чистым HTML/статическими сайтами
- Laravel / PHP
- Vite + React / Vue / Svelte
- Любым backend-шаблонизатором (Twig, Blade, Jinja2 и т.д.)

См. директорию `examples/` в репозитории:

- `examples/starters/html-basic` — чистый HTML starter
- `examples/starters/laravel` — Laravel + Rarog
- `examples/starters/vite-react` — Vite + React + Rarog

Каждый starter содержит отдельный `README` и пример минимального проекта.

### Vite + Rarog (официальный плагин)

Для Vite-проектов рекомендуется использовать плагин:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rarogPlugin } from '../tools/vite-plugin-rarog'

export default defineConfig({
  plugins: [
    react(),
    rarogPlugin()
  ]
})
```

Плагин автоматически вызывает `rarog build` в JIT-режиме при старте dev-сервера и при изменении файлов в `resources/`.

### Webpack / другие сборщики

Для Webpack и других bundler'ов можно:

- либо вызывать `rarog build` из npm-скриптов перед `webpack build`;
- либо написать лёгкий плагин на базе `child_process.spawn('rarog', ['build'])`.

Простой сценарий через npm-скрипты:

```json
{
  "scripts": {
    "build:css": "rarog build",
    "build:app": "webpack --mode production",
    "build": "npm run build:css && npm run build:app"
  }
}
```


### SPA/SSR‑стартовые проекты

В репозитории есть готовые starters для SPA/SSR‑стеков:

- `examples/starters/nextjs-rarog` — Next.js 14 (App Router) + Rarog + `@rarog/react`;
- `examples/starters/nuxt-rarog` — Nuxt 3 + Rarog + `@rarog/vue`;
- `examples/starters/sveltekit-rarog` — SvelteKit + Rarog.

Они демонстрируют:

- подключение CSS/JS Rarog в SSR‑фреймворках;
- использование JS‑ядра в SPA‑навигации;
- работу Rarog в гибридном режиме (SSR + client hydration).

### Microfrontends / Module Federation (MVP)

Rarog можно использовать в микрофронтендах при общей дизайн‑системе:

- выносите токены и темы в общий пакет (например, `rarog` + темы);
- подключайте общий CSS‑бандл (или несколько тем) во все микрофронты;
- JS‑ядро можно шарить как singleton‑модуль (Webpack Module Federation, Vite + `remoteEntry` и т.п.).

Основные рекомендации:

- использовать единый источник токенов (`rarog.tokens.json` + theme‑packs);
- следить, чтобы Rarog JS Core подключался один раз (singleton);
- для каждого микрофронта вызывать `Rarog.init(root)` / `Rarog.dispose(root)` на уровне его контейнера.


## Imported from `storybook.md`

## Storybook

Rarog теперь включает локальный Storybook-контур для HTML/JS Core компонентов.

### Запуск

```bash
npm install
npm run storybook
```

По умолчанию Storybook поднимается на `http://127.0.0.1:6006`.

### Что уже покрыто

- Foundations / Button
- Overlays / Modal
- Overlays / Dropdown
- Data / DataTable

Storybook собран на `@storybook/html-vite`, поэтому истории работают прямо с исходными CSS entrypoints и `packages/js/src/rarog.esm.js`.
