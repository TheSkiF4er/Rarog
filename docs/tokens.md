# Архитектура токенов v2

Рарог v2 token model is split into four Слои so themes remain scalable instead of becoming a pile of ad-hoc CSS variables.

## Слои

1. **Raw tokens** — foundational scales such as color ramps, spacing, radius, shadows.
2. **Семантические токены** — intent-driven names like `surface`, `textMuted`, `focusRing`.
3. **Компонент tokens** — Компонент-level hooks like `button.radius` or `card.shadow`.
4. **Рантайм theme variables** — variables resolved at среда выполнения for brand, tenant, density, shape, and shadow mode.

## Resolution pipeline

```text
raw -> semantic -> component -> runtime CSS vars -> rendered component
```

### Pipeline rules

- raw tokens never reference Компонент names
- semantic tokens can reference raw scales
- Компонент tokens reference semantic/runtime tokens
- среда выполнения variables are the last override layer and can be scoped per tenant

## Рантайм scales

Рарог v2 standardizes three среда выполнения scales:

- `density`: compact / comfortable / spacious
- `shape`: sharp / soft / rounded
- `shadow`: subtle / balanced / dramatic

## Inheritance model

A manifest темы can declare `extends` and only override the semantic/component/runtime pieces it needs. This makes multi-brand and под стороннюю марку setups predictable.

## Where it живойs

- `rarog.tokens.json`
- `packages/themes/presets/*.json`
- `packages/themes/src/*.css`
- `examples/playground/` token browser and theme среда выполнения demo
