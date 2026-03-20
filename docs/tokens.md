# Token architecture v2

Rarog v2 token model is split into four layers so themes remain scalable instead of becoming a pile of ad-hoc CSS variables.

## Layers

1. **Raw tokens** — foundational scales such as color ramps, spacing, radius, shadows.
2. **Семантические токены** — intent-driven names like `surface`, `textMuted`, `focusRing`.
3. **Component tokens** — component-level hooks like `button.radius` or `card.shadow`.
4. **Рантайм theme variables** — variables resolved at runtime for brand, tenant, density, shape, and shadow mode.

## Resolution pipeline

```text
raw -> semantic -> component -> runtime CSS vars -> rendered component
```

### Pipeline rules

- raw tokens never reference component names
- semantic tokens can reference raw scales
- component tokens reference semantic/runtime tokens
- runtime variables are the last override layer and can be scoped per tenant

## Рантайм scales

Rarog v2 standardizes three runtime scales:

- `density`: compact / comfortable / spacious
- `shape`: sharp / soft / rounded
- `shadow`: subtle / balanced / dramatic

## Inheritance model

A manifest темы can declare `extends` and only override the semantic/component/runtime pieces it needs. This makes multi-brand and white-label setups predictable.

## Where it живойs

- `rarog.tokens.json`
- `packages/themes/presets/*.json`
- `packages/themes/src/*.css`
- `examples/playground/` token browser and theme runtime demo
