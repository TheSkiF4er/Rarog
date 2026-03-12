# CLI Pro tools

Rarog CLI Pro adds diagnostics, token inspection and delivery tooling around the core build flow.

## Commands

```bash
rarog doctor
rarog token inspect rarog.tokens.json --path=tokens.color.semantic
rarog token diff rarog.tokens.json snapshots/rarog.tokens.prev.json
rarog theme diff packages/themes/presets/aurora.json packages/themes/presets/graphite.json
rarog component scaffold PricingCard --dir src/components --style css-module
rarog audit a11y src
rarog audit bundle dist
```

## Real workflows

### 1. Check a white-label release candidate

```bash
rarog doctor
rarog audit bundle dist
rarog audit a11y src
```

Use this before shipping a tenant-specific bundle to ensure config, outputs and obvious static accessibility issues are visible.

### 2. Review a token change request

```bash
rarog token inspect rarog.tokens.json --path=tokens.color.semantic
rarog token diff rarog.tokens.json snapshots/rarog.tokens.prev.json
```

This lets design-system maintainers inspect the exact semantic aliases that changed instead of reading a full JSON diff.

### 3. Compare a new theme against baseline

```bash
rarog theme diff packages/themes/presets/enterprise-plus.json themes/acme-finance.json
```

Use this in code review to confirm that only intended semantic and runtime tokens changed.

### 4. Start a product component quickly

```bash
rarog component scaffold BillingHero --dir src/components/marketing
```

The scaffold generates a React component, styles, a test stub and a Storybook story.

## Notes

- `rarog audit a11y` is static and intentionally lightweight. It catches missing `alt`, weak button labels and likely unlabeled inputs.
- `rarog audit bundle` is size-oriented and helps spot unexpectedly large CSS/JS artifacts.
