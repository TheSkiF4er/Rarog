# JavaScript Core

Rarog ships a vanilla JS core with:

- UMD bundle (`rarog.js`) exposing `window.Rarog`.
- ESM build for modern bundlers.

Covered components:

- Modal, Dropdown, Collapse, Offcanvas.
- Toasts, Tooltips, Popovers.
- Carousel, Stepper.
- Navbar helpers.

Each component exposes:

- Data-API (`data-rg-toggle`, `data-rg-target`, ...).
- JS API (`Rarog.Modal.getOrCreate(element)`).
- Events (`rg:modal:show`, `rg:modal:shown`, ...).

See also:

- `API Contract` for the list of stable methods/events.


## SPA/SSR integration

Rarog JS Core is designed to work in SPA and SSR frameworks:

- global initialization via `Rarog.init()`;
- container‑scoped initialization via `Rarog.init(root)`;
- safe reinitialization via `Rarog.reinit(root)`;
- cleanup of tooltips/popovers and other ephemeral elements via `Rarog.dispose(root)`.

For React/Vue there are wrappers:

- `@rarog/react` — `<RarogProvider>` and helpers (`RarogModal`, `RarogOffcanvas`);
- `@rarog/vue` — `<RarogProvider>` and Vue wrappers.

Recommended pattern:

- initialize Rarog in the root layout;
- for dynamically mounted/unmounted widgets use `Rarog.init`/`Rarog.dispose` on their DOM container.


## Debug / Devtools

Rarog JS Core ships with a lightweight debug mode.

How to enable:

- via global flags (before loading scripts):

  ```html
  <script>
    window.RAROG_DEBUG = true;
  </script>
  <script src="/js/rarog.umd.js"></script>
  ```

- via JS API at runtime:

  ```js
  import Rarog from "rarog-css/dist/rarog.esm.js";

  Rarog.setDebug(true);
  console.log(Rarog.isDebugEnabled()); // true
  ```

What debug mode does:

- logs all `rg:*` events as `console.log("[Rarog]", "event", type, payload)`;
- prints warnings about invalid HTML structure/attributes;
- reports handler errors as `[Rarog Events]` in the console.

Do not enable debug mode in production builds — it is meant as a developer aid.
