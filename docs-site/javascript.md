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

Инициализация выполняется автоматически при загрузке документа. При необходимости
можно переинициализировать Data-API вручную:

```js
import { initDataApi } from "../packages/js/dist/rarog.esm.js";

initDataApi(document);
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

Rarog генерирует события в стиле Bootstrap, но с префиксом `rg:`:

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

## Destroy / dispose

Минимальный интерфейс освобождения ресурсов — через сам браузер (удаление DOM-узлов).
Если вам нужно явно удалить обработчики, можно реализовать свою обёртку, сохраняя
инстансы и вызывая `hide()` перед удалением элементов. В будущих версиях может
появиться `dispose()`-API.
