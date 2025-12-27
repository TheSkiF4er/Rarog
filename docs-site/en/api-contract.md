# Rarog 3.x API Contract

Rarog 3.x defines a stable public API. Everything listed here is considered
a contract between Rarog and the projects that depend on it.

## API layers

1. **CSS design tokens**

   - Colors (`--rarog-color-*`),
   - spacing (`--rarog-space-*`),
   - radius (`--rarog-radius-*`),
   - shadows (`--rarog-shadow-*`),
   - breakpoints (`--rarog-breakpoint-*`),
   - container queries (`--rarog-cq-*`),
   - grid tokens (`--rarog-grid-gap-x`, `--rarog-grid-gap-y`).

   Guarantees:

   - token names in these namespaces are stable within 3.x;
   - values may evolve without breaking semantics.

2. **Utility classes**

   - Layout, spacing, sizing, typography, effects, scroll, print, RTL, grid.
   - Prefixes:

     - responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`;
     - state: `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:`,
       `peer-*`, `data-[state=*]`;
     - arbitrary values: `w-[...]`, `bg-[#...]`, `rounded-[...]`, etc.

   Guarantees:

   - all utilities documented in `Utilities` + `API Reference` are stable;
   - new utilities can be added; existing ones will not be renamed in 3.x
     without a migration guide.

3. **Components**

   - Structural classes: `.btn`, `.alert`, `.badge`, `.navbar`, `.offcanvas`,
     `.modal`, `.dropdown`, `.tabs`, `.carousel`, `.stepper`, etc.
   - Variants: `-primary`, `-secondary`, `-success`, `-danger`, `-outline`,
     `-ghost`, `-sm`, `-lg`, etc.

   Guarantees:

   - the HTML structure documented in `Components` is the canonical one;
   - modifiers/variants listed in docs are stable;
   - internal helper classes not documented are not part of the contract.

4. **JS Core**

   - Global namespace: `Rarog.*` (UMD) and named ESM exports.
   - Components:

     - `Rarog.Modal`, `Rarog.Dropdown`, `Rarog.Collapse`,
       `Rarog.Offcanvas`, `Rarog.Tooltip`, `Rarog.Popover`,
       `Rarog.Toast`, `Rarog.Carousel`, `Rarog.Stepper`, etc.

   - Data-API:

     - `data-rg-toggle`, `data-rg-target`, `data-rg-dismiss`, `data-rg-placement`, ...

   - Events:

     - `rg:modal:show|shown|hide|hidden`,
     - similar events for other components (`rg:dropdown:*`,
       `rg:offcanvas:*`, `rg:carousel:*`, `rg:stepper:*`, ...).

   Guarantees:

   - public methods/events documented in `JavaScript` + `API Reference`
     are stable for 3.x;
   - internal fields/methods (usually with `_` or `@internal`) may change
     at any time.

5. **Config & CLI**

   - Config: `rarog.config.(ts|js|json)`:

     - `theme`, `screens`, `variants`, `plugins`, `mode` (`full`/`jit`).

   - CLI:

     - `rarog build`,
     - `rarog init`,
     - `rarog docs`.

   Guarantees:

   - the documented shape of `rarog.config.*` is stable for 3.x;
   - core CLI commands and main flags will not break within 3.x.

6. **Plugin API**

   - Hooks:

     - token extension (`extendTokens`),
     - utilities (`extendUtilities`),
     - components/JS (`extendComponents`),
     - JIT/builder integration hooks.

   - Official plugins:

     - `@rarog/plugin-forms`,
     - `@rarog/plugin-typography`, etc.

   Guarantees:

   - the Plugin API documented in `IDE & Plugins` / `Plugin API` is stable
     for 3.x;
   - new hooks can be added, existing ones will not be removed without
     a migration guide.

## Out of contract

- Any undocumented classes or internal helpers.
- Internal files marked as `@internal`.
- Clearly experimental options/flags.

## Contract evolution

- For all 3.x releases:

  - this document is updated when new public API is added;
  - breaking changes will only appear in 4.x with a dedicated migration guide.
