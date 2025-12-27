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
