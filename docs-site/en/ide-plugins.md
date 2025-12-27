# IDE & Plugins

Covers:

- VSCode extension (auto-complete for Rarog classes, links to docs);
- how the class dictionary is generated from tokens + API Reference;
- Plugin API v1:

  - how to write a custom plugin,
  - lifecycle hooks and best practices.

See also the Russian version for more narrative explanations.

## Rarog LSP Server (3.2.0+)

Starting from 3.2.0, Rarog ships a small LSP server that can be used from any
editor with LSP support.

- entry: `node tools/lsp/rarog-lsp.js --stdio`
- features:
  - class name completion (`rg-*`, `btn-*`, `bg-*`, `text-*`, variants);
  - token completion (`primary-500`, `space-4`, `radius-md`, `shadow-lg`);
  - hover documentation with short description and docs link;
  - basic `rarog.config.*` validation (same logic as `rarog validate`).

It can be wired into VSCode, WebStorm, Neovim etc. using the standard LSP
client configuration.

## CLI DX: rarog validate

3.2.0 adds a `rarog validate` command:

```bash
npx rarog validate
```

It checks `rarog.config.*` for common mistakes (screens, plugins, theme structure)
and returns a non‑zero exit code on errors, so it can be used in CI.
