# Components (overview)

This page lists the main Rarog components and links to detailed docs:

- Buttons, badges, alerts.
- Navbars, tabs, dropdowns.
- Modals, offcanvas, toasts, tooltips/popovers.
- Grid & layout helpers.
- Advanced components: carousel, stepper, data-heavy patterns.

Use the Russian docs as a more narrative reference if needed — the goal
for EN is to keep the API surface clear and discoverable.

## Advanced form components (3.1.0)

Rarog 3.1.0 ships an initial set of richer form components on top of the base
`form-control` layer:

- `rg-datepicker` / `rg-datetime-picker` — popup calendar driven by data-API.
- `rg-select` — custom select with single/multiple modes and keyboard support.
- `rg-combobox` — text input with listbox and client-side filtering.
- `rg-tags-input` — tag entry component (Enter/comma to add, Backspace to remove).
- `DataTable` (MVP) — sorting, search and optional client-side pagination.

All of these components are wired into `Rarog.initDataApi()` so they can be used
without manual JS bootstrapping in typical CRUD/admin interfaces.
