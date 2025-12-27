# Accessibility

Rarog стремится быть безопасным и предсказуемым в доступных интерфейсах, но не
берёт на себя всю работу за разработчика. Этот раздел фиксирует, что именно
гарантируется ядром, а что остаётся на стороне продукта.

## Общие принципы

- Используйте семантическую разметку HTML (button, nav, header, main, form).
- Не полагайтесь только на цвет — используйте текст, иконки, состояние.
- Следите за контрастом: ориентир — WCAG AA для текста и элементов управления.
- Проверяйте клавиатурную навигацию: Tab/Shift+Tab, Enter/Space, Escape.
- Учитывайте `prefers-reduced-motion` и другие user preferences.

## Чек-лист по компонентам

### Modal

Гарантирует:

- блокировку скролла `body` при открытии;
- фокус-ловушку: Tab/Shift+Tab остаются внутри модального окна;
- возврат фокуса на исходный элемент при закрытии;
- ARIA-атрибуты на контейнере (`role="dialog"`, `aria-modal="true"`).

Рекомендуется:

- задавать `aria-labelledby`/`aria-describedby` на модальном контейнере;
- использовать настоящие `<button>` для кнопок закрытия/действий.

### Dropdown

Гарантирует:

- переключение видимости по клику;
- управление через `data-rg-toggle="dropdown"` и `data-rg-target`.

Рекомендуется:

- добавлять `aria-haspopup="menu"` и `aria-expanded="true/false"` на триггер;
- использовать список (`<ul role="menu">`) и элементы (`<li role="menuitem">`).

### Offcanvas

Гарантирует:

- блокировку скролла `body` при открытии;
- закрытие по клику на backdrop и по Escape.

Рекомендуется:

- указывать `role="dialog"` и `aria-modal="true"` на offcanvas;
- использовать логическую структуру: заголовок, контент, actions.

### Tooltip & Popover

Гарантирует:

- создание/удаление DOM-элементов tooltip/popover;
- привязку к триггеру через data-атрибуты.

Рекомендуется:

- связывать триггер и подсказку через `aria-describedby`;
- не использовать tooltip как единственный источник важной информации.

### Navbar & Tabs

Navbar:

- используйте `<nav>` и `aria-label` для основного меню;
- для sticky-вариантов (`.navbar-sticky`) следите за порядком фокуса.

Tabs (`.nav-tabs`):

- рекомендуется использовать роли:
  - `role="tablist"` на контейнере вкладок;
  - `role="tab"` на ссылках;
  - `role="tabpanel"` на контенте + `aria-labelledby`.

### Carousel

Гарантирует:

- переключение слайдов и классов `.is-active`;
- управление через `Rarog.Carousel.getOrCreate(el)`;
- события `rg:carousel:*` для реакции приложения.

Рекомендуется:

- добавить `role="region"` и `aria-roledescription="carousel"` на контейнер;
- использовать `aria-label` для описания назначения карусели;
- помечать слайды `aria-hidden="true/false"` (Rarog делает это автоматически).

### Stepper / Wizard

Гарантирует:

- переключение активных шагов и контента;
- `aria-current="step"` на активном шаге.

Рекомендуется:

- использовать чёткие текстовые label’ы шагов;
- озвучивать ошибки/валидацию внутри шагов через `aria-describedby`.

## A11y-утилиты

Дополнительные утилиты для доступности:

- `sr-only` — скрыть элемент визуально, оставить для screen reader;
- `not-sr-only` — вернуть элемент в обычный поток;
- `focus-ring` — заметное outline-обрамление для активного элемента;
- `focus-outline-none` — убрать outline (использовать только при наличии альтернативы);
- `motion-safe:animate-spin` / `motion-safe:animate-pulse` — анимации, уважающие `prefers-reduced-motion`.

## Пример доступной формы

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

## Глоссарий (RU → EN)

- «фокус-ловушка» → focus trap
- «читалка экрана» → screen reader
- «контраст» → contrast ratio
- «псевдокласс `focus-visible`» → `:focus-visible` pseudo-class
- «предпочтение уменьшенного движения» → `prefers-reduced-motion`

### Form & data components (3.1.0+)

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
