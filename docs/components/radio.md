# Радиокнопка

Mutually exclusive choices using shared `name`.

## CSS API

- Base selector: `.radio`
- Theming hooks: `--rarog-color-*`, `--rarog-radius-*`, `--rarog-shadow-*`, focus ring variables
- Reduced motion: respected via shared component-pack rules

## Accessibility behavior

- Semantic HTML first
- Visible `:focus-visible` ring
- ARIA hooks where interaction requires it
- Contrast-safe default tokens

## Example

```html
<div class="card">
  <div class="card-header">Radio</div>
  <div class="card-body">Refer to the component pack example in `stories/components/PackV1.stories.js` and `tests/visual/fixtures/components-v1.html`.</div>
</div>
```

## Visual test coverage

Covered by `tests/visual/fixtures/components-v1.html`.
