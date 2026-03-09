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

Rarog использует единый префикс `rg:` и общий lifecycle-контракт для overlay/interactive-компонентов.

#### Базовый lifecycle

Для `Modal`, `Dropdown`, `Offcanvas`, `Toast`, `Tooltip`, `Popover`, `Collapse` действуют одинаковые правила:

- `rg:<component>:show` — до показа, **cancelable**;
- `rg:<component>:shown` — после показа;
- `rg:<component>:hide` — до скрытия, **cancelable**;
- `rg:<component>:hidden` — после скрытия.

Для `Carousel` lifecycle перехода отдельный:

- `rg:carousel:slide` — до смены слайда, **cancelable**;
- `rg:carousel:slid` — после смены слайда.

Во всех событиях в `event.detail.instance` лежит JS-инстанс компонента.

#### Компонентный контракт

- `Collapse`
  - события: `rg:collapse:show`, `rg:collapse:shown`, `rg:collapse:hide`, `rg:collapse:hidden`
  - `event.detail` содержит `instance`, `trigger`, `target`
- `Toast`
  - события: `rg:toast:show`, `rg:toast:shown`, `rg:toast:hide`, `rg:toast:hidden`
  - `event.detail` содержит `instance`, `trigger`, `target`
- `Tooltip`
  - события: `rg:tooltip:show`, `rg:tooltip:shown`, `rg:tooltip:hide`, `rg:tooltip:hidden`
  - `event.detail` содержит `instance`, `trigger`, `target`, `placement`
- `Popover`
  - события: `rg:popover:show`, `rg:popover:shown`, `rg:popover:hide`, `rg:popover:hidden`
  - `event.detail` содержит `instance`, `trigger`, `target`, `placement`

#### Порядок событий

Порядок всегда один и тот же:

1. вызывается публичный метод (`show()`, `hide()`, `toggle()`, `goTo()`);
2. dispatch pre-event (`show` / `hide` / `slide`);
3. если `event.preventDefault()` не был вызван — меняется DOM/состояние;
4. dispatch post-event (`shown` / `hidden` / `slid`).

```js
const toastEl = document.getElementById("demoToast");

toastEl.addEventListener("rg:toast:show", event => {
  console.log("Toast сейчас будет показан", event.detail.instance);
  // event.preventDefault();
});

toastEl.addEventListener("rg:toast:shown", event => {
  console.log("Toast уже показан", event.detail.target);
});
```

```js
const popoverTrigger = document.querySelector('[data-rg-toggle="popover"]');

popoverTrigger.addEventListener("rg:popover:hide", event => {
  console.log("Popover закрывается", event.detail.placement);
});
```

#### Гарантии стабильности

В ветке 3.x следующие имена событий считаются частью стабильного публичного API:

- `rg:collapse:*`
- `rg:toast:*`
- `rg:tooltip:*`
- `rg:popover:*`
- `rg:modal:*`
- `rg:dropdown:*`
- `rg:offcanvas:*`
- `rg:carousel:slide`, `rg:carousel:slid`

Legacy-события вроде `rg:carousel:next|prev|goto` могут продолжать приходить ради обратной совместимости, но для нового кода следует ориентироваться именно на lifecycle-события.

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
