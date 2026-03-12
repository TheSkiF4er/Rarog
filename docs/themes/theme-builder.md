# Theme builder / token editor

Theme builder turns token editing into a product surface for white-label teams.

## What ships

- visual token editor
- live theme preview
- side-by-side compare themes
- export/import theme JSON
- export build manifest
- accessibility preview for critical text/background pairs
- density / radius / shadow controls

## Browser demo

Open:

```text
examples/ui-kits/white-label-demo/index.html
```

Use it for:

1. tenant brand onboarding
2. product marketing review
3. accessibility sign-off
4. exporting a starter manifest for implementation teams

## Export outputs

The builder exports two JSON artifacts:

- a theme manifest compatible with `rarog theme diff`
- a build manifest starter for project handoff

## Recommended workflow

```bash
rarog theme diff packages/themes/presets/enterprise-plus.json my-theme.json
rarog token inspect rarog.tokens.json --path=tokens.color.semantic
rarog audit a11y examples/ui-kits/white-label-demo
```

## White-label handoff checklist

- confirm primary / secondary colors
- confirm contrast targets
- compare against enterprise baseline
- export theme JSON
- export build manifest
- commit alongside tenant docs
