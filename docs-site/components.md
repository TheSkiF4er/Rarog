# Components

Компонентный слой Rarog покрывает большую часть типичных задач интерфейса — от кнопок
и alert'ов до navbar, offcanvas и форм с валидацией.

## Обзор

- Buttons (`.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost`...)
- Alerts (`.alert`, `.alert-success`, `.alert-danger`...)
- Badges (`.badge`, `.badge-primary`, `.badge-outline`)
- List group (`.list-group`, `.list-group-item`)
- Breadcrumbs (`.breadcrumb`, `.breadcrumb-item`)
- Nav & Tabs (`.nav`, `.nav-tabs`, `.nav-link`, `.nav-link-active`)
- Pagination (`.pagination`, `.page-item`, `.page-link`)
- Progress (`.progress`, `.progress-bar`)
- Forms (`.form-group`, `.form-row`, `.form-inline`, `.form-horizontal`)
- Tables (`.table`, `.table-striped`, `.table-hover`, `.table-bordered`, `.table-responsive`)
- Navbar & Header (`.navbar`, `.navbar-inner`, `.navbar-brand`, `.navbar-nav`)
- Offcanvas / Drawer (`.offcanvas`, `.offcanvas-end`, `.offcanvas-bottom`)
- Toasts (`.toast`, `.toast-header`, `.toast-body`)
- Tooltips & Popovers (`.tooltip`, `.popover`)

---

## Navbar + Offcanvas

Пример responsive-шапки с логотипом, основным меню и offcanvas-меню на мобильных.

```html
<header class="navbar">
  <div class="navbar-inner">
    <a href="#" class="navbar-brand">
      <span class="navbar-logo">Rarog</span>
    </a>

    <nav class="navbar-nav d-none sm:d-flex">
      <a href="#" class="navbar-link">Главная</a>
      <a href="#" class="navbar-link">Документация</a>
      <a href="#" class="navbar-link">Компоненты</a>
    </nav>

    <button
      class="btn btn-ghost d-flex sm:d-none"
      type="button"
      aria-label="Toggle navigation"
      data-rg-toggle="offcanvas"
      data-rg-target="#mainOffcanvas"
    >
      ☰
    </button>
  </div>
</header>

<div class="offcanvas offcanvas-end" id="mainOffcanvas" aria-hidden="true">
  <div class="offcanvas-header">
    <div class="offcanvas-title">Меню</div>
    <button class="btn btn-ghost" data-rg-dismiss="offcanvas" aria-label="Закрыть">
      ✕
    </button>
  </div>
  <div class="offcanvas-body">
    <nav class="navbar-nav d-flex flex-column gap-2">
      <a href="#" class="navbar-link">Главная</a>
      <a href="#" class="navbar-link">Документация</a>
      <a href="#" class="navbar-link">Компоненты</a>
    </nav>
  </div>
</div>
```

---

## Tables v2

```html
<div class="table-responsive">
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>#</th>
        <th>Проект</th>
        <th>Статус</th>
        <th>Обновлён</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Rarog CSS</td>
        <td><span class="badge badge-success">Stable</span></td>
        <td>2025-12-27</td>
      </tr>
      <tr>
        <td>2</td>
        <td>AuroraStack</td>
        <td><span class="badge badge-primary">Beta</span></td>
        <td>2025-12-20</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Forms v2: input-group, floating labels, validation

```html
<form class="form" novalidate>
  <div class="field">
    <label class="label">Email</label>
    <div class="input-group">
      <span class="input-group-text">@</span>
      <input type="email" class="form-control is-valid" placeholder="you@example.com" />
    </div>
    <div class="valid-feedback">Выглядит корректно.</div>
  </div>

  <div class="field">
    <div class="form-floating">
      <input
        type="password"
        class="form-control is-invalid"
        id="passwordInput"
        placeholder="Пароль"
      />
      <label for="passwordInput">Пароль</label>
    </div>
    <div class="invalid-feedback">Минимум 8 символов.</div>
  </div>
</form>
```

---

## Toasts

```html
<div class="toast-container">
  <div class="toast" id="demoToast">
    <div class="toast-header">
      <span>Сохранено</span>
      <button class="toast-close" data-rg-dismiss="toast" aria-label="Закрыть">✕</button>
    </div>
    <div class="toast-body">
      Настройки профиля успешно сохранены.
    </div>
  </div>
</div>

<button
  class="btn btn-primary mt-3"
  data-rg-toggle="toast"
  data-rg-target="#demoToast"
>
  Показать toast
</button>
```

---

## Tooltips & Popovers

```html
<button
  class="btn btn-ghost"
  data-rg-toggle="tooltip"
  data-rg-title="Это tooltip Rarog"
>
  Наведи на меня
</button>

<button
  class="btn btn-secondary ml-3"
  data-rg-toggle="popover"
  data-rg-popover-title="Заголовок"
  data-rg-popover-content="Контент popover компонента Rarog."
>
  Кликни для popover
</button>
```

Вся интерактивность обеспечивается подключением одного бандла `rarog.js` и
инициализацией Data-API (по умолчанию выполняется автоматически).
