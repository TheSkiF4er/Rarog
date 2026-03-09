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
- Carousel (`.carousel`, `.carousel-item`, `.carousel-indicators`)
- Stepper / Wizard (`.stepper`, `.stepper-step`, `.stepper-content`)

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

---

## Carousel / Slider

Простейший slider/hero-карусель на базе `.carousel`:

```html
<div class="carousel" id="heroCarousel" data-rg-autoplay="true" data-rg-interval="6000">
  <div class="carousel-inner">
    <section class="carousel-item is-active">
      <div class="card p-6 text-center">
        <h2 class="h3 mb-2">Rarog = tokens + utilities + components</h2>
        <p class="text-muted">Быстрый старт без ручного CSS.</p>
      </div>
    </section>
    <section class="carousel-item">
      <div class="card p-6 text-center">
        <h2 class="h3 mb-2">Tailwind-подобные утилиты</h2>
        <p class="text-muted">Layout, типографика, эффекты, scroll-snap и др.</p>
      </div>
    </section>
  </div>

  <button class="carousel-control-prev" type="button" id="heroPrev">
    ‹
  </button>
  <button class="carousel-control-next" type="button" id="heroNext">
    ›
  </button>

  <div class="carousel-indicators">
    <button class="carousel-indicator is-active" data-rg-target="#heroCarousel" data-rg-slide-to="0"></button>
    <button class="carousel-indicator" data-rg-target="#heroCarousel" data-rg-slide-to="1"></button>
  </div>
</div>

<script type="module">
  import { Rarog } from "./dist/rarog.esm.js";

  const el = document.getElementById("heroCarousel");
  const carousel = Rarog.Carousel.getOrCreate(el);

  document.getElementById("heroPrev")?.addEventListener("click", () => carousel.prev());
  document.getElementById("heroNext")?.addEventListener("click", () => carousel.next());
</script>
```

---

## Stepper / Wizard

Компонент для пошаговых форм и wizard-сценариев:

```html
<div class="stepper" id="signupStepper">
  <div class="stepper-header">
    <button class="stepper-step is-active" type="button" data-rg-step-to="0">
      <span class="stepper-step-index">1</span>
      <span class="stepper-label">Профиль</span>
    </button>
    <button class="stepper-step" type="button" data-rg-step-to="1">
      <span class="stepper-step-index">2</span>
      <span class="stepper-label">Компания</span>
    </button>
    <button class="stepper-step" type="button" data-rg-step-to="2">
      <span class="stepper-step-index">3</span>
      <span class="stepper-label">Подтверждение</span>
    </button>
  </div>

  <div class="stepper-body mt-4">
    <section class="stepper-content is-active">
      <!-- Поля шага 1 -->
    </section>
    <section class="stepper-content">
      <!-- Поля шага 2 -->
    </section>
    <section class="stepper-content">
      <!-- Поля шага 3 -->
    </section>
  </div>

  <div class="d-flex justify-between mt-4">
    <button type="button" class="btn btn-secondary" id="stepperPrev">Назад</button>
    <button type="button" class="btn btn-primary" id="stepperNext">Далее</button>
  </div>
</div>

<script type="module">
  import { Rarog } from "./dist/rarog.esm.js";

  const el = document.getElementById("signupStepper");
  const stepper = Rarog.Stepper.getOrCreate(el);

  document.getElementById("stepperPrev")?.addEventListener("click", () => stepper.prev());
  document.getElementById("stepperNext")?.addEventListener("click", () => stepper.next());

  el.addEventListener("rg:stepper:goto", event => {
    console.log("Stepper changed to step", event.detail.index);
  });
</script>
```
Вся интерактивность обеспечивается подключением одного бандла `rarog.js` и
инициализацией Data-API (по умолчанию выполняется автоматически).

## Accessibility notes (кратко по компонентам)

- **Alerts / Badges** — используйте семантические роли (`role="status"`, `role="alert"`) для динамических сообщений.
- **Buttons / Links** — действия должны быть `<button>`, навигация — `<a href>`.
- **Navbar / Nav / Tabs** — для табов задавайте `role="tablist"`, `role="tab"`, `role="tabpanel"`, для навигации — `nav` + `aria-label`.
- **Forms** — всегда связывайте `label` и `input` через `for`/`id`, используйте `aria-describedby` для help/error текстов.
- **Modal / Offcanvas** — следите за фокусом и отношениями `aria-labelledby`/`aria-describedby`.
- **Dropdown / Tooltip / Popover** — не прячьте критически важную информацию только в hover-состоянии, дублируйте текстом.
- **Carousel / Stepper** — используйте понятные подписи и информируйте пользователя о текущем состоянии (номер шага, номер слайда).


## Advanced forms: datepicker, select, combobox, tags-input

В 3.1.0 поверх базового форменного слоя появились более «богатые» компоненты, которые
закрывают типовые кейсы форм без сторонних библиотек.

### Datepicker / Datetime picker

Компонент `rg-datepicker`/`rg-datetime-picker` представляет собой обёртку над `<input>`,
которая рендерит popup-календарь и управляется через data-API:

```html
<div class="rg-datepicker" data-rg-datepicker>
  <label class="form-label">Дата рождения</label>
  <input
    type="date"
    class="form-control rg-datepicker-input"
    name="birthday"
    placeholder="Выберите дату"
  />
</div>
```

- JS-инициализация: автоматически через `initDataApi()` (по `data-rg-datepicker`).
- События: `rg:datepicker:show`, `rg:datepicker:hide`, `rg:datepicker:select`.
- Формат значения по умолчанию — `YYYY-MM-DD` (совместим с `type="date"`).

Для datetime-варианта используется `data-rg-datetime-picker` и `<input type="datetime-local">`.

### Select / Combobox

`rg-select` — настраиваемый выпадающий список с поддержкой single/multiple:

```html
<div class="rg-select" data-rg-select data-rg-multiple="false">
  <button type="button" class="rg-select-toggle" data-rg-select-toggle>
    <span class="rg-select-label" data-rg-placeholder="Выберите опцию"></span>
    <span class="rg-select-icon">▾</span>
  </button>
  <div class="rg-select-menu" data-rg-select-menu hidden>
    <button type="button" class="rg-select-option" data-rg-value="basic">
      Basic
    </button>
    <button type="button" class="rg-select-option" data-rg-value="pro">
      Pro
    </button>
  </div>
  <input type="hidden" name="plan" />
</div>
```

`rg-combobox` добавляет текстовый input и поиск по опциям:

```html
<div class="rg-combobox" data-rg-combobox>
  <div class="rg-combobox-inner">
    <input class="rg-combobox-input" placeholder="Найдите пользователя" />
    <button type="button" class="rg-combobox-toggle" aria-label="Открыть список">▾</button>
  </div>
  <div class="rg-combobox-list" hidden>
    <button type="button" class="rg-combobox-option" data-rg-value="1">Alice</button>
    <button type="button" class="rg-combobox-option" data-rg-value="2">Bob</button>
  </div>
  <input type="hidden" name="user_id" />
</div>
```

### Tags input

`rg-tags-input` — компонент для ввода тегов (например, интересов или ключевых слов):

```html
<div class="rg-tags-input" data-rg-tags-input>
  <div class="rg-tags"></div>
  <input class="rg-tags-input-input" placeholder="Добавьте тег и нажмите Enter" />
  <input type="hidden" name="tags" value="design,frontend" />
</div>
```

Поведение по умолчанию:

- Enter или запятая — добавляют новый тег;
- Backspace на пустом input — удаляет последний тег;
- значения синхронизируются с `hidden`-полем (через запятую).

Компонент интегрируется с валидацией через классы `.is-valid`/`.is-invalid`/`.has-warning`.

## Data Table (MVP)

`DataTable` закрывает базовый сценарий работы с таблицами: сортировка, поиск и
клиентская пагинация.

Разметка:

```html
<div class="table-card" data-rg-table data-rg-page-size="10">
  <div class="table-toolbar">
    <div class="table-toolbar-left">
      <span class="text-muted">Пользователи</span>
    </div>
    <div class="table-toolbar-right">
      <input
        type="search"
        class="form-control"
        placeholder="Поиск"
        data-rg-table-search
      />
    </div>
  </div>

  <div class="table-responsive">
    <table class="table rg-table">
      <thead>
        <tr>
          <th data-rg-sort="name">Имя</th>
          <th data-rg-sort="role">Роль</th>
          <th data-rg-sort="age" data-rg-sort-type="number">Возраст</th>
        </tr>
      </thead>
      <tbody>
        <!-- строки данных -->
      </tbody>
    </table>
  </div>

  <div class="rg-table-pagination" data-rg-table-pagination></div>
</div>
```

Возможности:

- Поиск по таблице (по тексту строки) через `data-rg-table-search`.
- Сортировка по колонкам с `data-rg-sort` (+ `data-rg-sort-type="number"` при необходимости).
- Клиентская пагинация при наличии `data-rg-table-pagination` и `data-rg-page-size`.

Все компоненты автоматически инициализируются при вызове `Rarog.initDataApi()` или
`Rarog.init()`.
