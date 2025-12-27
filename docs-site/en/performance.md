# Performance & Bundle Size

Explains:

- how much CSS you get in `full` mode vs `jit`,
- how to tune `content` globs,
- how to use variants and arbitrary values without bloating CSS,
- how Rarog compares to Tailwind+Bootstrap in typical scenarios.


## Performance v2 & bundle size

For Rarog 3.x we distinguish several build scenarios:

- **full** — full token/utility/component set;
- **jit** — only classes actually used in your `content` files;
- **split** — multiple CSS bundles for different areas (public site, admin, etc.).

Recommended approach:

1. Use full build while prototyping.
2. For production, turn on `mode: "jit"` in `rarog.config.*` and scope
   `content` to real project paths only.
3. For large systems, consider split builds:
   - shared foundation (tokens + base utilities),
   - a dedicated admin bundle,
   - a dedicated marketing/landing bundle.

Further optimisations:

- cache JIT build results (especially in CI);
- avoid huge dead legacy templates in the same repo, as JIT will still
  detect their classes and keep them.
