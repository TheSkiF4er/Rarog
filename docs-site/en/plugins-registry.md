# Rarog Plugin Registry

Starting with 3.x, Rarog grows an ecosystem of plugins.

## Official plugins

- `@rarog/plugin-forms` — extra form utilities and patterns.
- `@rarog/plugin-typography` — extended typography for content-heavy pages.
- Potential future packages: `@rarog/plugin-animations`, `@rarog/plugin-ecommerce`,
  `@rarog/plugin-email`, etc.

Each plugin may:

- extend tokens (`theme.extend.*`),
- add utilities,
- register component patterns (CSS/JS).

## Registry format (MVP)

The `plugins/registry.json` file contains a list of official and community plugins:

```jsonc
{
  "official": [
    {
      "name": "@rarog/plugin-forms",
      "description": "Form utilities and patterns on top of Rarog.",
      "since": "2.4.0"
    },
    {
      "name": "@rarog/plugin-typography",
      "description": "Typography for articles, docs, blogs.",
      "since": "2.4.0"
    }
  ],
  "community": []
}
```

This file can be consumed by tooling scripts, docs generators and external catalogs.

## How to publish a plugin

1. Create an npm package (preferably under the `@rarog/` scope or with a `rarog-` prefix).
2. Declare supported Rarog versions and your own SemVer policy.
3. Provide tests (unit/integration) and documentation.
4. Open a PR to the main repo updating `plugins/registry.json` and adding a short write-up.

The Rarog Team may mark plugins as:

- **official** — maintained by the core team,
- **community** — maintained by external authors,
- **deprecated** — not recommended for new projects.
