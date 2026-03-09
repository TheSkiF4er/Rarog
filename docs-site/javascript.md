# JavaScript

JS-ядро Rarog v2 поставляется в виде:

- UMD-бандла: `packages/js/dist/rarog.js`
- ESM-бандла: `packages/js/dist/rarog.esm.js`

## Поддерживаемые компоненты

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

## Data-API

Любой компонент можно инициализировать с помощью data-атрибутов:

```html
<!-- Modal -->
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
и сложных сценариев можно использовать lifecycle-API JS Core v3:

```js
import { Rarog } from "../packages/js/dist/rarog.esm.js";

// базовая инициализация Data-API и tooltip/popover для всего документа
Rarog.init();

// инициализация внутри конкретного контейнера (например, после рендера React/Vue)
const root = document.getElementById("app-root");
Rarog.init(root);

// dispose / reinit
Rarog.dispose(root); // удалить tooltip/popover внутри контейнера
Rarog.reinit(root);  // пересобрать Data-API и всплывающие компоненты
```

---

## JS-API и события

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

### События (Event API)

Публичный lifecycle-контракт в Rarog 3.x унифицирован:

- `rg:<component>:show` — до открытия, **cancelable**;
- `rg:<component>:shown` — после открытия;
- `rg:<component>:hide` — до закрытия, **cancelable**;
- `rg:<component>:hidden` — после закрытия.

Этот контракт действует для:

- `modal`
- `dropdown`
- `collapse`
- `offcanvas`
- `toast`
- `tooltip`
- `popover`

Для carousel используются события перехода:

- `rg:carousel:slide` — до смены слайда, **cancelable**;
- `rg:carousel:slid` — после смены;
- legacy `rg:carousel:next`, `rg:carousel:prev`, `rg:carousel:goto` остаются доступными после `slid`.

```js
const modalEl = document.getElementById("welcomeModal");

modalEl.addEventListener("rg:modal:show", event => {
  if (!window.userCanOpenModal) {
    event.preventDefault();
  }
});

modalEl.addEventListener("rg:modal:shown", event => {
  console.log("Modal opened", event.detail.instance);
});

modalEl.addEventListener("rg:modal:hidden", event => {
  console.log("Modal closed", event.detail.target);
});
```

Во всех lifecycle-событиях `event.detail` стабилен и содержит:

- `instance`
- `trigger`
- `target`
- `placement` для `Tooltip` / `Popover`
- `index`, `fromIndex`, `toIndex`, `direction` для `Carousel`


---

## Destroy / dispose

Минимальный интерфейс освобождения ресурсов — через сам браузер (удаление DOM-узлов).
Если вам нужно явно удалить обработчики, можно реализовать свою обёртку, сохраняя
инстансы и вызывая `hide()` перед удалением элементов. В будущих версиях может
появиться `dispose()`-API.

## Carousel & Stepper JS-API

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

## EventBus / Events

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


## Debug / Devtools

Для отладки поведения компонент и событий Rarog JS Core есть debug-режим.

Варианты включения:

- через глобальные флаги (ещё до загрузки скриптов):

  ```html
  <script>
    window.RAROG_DEBUG = true;
  </script>
  <script src="/js/rarog.umd.js"></script>
  ```

- через JS-API в рантайме:

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
