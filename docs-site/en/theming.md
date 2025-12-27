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
