# Рантайм

Рантайм-поведение JS-ядра, lifecycle, события, стабильность Поверхность и практики интеграции.

## Включено устаревший sources

- `javascript.md`
- `api-reference.md`
- `stability.md`

## Imported from `javascript.md`

## JavaScript

JS-ядро Рарог v2 поставляется в виде:

- UMD-бандла: `packages/js/dist/rarog.js`
- ESM-бандла: `packages/js/dist/rarog.esm.js`

### Поддерживаемые компоненты

- `Dropdown`
- `Collapse`
- `Modal`
- `Offcanvas`
- `Toast`
- `Tooltip`
- `Popover`
- `Carousel`
- `Stepper`

---

### Data-интерфейс

Любой компонент можно инициализировать с помощью data-атрибутов:

```html
<!-- Модальное окно -->
<button class="btn btn-primary" data-rg-toggle="modal" data-rg-target="#welcomeModal">
  Открыть модалку
</button>

<!-- Offcanvas -->
<button class="btn btn-ghost" data-rg-toggle="offcanvas" data-rg-target="#mainOffcanvas">
  Открыть меню
</button>

<!-- Toast -->
<button class="btn btn-secondary" data-rg-toggle="toast" data-rg-target="#demoToast">
  Показать toast
</button>

<!-- Tooltip -->
<button
  class="btn btn-ghost"
  data-rg-toggle="tooltip"
  data-rg-title="Tooltip Rarog"
>
  Наведи на меня
</button>

<!-- Popover -->
<button
  class="btn btn-secondary"
  data-rg-toggle="popover"
  data-rg-popover-title="Заголовок"
  data-rg-popover-content="Контент popover"
>
  Кликни для popover
</button>
```

Dismiss-атрибуты:

```html
<button data-rg-dismiss="modal">Закрыть модалку</button>
<button data-rg-dismiss="offcanvas">Закрыть меню</button>
<button data-rg-dismiss="toast">Закрыть toast</button>
```

Инициализация выполняется автоматически при загрузке документа. Для SPA/SSR
и сложных сценариев можно использовать lifecycle-интерфейс JS Core v3:

```js
import { Rarog } from "../packages/js/dist/rarog.esm.js";

// базовая инициализация Data-интерфейс и tooltip/popover для всего документа
Rarog.init();

// инициализация внутри конкретного контейнера (например, после рендера React/Vue)
const root = document.getElementById("app-root");
Rarog.init(root);

// dispose / reinit
Rarog.dispose(root); // удалить tooltip/popover внутри контейнера
Rarog.reinit(root);  // пересобрать Data-интерфейс и всплывающие компоненты
```

---

### JS-интерфейс и события

Каждый компонент имеет статические методы `getInstance` / `getOrCreate`:

```js
import Rarog, { Modal, Offcanvas, Toast, Tooltip, Popover } from "../packages/js/dist/rarog.esm.js";

const modalElement = document.getElementById("welcomeModal");
const modal = Modal.getOrCreate(modalElement);
modal.show();

const offcanvasElement = document.getElementById("mainOffcanvas");
const offcanvas = Offcanvas.getOrCreate(offcanvasElement);
offcanvas.toggle();

const toastElement = document.getElementById("demoToast");
const toast = Toast.getOrCreate(toastElement);
toast.show();
```

#### События (Event интерфейс)

Рарог генерирует события в стиле Bootstrap, но с префиксом `rg:`:

- `rg:modal:show` / `rg:modal:hide`
- `rg:dropdown:show` / `rg:dropdown:hide`
- `rg:collapse:show` / `rg:collapse:hide`
- `rg:offcanvas:show` / `rg:offcanvas:hide`
- `rg:toast:show` / `rg:toast:hide`
- `rg:tooltip:show` / `rg:tooltip:hide`
- `rg:popover:show` / `rg:popover:hide`

```js
const modalEl = document.getElementById("welcomeModal");

modalEl.addEventListener("rg:modal:show", event => {
  console.log("Модалка открывается", event.detail.instance);
});

modalEl.addEventListener("rg:modal:hide", event => {
  console.log("Модалка закрывается");
});
```

Во всех событиях в `event.detail.instance` лежит JS-инстанс компонента.

---

### Destroy / dispose

Минимальный интерфейс освобождения ресурсов — через сам браузер (удаление DOM-узлов).
Если вам нужно явно удалить обработчики, можно реализовать свою обёртку, сохраняя
инстансы и вызывая `hide()` перед удалением элементов. В будущих версиях может
появиться `dispose()`-интерфейс.

### Carousel & Stepper JS-интерфейс

```js
import { Rarog } from "../packages/js/dist/rarog.esm.js";

const carouselEl = document.getElementById("heroCarousel");
const carousel = Rarog.Carousel.getOrCreate(carouselEl);

carousel.next();
carousel.prev();
carousel.goTo(2);
carousel.play();
carousel.pause();

const stepperEl = document.getElementById("signupStepper");
const stepper = Rarog.Stepper.getOrCreate(stepperEl);

stepper.next();
stepper.prev();
stepper.goTo(1);
stepper.reset();

stepperEl.addEventListener("rg:stepper:goto", event => {
  console.log("Текущий шаг:", event.detail.index);
});
```

---

### EventBus / Events

JS Core v3 добавляет простой event-bus, доступный через `Rarog.Events`:

```js
import { Rarog } from "../packages/js/dist/rarog.esm.js";

Rarog.Events.on("rg:carousel:next", payload => {
  console.log("Слайд переключился", payload);
});

// Любое событие `rg:*` пробрасывается в bus через `Events.emit`:
Rarog.Events.on("rg:modal:show", ({ element, detail }) => {
  console.log("Открылся modal", element, detail.instance);
});
```

Для включения debug-режима (логирование в консоль) достаточно выставить глобальный флаг:

```html
<script>
  window.RAROG_DEBUG = true;
</script>
```


### Debug / Devtools

Для отладки поведения компонент и событий Рарог JS Core есть debug-режим.

Варианты включения:

- через глобальные флаги (ещё до загрузки скриптов):

 ```html
  <script>
    window.RAROG_DEBUG = true;
  </script>
  <script src="/js/rarog.umd.js"></script>
  ```

- через JS-интерфейс в рантайме:

 ```js
  import Rarog from "rarog/dist/rarog.esm.js";

  Rarog.setDebug(true);
  console.log(Rarog.isDebugEnabled()); // true
  ```

Что делает debug-режим:

- логирует все `rg:*`-события через `console.log("[Rarog]", "event", type, payload)`;
- выводит предупреждения о некорректной структуре HTML/атрибутов
 (например, отсутствующий `.modal-dialog` или `.stepper-step`);
- логирует ошибки обработчиков событий в консоль как `[Rarog Events]`.

Debug-режим не должен использоваться в production-сборках; его цель — помочь
разработчику во время интеграции и настройки компонент.


### События остальных компонентов

Для оставшихся интерактивных компонентов в 3.x стабилизированы следующие семейства событий:

- `Stepper`: `rg:stepper:change`, `rg:stepper:changed`
- `Datepicker`: `rg:datepicker:show|shown|hide|hidden|change|changed`
- `Select`: `rg:select:show|shown|hide|hidden|change|changed`
- `Combobox`: `rg:combobox:show|shown|hide|hidden|change|changed`
- `TagsInput`: `rg:tagsinput:add|added|remove|removed|cleared`
- `DataTable`: `rg:datatable:pagechange|pagechanged|sortchange|sortchanged`

Во всех событиях используется тот же публичный `event.detail`-контракт: `instance`, `trigger`, `target`, а при необходимости — `index`, `key`, `value`.


## Imported from `api-reference.md`

## интерфейс Reference (Рарог 3.x)

Этот раздел фиксирует **стабильный публичный интерфейс 3.x** для CSS, компонентов и JS Core. Используйте его как быстрый справочник по именам классов, конструкторам, методам и событиям.

### JS Core

Канонический пакетный Поверхность:

- `@rarog/js`
- default выгрузка: `Rarog`
- именованные экспорты: `Dropdown`, `Collapse`, `Modal`, `Offcanvas`, `Toast`, `Tooltip`, `Popover`, `Carousel`, `Stepper`, `Datepicker`, `DatetimePicker`, `Select`, `Combobox`, `TagsInput`, `DataTable`, `InputMask`, `Events`
- type exports: `RarogEventMap`, `RarogEventName`, `RarogEventDetail<TName>`, `RarogCustomEvent<TName>`

#### Общий lifecycle contract

Для компонентов с открытием/закрытием Рарог 3.x использует единый контракт:

- pre-event: `rg:<component>:show`
- post-event: `rg:<component>:shown`
- pre-hide: `rg:<component>:hide`
- post-hide: `rg:<component>:hidden`

Где среда выполнения уже поддерживает lifecycle-контракт, pre-events считаются **cancelable** и могут использоваться с `preventDefault()` перед изменением состояния.

`event.detail` в lifecycle-событиях может содержать:

- `instance` — инстанс компонента
- `trigger` — DOM-элемент, инициировавший действие, если применимо
- `target` — основной DOM-target компонента, если применимо
- `placement` — для `Tooltip` / `Popover`
- `index`, `fromIndex`, `toIndex`, `direction` — для `Carousel`
- `value` — для `Datepicker`, `Select`, `Combobox`, `Stepper`

#### Constructors / methods

##### Всплывающий слой & disclosure

- `Dropdown.getInstance(element)` / `Dropdown.getOrCreate(element, options)`
- `Collapse.getInstance(element)` / `Collapse.getOrCreate(element, options)`
- `Modal.getInstance(element)` / `Modal.getOrCreate(element, options)`
- `Offcanvas.getInstance(element)` / `Offcanvas.getOrCreate(element, options)`
- `Toast.getInstance(element)` / `Toast.getOrCreate(element, options)`
- `Tooltip.getInstance(element)` / `Tooltip.getOrCreate(element, options)`
- `Popover.getInstance(element)` / `Popover.getOrCreate(element, options)`

Методы:

- `show()`
- `hide()`
- `toggle()` — где применимо

##### Flow & selection

- `Carousel.getInstance(element)` / `Carousel.getOrCreate(element, options)`
 - `next()`
 - `prev()`
 - `goTo(index)`
 - `play()`
 - `pause()`
 - `destroy()`
- `Stepper.getInstance(element)` / `Stepper.getOrCreate(element, options)`
 - `next()`
 - `prev()`
 - `goTo(index)`
 - `reset()`
 - `destroy()`
- `Datepicker.getInstance(element)` / `Datepicker.getOrCreate(element, options)`
 - `show()` / `hide()` / `toggle()`
 - `dispose()`
- `DatetimePicker.getInstance(element)` / `DatetimePicker.getOrCreate(element, options)`
- `Select.getInstance(element)` / `Select.getOrCreate(element, options)`
 - `show()` / `hide()` / `toggle()`
 - `dispose()`
- `Combobox.getInstance(element)` / `Combobox.getOrCreate(element, options)`
 - `show()` / `hide()` / `toggle()`
 - `dispose()`
- `TagsInput.getInstance(element)` / `TagsInput.getOrCreate(element, options)`
 - `addTag(value)`
 - `removeTag(value)`
 - `clear()`
 - `dispose()`
- `DataTable.getInstance(element)` / `DataTable.getOrCreate(element, options)`
 - `dispose()`
- `InputMask.apply(element, pattern)`
- `InputMask.remove(element)`

#### Стабильное event names

##### Выпадающее меню / Collapse / Modal / Боковая панель / Toast

- `rg:dropdown:show|shown|hide|hidden`
- `rg:collapse:show|shown|hide|hidden`
- `rg:modal:show|shown|hide|hidden`
- `rg:offcanvas:show|shown|hide|hidden`
- `rg:toast:show|shown|hide|hidden`

##### Подсказка / Всплывающий блок

- `rg:tooltip:show|shown|hide|hidden`
- `rg:popover:show|shown|hide|hidden`

Дополнительно `event.detail.placement` содержит placement popup-элемента.

##### Carousel

Lifecycle:

- `rg:carousel:slide`
- `rg:carousel:slid`

Устаревший-compatible события навигации:

- `rg:carousel:next`
- `rg:carousel:prev`
- `rg:carousel:goto`
- `rg:carousel:play`
- `rg:carousel:pause`

##### Stepper

- `rg:stepper:change`
- `rg:stepper:changed`
- `rg:stepper:next`
- `rg:stepper:prev`
- `rg:stepper:goto`
- `rg:stepper:reset`

##### Datepicker / Выбор / Combobox

- `rg:datepicker:show|shown|hide|hidden`
- `rg:datepicker:select`
- `rg:select:show|shown|hide|hidden`
- `rg:select:change`
- `rg:combobox:show|shown|hide|hidden`
- `rg:combobox:change`

Устаревший-compatible для combobox:

- `rg:combobox:open`
- `rg:combobox:close`

##### TagsПоле ввода / DataTable / Core

- `rg:tags-input:add`
- `rg:tags-input:remove`
- `rg:tags-input:change`
- `rg:table:search`
- `rg:table:sort`
- `rg:table:page`
- `rg:table:update`
- `rg:core:dispose`

#### Типизированный events in TypeScript

В `packages/js/src/index.d.ts` экспортируются:

- `RarogEventMap`
- `RarogEventName`
- `RarogEventDetail<TName>`
- `RarogCustomEvent<TName>`

Пример:

```ts
import type { RarogCustomEvent, RarogEventDetail } from "@rarog/js";

function onShown(event: RarogCustomEvent<"rg:modal:shown">) {
  const detail: RarogEventDetail<"rg:modal:shown"> = event.detail;
  console.log(detail.instance);
}
```

#### Namespace вспомогательные средства

- `Rarog.config`
- `Rarog.setDebug(value)`
- `Rarog.isDebugEnabled()`
- `Rarog.initDataApi(root?)`
- `Rarog.init(root?)`
- `Rarog.dispose(root?)`
- `Rarog.reinit(root?)`
- `Rarog.Events.on/off/emit(...)`

### CSS / Компоненты

Остальные группы интерфейс — вспомогательные классы, токены, компоненты и модификаторы — описаны в профильных разделах Документация. Ветка 3.x считает стабильными только те классы и варианты, которые явно перечислены в документации и migration guides.


## Imported from `stability.md`

## Stability Matrix

Этот документ фиксирует, что в Рарог считается **stable**, **beta** и **experimental**.

### Public Поверхность matrix

| Поверхность | Состояние | Compatibility promise |
|---|---|---|
| Core CSS | Стабильное | Не ломается в patch/minor без deprecation window. |
| Утилиты CSS | Стабильное | Имена классов и поведение меняются только через documented deprecation. |
| Компоненты CSS | Стабильное | Breaking changes только в major. |
| Built-in themes | Стабильное | Публичные theme entrypoints сохраняются в пределах major. |
| средство командной строки flow (`init`, `validate`, `build`) | Стабильное | Канонический flow поддерживается как основной DX path. |
| `rarog.config.js` | Стабильное | Основной описание темы contract. |
| `rarog.build.json` | Стабильное | Основной описание сборки contract. |
| `rarog.config.ts` | Предварительное | Поддерживается как путь совместимости. Может быть упрощён или убран в следующем major. |
| `@rarog/js` | Предварительное | интерфейс usable, но ещё расширяется. |
| `@rarog/react` | Экспериментальное | Без strong compatibility guarantees. |
| `@rarog/vue` | Экспериментальное | Без strong compatibility guarantees. |
| Интерфейс расширений | Экспериментальное | Все большие изменения идут через RFC. |

### Что значит каждый статус

#### Стабильное

Гарантии:
- SemVer обязателен;
- breaking changes только в major;
- deprecations документируются заранее;
- Документация и публикация Поверхность должны совпадать с реальностью.

#### Предварительное

Гарантии:
- Поверхность публичный, но может ещё доформировываться;
- minor-релизы могут менять детали интерфейс, если это явно задокументировано;
- при возможности даётся migration note.

#### Экспериментальное

Гарантии:
- feedback-first Поверхность;
- изменения возможны даже в minor;
- production adoption только после собственной проверки команды.

### Стабильное-by-default rules

Следующие вещи должны оставаться предсказуемыми:
- один канонический описание темы (`rarog.config.js`);
- один канонический описание сборки (`rarog.build.json`);
- root package без CSS `main`;
- `verify:artifacts` только после полной сборки;
- публикация pipeline без обхода release/test/artifact gates.

### Изменение статуса Поверхность

Поверхность можно перевести:
- из Экспериментальное в Предварительное — после smoke/compatibility gates и стабилизации Документация;
- из Предварительное в Стабильное — после как минимум одного релизного цикла без неожиданных breaking changes и с понятным публикация contract.
