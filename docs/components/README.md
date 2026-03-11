# Components

Обзор компонентного слоя, accessibility-практик и связанных публичных контрактов.

## Included legacy sources

- `components.md`
- `accessibility.md`
- `api-contract.md`

## Imported from `components.md`

## Components

Компонентный слой Rarog покрывает большую часть типичных задач интерфейса — от кнопок
и alert'ов до navbar, offcanvas и форм с валидацией.

### Обзор

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

### Navbar + Offcanvas

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

### Tables v2

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

### Forms v2: input-group, floating labels, validation

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

### Toasts

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

### Tooltips & Popovers

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

### Carousel / Slider

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

### Stepper / Wizard

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

### Accessibility notes (кратко по компонентам)

- **Alerts / Badges** — используйте семантические роли (`role="status"`, `role="alert"`) для динамических сообщений.
- **Buttons / Links** — действия должны быть `<button>`, навигация — `<a href>`.
- **Navbar / Nav / Tabs** — для табов задавайте `role="tablist"`, `role="tab"`, `role="tabpanel"`, для навигации — `nav` + `aria-label`.
- **Forms** — всегда связывайте `label` и `input` через `for`/`id`, используйте `aria-describedby` для help/error текстов.
- **Modal / Offcanvas** — следите за фокусом и отношениями `aria-labelledby`/`aria-describedby`.
- **Dropdown / Tooltip / Popover** — не прячьте критически важную информацию только в hover-состоянии, дублируйте текстом.
- **Carousel / Stepper** — используйте понятные подписи и информируйте пользователя о текущем состоянии (номер шага, номер слайда).


### Advanced forms: datepicker, select, combobox, tags-input

В 3.1.0 поверх базового форменного слоя появились более «богатые» компоненты, которые
закрывают типовые кейсы форм без сторонних библиотек.

#### Datepicker / Datetime picker

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

#### Select / Combobox

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

#### Tags input

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

### Data Table (MVP)

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


## Imported from `accessibility.md`

## Accessibility

Rarog стремится быть безопасным и предсказуемым в доступных интерфейсах, но не
берёт на себя всю работу за разработчика. Этот раздел фиксирует, что именно
гарантируется ядром, а что остаётся на стороне продукта.

### Общие принципы

- Используйте семантическую разметку HTML (button, nav, header, main, form).
- Не полагайтесь только на цвет — используйте текст, иконки, состояние.
- Следите за контрастом: ориентир — WCAG AA для текста и элементов управления.
- Проверяйте клавиатурную навигацию: Tab/Shift+Tab, Enter/Space, Escape.
- Учитывайте `prefers-reduced-motion` и другие user preferences.

### Чек-лист по компонентам

#### Modal

Гарантирует:

- блокировку скролла `body` при открытии;
- фокус-ловушку: Tab/Shift+Tab остаются внутри модального окна;
- возврат фокуса на исходный элемент при закрытии;
- ARIA-атрибуты на контейнере (`role="dialog"`, `aria-modal="true"`).

Рекомендуется:

- задавать `aria-labelledby`/`aria-describedby` на модальном контейнере;
- использовать настоящие `<button>` для кнопок закрытия/действий.

#### Dropdown

Гарантирует:

- переключение видимости по клику;
- управление через `data-rg-toggle="dropdown"` и `data-rg-target`.

Рекомендуется:

- добавлять `aria-haspopup="menu"` и `aria-expanded="true/false"` на триггер;
- использовать список (`<ul role="menu">`) и элементы (`<li role="menuitem">`).

#### Offcanvas

Гарантирует:

- блокировку скролла `body` при открытии;
- закрытие по клику на backdrop и по Escape.

Рекомендуется:

- указывать `role="dialog"` и `aria-modal="true"` на offcanvas;
- использовать логическую структуру: заголовок, контент, actions.

#### Tooltip & Popover

Гарантирует:

- создание/удаление DOM-элементов tooltip/popover;
- привязку к триггеру через data-атрибуты.

Рекомендуется:

- связывать триггер и подсказку через `aria-describedby`;
- не использовать tooltip как единственный источник важной информации.

#### Navbar & Tabs

Navbar:

- используйте `<nav>` и `aria-label` для основного меню;
- для sticky-вариантов (`.navbar-sticky`) следите за порядком фокуса.

Tabs (`.nav-tabs`):

- рекомендуется использовать роли:
  - `role="tablist"` на контейнере вкладок;
  - `role="tab"` на ссылках;
  - `role="tabpanel"` на контенте + `aria-labelledby`.

#### Carousel

Гарантирует:

- переключение слайдов и классов `.is-active`;
- управление через `Rarog.Carousel.getOrCreate(el)`;
- события `rg:carousel:*` для реакции приложения.

Рекомендуется:

- добавить `role="region"` и `aria-roledescription="carousel"` на контейнер;
- использовать `aria-label` для описания назначения карусели;
- помечать слайды `aria-hidden="true/false"` (Rarog делает это автоматически).

#### Stepper / Wizard

Гарантирует:

- переключение активных шагов и контента;
- `aria-current="step"` на активном шаге.

Рекомендуется:

- использовать чёткие текстовые label’ы шагов;
- озвучивать ошибки/валидацию внутри шагов через `aria-describedby`.

### A11y-утилиты

Дополнительные утилиты для доступности:

- `sr-only` — скрыть элемент визуально, оставить для screen reader;
- `not-sr-only` — вернуть элемент в обычный поток;
- `focus-ring` — заметное outline-обрамление для активного элемента;
- `focus-outline-none` — убрать outline (использовать только при наличии альтернативы);
- `motion-safe:animate-spin` / `motion-safe:animate-pulse` — анимации, уважающие `prefers-reduced-motion`.

### Пример доступной формы

```html
<form class="card p-4 rg-container-sm" aria-labelledby="signupTitle">
  <h2 id="signupTitle" class="h4 mb-3">Создать аккаунт</h2>

  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input
      type="email"
      id="email"
      class="form-control"
      aria-describedby="emailHelp"
      required
    />
    <div id="emailHelp" class="form-text text-muted">
      Мы никогда не передадим ваш email третьим лицам.
    </div>
  </div>

  <div class="mb-3">
    <label for="password" class="form-label">Пароль</label>
    <input
      type="password"
      id="password"
      class="form-control is-invalid"
      aria-describedby="passwordError"
      required
    />
    <div id="passwordError" class="invalid-feedback">
      Пароль должен содержать минимум 8 символов.
    </div>
  </div>

  <button type="submit" class="btn btn-primary">
    Зарегистрироваться
  </button>
</form>
```

### Глоссарий (RU → EN)

- «фокус-ловушка» → focus trap
- «читалка экрана» → screen reader
- «контраст» → contrast ratio
- «псевдокласс `focus-visible`» → `:focus-visible` pseudo-class
- «предпочтение уменьшенного движения» → `prefers-reduced-motion`

#### Form & data components (3.1.0+)

**Datepicker / Datetime picker**

- Popup-календарь открывается по фокусу/клику по полю ввода.
- Фокус остаётся на input; выбор даты делается кнопками внутри popup.
- Компонент использует нативные `<button>` и текстовые подписи для дней/месяцев.
- Рекомендуется:
  - всегда связывать поле с `<label>`;
  - описывать формат ввода в `aria-describedby` или вспомогательном тексте;
  - не блокировать возможность ручного ввода значения.

**Select / Combobox**

- `rg-select` использует `role="listbox"` и `role="option"` для пунктов.
- Клавиатура: стрелки вверх/вниз, Enter/Space для выбора, Escape для закрытия.
- `rg-combobox` использует `role="combobox"` + `aria-autocomplete="list"`.
- Рекомендуется:
  - задавать `aria-label` или `aria-labelledby` для инпута;
  - проверять порядок фокуса Tab/Shift+Tab вокруг комбобокса;
  - избегать пустых placeholder-значений для критичных полей.

**Tags input**

- Бейджи тегов реализованы через `<button>` с текстовыми подписями.
- Удаление тега — по кнопке с `aria-label="Remove tag"`.
- Рекомендуется дублировать содержимое тегов в скрытом текстовом поле/summary,
  если список тегов критичен для понимания формы.

**DataTable (MVP)**

- Сортируемые колонки помечаются `data-rg-sort`, но ответственность за
  `scope="col"`, заголовки и описания лежит на разработчике.
- Рекомендуется:
  - использовать `<caption>` с кратким описанием таблицы;
  - задавать `scope="col"` для заголовков и `scope="row"` при необходимости;
  - явно озвучивать «отсортировано по ... по возрастанию/убыванию» в текстовом
    описании или визуальном индикаторе.

В целом, новые форменные и табличные компоненты спроектированы так, чтобы
не мешать WCAG-аудиту, но финальная ответственность за доступность остаётся
на уровне продукта.


### Остальные интерактивные компоненты

#### Stepper
- `role="tablist"` на header;
- `role="tab"` / `role="tabpanel"` на шагах и панелях;
- `aria-selected`, `aria-controls`, `aria-labelledby`;
- lifecycle-события: `rg:stepper:change`, `rg:stepper:changed`.

#### Datepicker
- input получает `aria-haspopup="dialog"`, `aria-controls`, `aria-expanded`;
- popup получает `role="dialog"`, `aria-hidden`;
- grid получает `role="grid"`, day-кнопки — `role="gridcell"`, `aria-selected`;
- lifecycle/interaction events: `rg:datepicker:show|shown|hide|hidden|change|changed`.

#### Select / Combobox
- trigger/input получает `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`;
- menu получает `role="listbox"`, items — `role="option"`, `aria-selected`;
- combobox использует `role="combobox"` и `aria-activedescendant`;
- events: `rg:select:*`, `rg:combobox:*`.

#### TagsInput
- root получает `role="group"`;
- input получает `aria-label`, remove buttons — `aria-label` на удаление тега;
- events: `rg:tagsinput:add|added|remove|removed|cleared`.

#### DataTable
- search input получает `aria-label`;
- sortable headers получают `aria-sort` и keyboard focusability;
- pagination buttons получают `aria-label`, `aria-current="page"`;
- events: `rg:datatable:pagechange|pagechanged|sortchange|sortchanged`.


## Imported from `api-contract.md`

## Rarog 3.x API Contract

Rarog 3.x фиксирует стабильный публичный API фреймворка. Всё, что описано
в этом документе, считается «контрактом» между Rarog и проектами, которые
его используют.

### Слои API

1. **CSS-токены (design tokens)**

   - Цвета (`--rarog-color-*`, см. `tokens.md`).
   - Spacing (`--rarog-space-*`).
   - Radius (`--rarog-radius-*`).
   - Тени (`--rarog-shadow-*`).
   - Брейкпоинты (`--rarog-breakpoint-*`).
   - Container Queries (`--rarog-cq-*`).
   - Grid-токены (`--rarog-grid-gap-x`, `--rarog-grid-gap-y`).

   Гарантии:

   - имена токенов в этих неймспейсах стабильны в пределах ветки 3.x;
   - значения могут эволюционировать без ломки семантики (например,
     уточнение оттенка primary-600).

2. **Utility-классы**

   - Базовые группы: layout, spacing, sizing, typography, effects, scroll,
     print, RTL, grid, responsive/state-утилиты.
   - Префиксы:

     - responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`;
     - state: `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:`,
       `peer-*`, `data-[state=*]`;
     - JIT arbitrary values: `w-[...]`, `bg-[#...]`, `rounded-[...]` и др.

   Гарантии:

   - все утилиты, перечисленные в `Utilities` + `API Reference`, считаются
     стабильными;
   - новые утилиты могут добавляться, но существующие не будут переименованы
     в рамках 3.x без миграционного гайда.

3. **Компоненты**

   - Структурные классы: `.btn`, `.alert`, `.badge`, `.navbar`, `.offcanvas`,
     `.modal`, `.dropdown`, `.tabs`, `.carousel`, `.stepper` и др.
   - Варианты: `-primary`, `-secondary`, `-success`, `-danger`, `-outline`,
     `-ghost`, `-sm`, `-lg` и т.п.

   Гарантии:

   - HTML-структура, описанная в разделе `Components`, считается опорной;
   - модификаторы и вариации, указанные в документации, стабильны;
   - внутренние вспомогательные классы без документации (часто с префиксом
     `rg-` и пометкой `@internal`) не входят в контракт.

4. **JS Core**

   - Глобальный неймспейс: `Rarog.*` (UMD) и именованные ESM-экспорты.
   - Компоненты:

     - `Rarog.Modal`,
     - `Rarog.Dropdown`,
     - `Rarog.Collapse`,
     - `Rarog.Offcanvas`,
     - `Rarog.Tooltip`,
     - `Rarog.Popover`,
     - `Rarog.Toast`,
     - `Rarog.Carousel`,
     - `Rarog.Stepper`,
     - Navbar helpers и др.

   - Data-API:

     - `data-rg-toggle`, `data-rg-target`, `data-rg-dismiss`, `data-rg-placement`
       и др.

   - События:

     - `rg:modal:show`, `rg:modal:shown`, `rg:modal:hide`, `rg:modal:hidden`;
     - аналогичные события для других компонентов (`rg:dropdown:*`,
       `rg:offcanvas:*`, `rg:carousel:*`, `rg:stepper:*` и т.д.).

   Гарантии:

   - публичные методы и события, описанные в `JavaScript` и `API Reference`,
     стабильны в пределах 3.x;
   - внутренние поля/методы (обычно с `_` или пометкой `@internal`) могут
     меняться без предупреждения.

5. **Config & CLI**

   - Конфиг: `rarog.config.(ts|js|json)`:

     - `theme` (tokens), `screens`, `variants`, `plugins`, `mode` (`full`/`jit`).

   - CLI:

     - `rarog build`,
     - `rarog init`,
     - `rarog docs`.

   Гарантии:

   - формат `rarog.config.*`, описанный в docs, считается стабильным;
   - команды CLI и их основные флаги не будут ломаться в рамках 3.x.

6. **Plugin API**

   - Хуки:

     - расширение токенов (`extendTokens`),
     - добавление утилит (`extendUtilities`),
     - добавление компонентов/JS (`extendComponents`),
     - интеграционные хуки JIT/Builder.

   - Официальные плагины:

     - `@rarog/plugin-forms`,
     - `@rarog/plugin-typography`, и последующие.

   Гарантии:

   - интерфейс плагина, описанный в разделе `Plugin API`, стабилен для 3.x;
   - новые хуки могут добавляться, но существующие не будут удалены без
     миграционного гайда.

### Что не входит в контракт

- Любые нестандартные классы, не описанные в документации.
- Внутренние файлы в `packages/*/src`, помеченные как `@internal`.
- Временные экспериментальные флаги/опции, явно помеченные как experimental.

### Обновление контракта

- При всех релизах 3.x:

  - раздел `API Contract` обновляется при добавлении нового публичного API;
  - breaking changes не допускаются — для них будет выпущена ветка 4.x
    и отдельный миграционный гайд.


### Additional stable contracts

#### Datepicker / Select / Combobox

These widgets dispatch cancelable `rg:<component>:show` and `rg:<component>:hide` before a state change, followed by `rg:<component>:shown` and `rg:<component>:hidden` after DOM and ARIA state are updated. `event.detail` includes at least `instance`, `trigger`, and `target`.

#### TagsInput

`TagsInput` dispatches `rg:tags-input:add` and `rg:tags-input:remove` with `event.detail = { instance, trigger, value, values }`, followed by `rg:tags-input:change` for the final state.

#### DataTable

`DataTable` dispatches `rg:table:search`, `rg:table:sort`, and `rg:table:page` for specific actions, and always dispatches `rg:table:update` with `{ instance, search, sortKey, sortDir, page, pages, total, trigger }`.

#### Stepper

`Stepper` dispatches cancelable `rg:stepper:change` with `{ instance, fromIndex, toIndex, trigger }`, then `rg:stepper:changed` with the final index. Legacy `rg:stepper:next`, `rg:stepper:prev`, `rg:stepper:goto`, and `rg:stepper:reset` are preserved for backward compatibility.
