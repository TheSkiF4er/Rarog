# Cookbook & Patterns

Раздел **Cookbook** собирает готовые паттерны на базе Rarog. Идея простая:
копируешь пример, подстраиваешь токены/классы — и получаешь production‑layout без
дополнительного CSS.

## Layout-паттерны

### Двухколоночный layout

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

### Sidebar + content (фиксированный сайдбар)

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

### Dashboard (sidebar + topbar + cards)

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

### Landing: hero + features + pricing + CTA

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
            Dropdown, Modal, Offcanvas, Toasts — на ванильном JS.
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

## UI-паттерны

### Модалка с шагами (wizard)

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

### Alerts / Notifications

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

### Формы с plugin-forms

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
