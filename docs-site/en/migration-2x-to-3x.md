# Migrating from Rarog 2.x to 3.0.0

Rarog 3.0.0 is an evolution of 2.x, not a rewrite. The main goals:

- freeze the public API as **3.x API Contract**;
- add container queries & modern layout helpers;
- provide full RU/EN docs and docs versioning.

For most projects migration is straightforward.

## 1. Upgrade the package

```bash
npm install rarog-css@^3.0.0
# or
pnpm add rarog-css@^3.0.0
```

Make sure:

- `package.json` contains `"rarog-css": "^3.0.0"`;
- you ship the new `rarog.css` / `rarog-*.css` and `rarog.js`.

## 2. Config & CLI

`rarog.config.*` for 3.0.0 keeps the same shape as in 2.x:

- `theme`, `screens`, `variants`, `plugins`, `mode`.

If you have custom plugins:

- ensure they rely on the documented Plugin API, not internal structures.

## 3. Container Queries & modern layout (optional)

New in 3.0.0:

- tokens: `--rarog-cq-sm`, `--rarog-cq-md`, `--rarog-cq-lg`;
- helpers:

  - `.rg-cq` — `container-type: inline-size`;
  - `.rg-cq-page` — page-level container (`container-name: rg-page`);
  - utilities like `cq-md:d-flex`, `cq-md:rg-cols-2` used inside `@container`.

Example:

```html
<section class="rg-cq">
  <div class="card d-grid cq-md:d-flex cq-md:rg-cols-2">
    ...
  </div>
</section>
```

No layout breaking changes — this is an additive layer.

## 4. Legacy cleanup

3.0.0 only cleans up:

- undocumented CSS/JS bits;
- experimental / `@internal` APIs.

If you relied on internal APIs:

- switch to documented utilities/components and JS Core methods;
- refer to **API Contract** for what is considered public.

## 5. Docs & i18n

- RU docs updated to 3.x.
- EN docs expanded to cover the same core areas:

  - Getting Started,
  - Why Rarog,
  - Tokens,
  - Utilities,
  - Components,
  - JavaScript,
  - Theming,
  - Guides,
  - Cookbook,
  - Accessibility,
  - Performance & bundle size,
  - Branding,
  - Migration.

Docs versioning:

- `/v2` — legacy 2.x reference;
- `/v3` — default 3.x docs.

## 6. Migration checklist

1. Upgrade to `rarog-css@^3.0.0`.
2. Remove usages of any internal/undocumented APIs if present.
3. Verify custom Rarog plugins work against the documented Plugin API.
4. Optionally start using container queries (`.rg-cq`, `cq-md:*`) in critical layouts.
5. Update any public references to say the project uses Rarog 3.x.
