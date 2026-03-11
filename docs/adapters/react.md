# React adapter v1

`@rarog/react` gives a typed, SSR-safe wrapper layer above Rarog CSS and `@rarog/js`.

## What is included

- wrapped primitives for form/input/layout feedback
- overlay wrappers for modal, offcanvas, dropdown, tooltip
- controlled/uncontrolled APIs for `RarogSwitch`, `RarogTabs`, `RarogAccordion`, overlays
- starter examples for Vite and Next.js

## Recommended usage

```tsx
import {
  RarogProvider,
  RarogButton,
  RarogCard,
  RarogModal,
  RarogTabs
} from "@rarog/react";
```

Use `RarogProvider` near the app shell so dynamic nodes can be re-initialized safely after route transitions.

## Wrapped components

- Button
- Input
- Textarea
- SelectField
- Checkbox
- Radio
- Switch
- Card
- Alert
- Badge
- Spinner
- Skeleton
- Tabs
- Accordion
- Tooltip
- Modal
- Offcanvas
- Dropdown

## SSR notes

All DOM-bound work is guarded behind runtime checks. The adapter renders markup on the server and activates JS-only behavior on the client.

## Examples

- `examples/starters/vite-react`
- `examples/starters/nextjs-rarog`
