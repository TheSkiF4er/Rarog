# Theming & Design Tokens

Rarog uses CSS variables + a JSON token file (`rarog.tokens.json`)
to define:

- color palettes (`primary`, `secondary`, `success`, `danger`, ...),
- spacing scales,
- radius, shadows,
- breakpoints and container query tokens.

You can:

- override variables in your own theme file,
- or generate a new token set via `rarog.config.*` and `rarog build`.

See the Russian docs and `Tokens` page for detailed token structure.

## Theme packs (3.3.0+)

Starting with 3.3.0, Rarog ships preconfigured theme packs in addition to the
base themes (`default`, `dark`, `contrast`):

- `.theme-enterprise` — calm B2B palette for dashboards and internal tools.
- `.theme-creative` — more vivid palette for marketing / promo / side projects.

They are implemented as separate CSS files in `packages/themes`:

- `rarog-theme-default.css`
- `rarog-theme-dark.css`
- `rarog-theme-contrast.css`
- `rarog-theme-enterprise.css`
- `rarog-theme-creative.css`

Example usage on the `<html>` element:

```html
<html class="theme-enterprise">
  <head>
    <link rel="stylesheet" href="/css/rarog-core.css">
    <link rel="stylesheet" href="/css/rarog-utilities.css">
    <link rel="stylesheet" href="/css/rarog-components.css">
    <link rel="stylesheet" href="/css/rarog-theme-enterprise.css">
  </head>
  ...
</html>
```

Themes override semantic variables:

- `--rarog-color-bg`, `--rarog-color-bg-soft`, `--rarog-color-bg-elevated-*`
- `--rarog-color-surface`
- `--rarog-color-border-*`
- `--rarog-color-text`, `--rarog-color-text-muted`
- `--rarog-color-focus-ring`, `--rarog-color-accent-soft`

so that all components / utilities automatically pick up the new look.

## Semantic vs raw tokens

`rarog.tokens.json` now separates:

- **raw scales** (`tokens.color.primary.*`, `tokens.spacing.*`, `tokens.radius.*`);
- **semantics** (`tokens.color.semantic.*`, `tokens.semantic.*`);
- **themes** (`tokens.themes.default/dark/contrast/enterprise/creative`).

This structure matches common design token tooling and makes it easier to sync
your design system across Figma and code.
