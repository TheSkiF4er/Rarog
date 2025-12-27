# JavaScript

JS-ядро Rarog поставляется в виде:

- UMD-бандла: `packages/js/dist/rarog.js`
- ESM-бандла: `packages/js/dist/rarog.esm.js`

Поддерживаемые компоненты:

- `Dropdown`
- `Collapse`
- `Modal`

## Data-API

```html
<button
  class="btn btn-secondary"
  data-rg-toggle="dropdown"
  data-rg-target="#userMenu">
  Пользователь
</button>

<div id="userMenu" class="dropdown-menu" hidden>
  <a class="dropdown-item" href="#">Профиль</a>
  <a class="dropdown-item" href="#">Настройки</a>
</div>
```

## JS-API

```js
import Rarog, { Modal } from "../packages/js/dist/rarog.esm.js";

const el = document.getElementById("welcomeModal");
const modal = Modal.getOrCreate(el);
modal.show();
```

