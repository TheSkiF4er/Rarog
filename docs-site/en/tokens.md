# Design Tokens

Rarog exposes its design system through CSS variables and a JSON token file
(`rarog.tokens.json`).

## Categories

- Colors (`--rarog-color-*` + semantic aliases).
- Spacing (`--rarog-space-*`).
- Radius (`--rarog-radius-*`).
- Shadows (`--rarog-shadow-*`).
- Typography (font sizes, line heights, font weights).

You can customize tokens via `rarog.config.*` and rebuild the CSS using the CLI.

```js
// rarog.config.js
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#6366f1'
        }
      }
    }
  }
}
```

Rarog CLI will merge your changes into the token set and regenerate CSS variables.

## Token pipeline v2 (3.3.0+)

In 3.3.0 the token file structure was refined for proper design‑system workflows:

- `tokens.color.*` — raw color scales (primary, secondary, success, danger, info…);
- `tokens.spacing`, `tokens.radius`, `tokens.shadow`, `tokens.layout` — atomic scales;
- `tokens.color.semantic` and `tokens.semantic` — semantic tokens (backgrounds, text, borders);
- `tokens.themes.*` — theme presets (`default`, `dark`, `contrast`, `enterprise`, `creative`)
  that each define a semantic palette.

The Figma export is based on the same structure:

- `design/figma.tokens.json` contains raw + semantic tokens and theme variants;
- the Figma kit (`design/figma-kit/`) uses these tokens as the single source of truth.

Suggested flow:
1. Adjust tokens in `rarog.config.*`.
2. Run `npx rarog build` to regenerate CSS and `rarog.tokens.json`.
3. Update `design/figma.tokens.json` via the same pipeline.
4. Sync tokens into Figma using Tokens Studio or similar tooling.
