# Vue adapter v1

`@rarog/vue` provides Vue 3 and Nuxt-friendly wrappers around Rarog primitives and `@rarog/js`.

## What is included

- plugin install path for app-wide registration
- core wrapped components for forms, feedback and layout
- overlay wrappers for modal, offcanvas, dropdown and tooltip
- composable helpers for direct instance access
- Nuxt starter example

## Recommended usage

```ts
import RarogPlugin from "@rarog/vue";
```

Register the plugin once, then use `<RarogProvider>` at the shell level.

## Component coverage

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

## Nuxt notes

The adapter defers DOM work until mounted, so SSR output stays stable and client activation is predictable.

## Examples

- `examples/starters/nuxt-rarog`
