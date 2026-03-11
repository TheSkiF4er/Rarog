# Utilities

Низкоуровневые utility-классы и практические паттерны их использования.

## Included legacy sources

- `utilities.md`
- `cookbook.md`

## Imported from `utilities.md`

## Utilities

Утилиты Rarog позволяют верстать большинство интерфейсов без написания кастомного CSS.

### Layout & Display

- `d-block`, `d-inline`, `d-inline-block`
- `d-flex`, `d-inline-flex`, `d-grid`, `d-none`
- `flex-row`, `flex-column`, `flex-wrap`, `flex-nowrap`
- `justify-*`, `items-*`, `gap-*`
- responsive-варианты: `sm:*`, `md:*`, `lg:*`, `xl:*`, `xl2:*`

### Position & Z-index

- Позиционирование:
  - `relative`, `absolute`, `fixed`, `sticky`
- Координаты:
  - `top-0`, `right-0`, `bottom-0`, `left-0`
  - `top-1/2`, `left-1/2`, `right-1/2`, `bottom-1/2`
  - `top-full`, `left-full`, `right-full`, `bottom-full`
- Z-слой:
  - `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`, `z-auto`

### Sizing & Aspect ratio

- Ширина:
  - `w-1/2`, `w-1/3`, `w-2/3`, `w-full`, `w-screen`
- Высота:
  - `h-1/2`, `h-1/3`, `h-2/3`, `h-full`, `h-screen`
- Min/Max:
  - `min-w-full`, `max-w-full`, `min-h-full`, `max-h-full`
- Aspect ratio:
  - `aspect-video` (16:9)
  - `aspect-square` (1:1)

### Borders, Radius, Shadow & Effects

- Скругления:
  - `rounded-none`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`
- Тени:
  - `shadow-none`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`
- Границы:
  - `border`, `border-0`, `border-t`, `border-b`, `border-l`, `border-r`
  - `border-primary`, `border-secondary`, `border-success`, `border-danger`, `border-warning`, `border-info`
- Transitions:
  - `transition`, `transition-colors`, `transition-opacity`, `transition-transform`
  - `duration-75/100/150/200/300/500/700/1000`
  - `ease-linear`, `ease-in`, `ease-out`, `ease-in-out`
- Animations:
  - `animate-spin`, `animate-pulse`

### Typography

- Размеры текста:
  - `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`
- Вес шрифта:
  - `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- Межстрочный интервал:
  - `leading-none`, `leading-tight`, `leading-snug`, `leading-normal`, `leading-relaxed`, `leading-loose`
- Выравнивание:
  - `text-left`, `text-center`, `text-right`

### Effects & Filters

- Blur:
  - `blur-none`, `blur-sm`, `blur-md`, `blur-lg`
- Brightness:
  - `brightness-90`, `brightness-100`, `brightness-110`, `brightness-125`, `brightness-150`
- Contrast:
  - `contrast-75`, `contrast-100`, `contrast-125`, `contrast-150`
- Цветовые эффекты:
  - `grayscale`, `invert`, `sepia`
- Backdrop-фильтры (там, где поддерживаются браузером):
  - `backdrop-blur-none`, `backdrop-blur-sm`, `backdrop-blur-md`, `backdrop-blur-lg`
- Blend-режимы:
  - `mix-blend-normal/multiply/screen/overlay/darken/lighten/difference`
  - `bg-blend-normal/multiply/screen/overlay`

### Scroll & Overscroll

- Overscroll:
  - `overscroll-auto`, `overscroll-contain`, `overscroll-none`
- Поведение скролла:
  - `scroll-auto`, `scroll-smooth`
- Anchor-offset для заголовков:
  - `scroll-mt-0/1/2/3/4/5/6/8/10/12`
- Дополнительный отступ снизу при прокрутке:
  - `scroll-pb-0/1/2/3/4/5/6/8/10/12`

### Scroll Snap

- Ось:
  - `snap-none`, `snap-x`, `snap-y`, `snap-both`
- Выравнивание элементов:
  - `snap-start`, `snap-center`, `snap-end`

Пример:

```html
<div class="d-flex overflow-x-auto snap-x">
  <div class="snap-start w-64">Card 1</div>
  <div class="snap-start w-64">Card 2</div>
  <div class="snap-start w-64">Card 3</div>
</div>
```

### Multi-column / Columns

- `columns-2`, `columns-3`, `columns-4` — базовый многоколоночный layout для текста/списков.

Пример:

```html
<div class="columns-3 gap-4">
  <p>Длинный текст 1...</p>
  <p>Длинный текст 2...</p>
  <p>Длинный текст 3...</p>
</div>
```

### Print utilities

Утилиты для управления видимостью при печати (используются как обычные классы):

- `print:hidden` — скрыть элемент на печати;
- `print:block` — показать как `block`;
- `print:inline` — показать как `inline`;
- `print:flex` — показать как `flex`.

Пример:

```html
<div class="alert alert-info print:hidden">
  Это уведомление видно в браузере, но скрыто на печати.
</div>
```

### RTL / Logical spacing

Первый слой RTL/логических утилит (работают через `margin-inline-*` / `padding-inline-*`):

- Отступы по “логическому началу/концу”:
  - `ms-0/1/2/3/4/5/6/8/10/12` — `margin-inline-start`
  - `me-0/1/2/3/4/5/6/8/10/12` — `margin-inline-end`
- Внутренние отступы:
  - `ps-0/1/2/3/4/5/6/8/10/12` — `padding-inline-start`
  - `pe-0/1/2/3/4/5/6/8/10/12` — `padding-inline-end`

Используются совместно с `dir="rtl"` на `html` или контейнере.

### Visibility & Accessibility

- `d-none`, `overflow-hidden`, `overflow-auto`, `overflow-x-auto`, `overflow-y-auto`
- `sr-only`, `sr-only-focusable`

---

Подробнее см. исходник:

```text
packages/utilities/src/rarog-utilities.css
```


## Imported from `cookbook.md`

## Cookbook & Patterns

Раздел **Cookbook** собирает готовые паттерны на базе Rarog. Идея простая:
копируешь пример, подстраиваешь токены/классы — и получаешь production‑layout без
дополнительного CSS.

### Layout-паттерны

#### Двухколоночный layout

Классика: контент + боковая колонка. На мобильных — одна колонка, на `md+` — две.

```html
<div class="rg-container-lg py-8">
  <div class="rg-row gap-6">
    <div class="rg-col-12 rg-col-md-8">
      <article class="card p-6">
        <h1 class="text-2xl font-semibold mb-4">Главный контент</h1>
        <p class="text-muted">
          Здесь может быть статья, документация, описание продукта — всё, что угодно.
        </p>
      </article>
    </div>
    <div class="rg-col-12 rg-col-md-4">
      <aside class="card p-4">
        <h2 class="text-lg font-semibold mb-3">Sidebar</h2>
        <ul class="list-group">
          <li class="list-group-item">Ссылка 1</li>
          <li class="list-group-item">Ссылка 2</li>
          <li class="list-group-item">Ссылка 3</li>
        </ul>
      </aside>
    </div>
  </div>
</div>
```

#### Sidebar + content (фиксированный сайдбар)

Layout в стиле dashboard: сайдбар слева, основной контент справа.

```html
<div class="min-h-screen d-flex">
  <aside class="w-64 bg-slate-900 text-slate-100 p-4 d-flex flex-column gap-3">
    <div class="text-xl font-semibold mb-4">Rarog Admin</div>
    <nav class="d-flex flex-column gap-2">
      <a href="#" class="nav-link nav-link-active">Dashboard</a>
      <a href="#" class="nav-link">Users</a>
      <a href="#" class="nav-link">Settings</a>
    </nav>
  </aside>

  <main class="flex-1 bg-slate-50 p-6">
    <header class="d-flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Dashboard</h1>
      <button class="btn btn-primary">New action</button>
    </header>

    <section class="rg-row gap-4">
      <div class="rg-col-12 rg-col-md-4">
        <div class="card p-4">
          <div class="text-sm text-muted mb-1">Active users</div>
          <div class="text-2xl font-semibold">1 248</div>
        </div>
      </div>
      <div class="rg-col-12 rg-col-md-4">
        <div class="card p-4">
          <div class="text-sm text-muted mb-1">Conversion</div>
          <div class="text-2xl font-semibold">4.2%</div>
        </div>
      </div>
      <div class="rg-col-12 rg-col-md-4">
        <div class="card p-4">
          <div class="text-sm text-muted mb-1">Errors</div>
          <div class="text-2xl font-semibold text-danger-600">12</div>
        </div>
      </div>
    </section>
  </main>
</div>
```

#### Dashboard (sidebar + topbar + cards)

Расширение предыдущего паттерна с topbar:

```html
<div class="min-h-screen d-flex flex-column">
  <header class="h-16 d-flex items-center justify-between px-6 bg-white shadow-sm">
    <div class="d-flex items-center gap-3">
      <span class="text-lg font-semibold">Rarog Cloud</span>
      <span class="badge badge-outline">v2.x</span>
    </div>
    <div class="d-flex items-center gap-3">
      <button class="btn btn-ghost">Docs</button>
      <button class="btn btn-primary">New project</button>
    </div>
  </header>

  <div class="flex-1 d-flex">
    <aside class="w-64 bg-slate-900 text-slate-100 p-4 d-flex flex-column gap-3">
      <!-- sidebar как в предыдущем примере -->
    </aside>

    <main class="flex-1 bg-slate-50 p-6">
      <!-- блок с cards/графиками -->
    </main>
  </div>
</div>
```

#### Landing: hero + features + pricing + CTA

```html
<div class="bg-slate-950 text-slate-50">
  <!-- Hero -->
  <section class="rg-container-lg py-16 text-center">
    <div class="badge badge-outline mb-4">New in v2.x</div>
    <h1 class="text-4xl md:text-5xl font-bold mb-4">
      Rarog — альтернатива Tailwind + Bootstrap
    </h1>
    <p class="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
      Дизайн‑токены, утилиты, компоненты и ванильное JS‑ядро. Без jQuery, заточено под Cajeer‑экосистему и не только.
    </p>
    <div class="d-flex justify-center gap-4">
      <a href="/getting-started" class="btn btn-primary">Начать за 5 минут</a>
      <a href="/why-rarog" class="btn btn-ghost">Почему Rarog?</a>
    </div>
  </section>

  <!-- Features -->
  <section class="rg-container-lg py-14">
    <div class="rg-row gap-6">
      <div class="rg-col-12 rg-col-md-4">
        <div class="card p-5 h-full">
          <h3 class="text-lg font-semibold mb-2">Design tokens</h3>
          <p class="text-slate-300">
            Цвета, spacing, radius, shadow — в JSON + CSS‑переменных.
          </p>
        </div>
      </div>
      <div class="rg-col-12 rg-col-md-4">
        <div class="card p-5 h-full">
          <h3 class="text-lg font-semibold mb-2">Utilities & Components</h3>
          <p class="text-slate-300">
            Tailwind‑подобные утилиты + Bootstrap‑уровень компонент.
          </p>
        </div>
      </div>
      <div class="rg-col-12 rg-col-md-4">
        <div class="card p-5 h-full">
          <h3 class="text-lg font-semibold mb-2">JS Core</h3>
          <p class="text-slate-300">
            Dropdown, Modal, Offcanvas, Toasts, Carousel, Stepper — на ванильном JS.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing (условный) -->
  <section class="rg-container-lg py-14">
    <div class="rg-row gap-6">
      <div class="rg-col-12 rg-col-md-4">
        <div class="card p-6 h-full">
          <h3 class="text-xl font-semibold mb-2">Open Source</h3>
          <p class="mb-4 text-slate-500">Apache 2.0, Cajeer Team, GitHub.</p>
          <button class="btn btn-primary w-full">View on GitHub</button>
        </div>
      </div>
      <!-- можно добавить Enterprise/Custom колонки -->
    </div>
  </section>

  <!-- CTA -->
  <section class="rg-container-lg py-12 border-t border-slate-800 text-center">
    <h2 class="text-2xl font-semibold mb-3">Готовы попробовать Rarog?</h2>
    <p class="text-slate-400 mb-6">
      Подключите фреймворк в текущий stack или начните с одного из starter‑ов.
    </p>
    <div class="d-flex justify-center gap-4">
      <a href="/guide-laravel" class="btn btn-primary">Laravel Guide</a>
      <a href="/guide-react" class="btn btn-outline">React Guide</a>
    </div>
  </section>
</div>
```

#### Data-heavy admin / таблицы с фильтрами

```html
<div class="rg-container-lg py-8">
  <header class="d-flex justify-between items-center mb-4">
    <h1 class="text-2xl font-semibold">Users</h1>
    <button class="btn btn-primary">New user</button>
  </header>

  <div class="table-toolbar">
    <div class="table-toolbar-left">
      <button class="btn btn-outline">Bulk actions</button>
      <select class="form-control">
        <option>All</option>
        <option>Active</option>
        <option>Blocked</option>
      </select>
    </div>
    <div class="table-toolbar-right">
      <input type="search" class="form-control" placeholder="Search users..." />
    </div>
  </div>

  <div class="table-responsive">
    <table class="table table-hover align-middle">
      <thead>
        <tr>
          <th scope="col">
            <input type="checkbox" />
          </th>
          <th scope="col">User</th>
          <th scope="col">Role</th>
          <th scope="col">Status</th>
          <th scope="col" class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="checkbox" /></td>
          <td>Jane Doe</td>
          <td>Admin</td>
          <td><span class="badge badge-success">Active</span></td>
          <td class="text-right">
            <button class="btn btn-ghost btn-sm">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### UI-паттерны

#### Модалка с шагами (wizard)

```html
<!-- Триггер -->
<button
  class="btn btn-primary"
  data-rg-toggle="modal"
  data-rg-target="#wizardModal"
>
  Открыть мастер
</button>

<!-- Modal -->
<div class="modal" id="wizardModal" aria-hidden="true">
  <div class="modal-dialog max-w-xl">
    <div class="modal-header">
      <h2 class="modal-title">Новый проект</h2>
      <button class="btn-close" data-rg-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <ol class="d-flex gap-2 mb-4 text-sm">
        <li class="badge badge-primary">1. Базовая инфа</li>
        <li class="badge badge-outline">2. Настройки</li>
        <li class="badge badge-outline">3. Подтверждение</li>
      </ol>

      <form class="d-flex flex-column gap-3">
        <div class="field">
          <label class="field-label-inline">
            Название
            <span class="badge badge-outline text-xs">обязательно</span>
          </label>
          <input type="text" class="form-control" placeholder="my-project" />
          <p class="field-hint">Используется в URL и CLI.</p>
        </div>
      </form>
    </div>
    <div class="modal-footer d-flex justify-between">
      <button class="btn btn-ghost" data-rg-dismiss="modal">Отмена</button>
      <div class="d-flex gap-2">
        <button class="btn btn-outline">Назад</button>
        <button class="btn btn-primary">Дальше</button>
      </div>
    </div>
  </div>
</div>
```

#### Alerts / Notifications

```html
<div class="rg-container-lg my-6">
  <div class="alert alert-success mb-3">
    Конфигурация сохранена. Rarog пересобран в JIT‑режиме.
  </div>
  <div class="alert alert-warning mb-3">
    Некоторые классы не были найдены в `content` — проверьте пути в rarog.config.
  </div>
  <div class="alert alert-danger">
    Ошибка сборки. См. лог rarog CLI.
  </div>
</div>
```

#### Формы с plugin-forms

```html
<form class="rg-container-sm py-8">
  <div class="field">
    <label class="field-label-inline">
      Email
      <span class="badge badge-outline text-xs">обязательно</span>
    </label>
    <input type="email" class="form-control-lg input-muted w-full" />
    <p class="field-hint">Используется для уведомлений и восстановления доступа.</p>
  </div>

  <div class="field d-flex items-center justify-between">
    <span>Рассылать мне обновления Rarog</span>
    <input type="checkbox" class="switch" />
  </div>

  <button class="btn btn-primary mt-4">Сохранить</button>
</form>
```

---

Этот раздел можно постепенно расширять, добавляя паттерны под конкретные сценарии твоей экосистемы
(Cajeer‑проекты, админки, лендинги, внутренние тулзы).
