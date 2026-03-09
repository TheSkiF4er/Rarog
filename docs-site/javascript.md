# JavaScript

Rarog включает vanilla JS-ядро для интерактивных компонентов. На текущем этапе в репозитории поддерживается **исходный ESM entrypoint**:

- `packages/js/src/rarog.esm.js`

Отдельный автоматически публикуемый JS-бандл в репозитории пока не является стабильным контрактом, поэтому в примерах ниже используется исходный ESM-файл.

## Поддерживаемые компоненты

В текущем исходнике присутствуют:
- `Dropdown`
- `Collapse`
- `Modal`
- `Offcanvas`
- `Toast`
- `Tooltip`
- `Popover`
- `Carousel`
- `Stepper`
- `DataTable`

## Data API

Любой компонент можно инициализировать через data-атрибуты:

```html
<button class="btn btn-primary" data-rg-toggle="modal" data-rg-target="#welcomeModal">
  Открыть модалку
</button>

<button class="btn btn-ghost" data-rg-toggle="offcanvas" data-rg-target="#mainOffcanvas">
  Открыть меню
</button>

<button class="btn btn-secondary" data-rg-toggle="toast" data-rg-target="#demoToast">
  Показать toast
</button>
```

Dismiss-атрибуты:

```html
<button data-rg-dismiss="modal">Закрыть модалку</button>
<button data-rg-dismiss="offcanvas">Закрыть меню</button>
<button data-rg-dismiss="toast">Закрыть toast</button>
```

## Импорт в dev-сценарии

Если вы работаете прямо внутри репозитория или подключаете исходник через bundler:

```js
import Rarog, { Modal, Offcanvas, Toast, Tooltip, Popover } from "../packages/js/src/rarog.esm.js";

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

## Lifecycle API

Для повторной инициализации после динамического рендера доступны:

```js
import { Rarog } from "../packages/js/src/rarog.esm.js";

Rarog.init();

const root = document.getElementById("app-root");
Rarog.init(root);
Rarog.dispose(root);
Rarog.reinit(root);
```

### Destroy / Dispose contract

Все стабильные JS-инстансы поддерживают оба алиаса:

```js
const modal = Rarog.Modal.getOrCreate(document.getElementById("welcomeModal"));

modal.dispose();
// или
modal.destroy();
```

Контракт cleanup:
- вызов идемпотентен и безопасен при повторном выполнении;
- снимаются обработчики событий и таймеры;
- временные overlay-элементы (`.tooltip`, `.popover`, backdrop) удаляются;
- инстанс удаляется из внутреннего registry, поэтому `getInstance(...)` возвращает `null`;
- `Rarog.dispose(root)` массово вызывает teardown для зарегистрированных инстансов внутри переданного subtree.

## Event API

Rarog генерирует события с префиксом `rg:`.

Примеры:
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

modalEl.addEventListener("rg:modal:hide", () => {
  console.log("Модалка закрывается");
});
```

## Debug

Для отладки можно включить глобальный флаг до загрузки скриптов:

```html
<script>
  window.RAROG_DEBUG = true;
</script>
```

Либо включить debug через API:

```js
import Rarog from "../packages/js/src/rarog.esm.js";

Rarog.setDebug(true);
```

## Практическое ограничение

Сейчас этот JS-слой стоит рассматривать как **исходный runtime в рамках репозитория**, а не как полностью стабилизированный внешний publish-target. Для npm/CDN-дистрибуции ему нужен отдельный сборочный контур.
