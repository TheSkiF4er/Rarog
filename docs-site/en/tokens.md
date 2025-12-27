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
