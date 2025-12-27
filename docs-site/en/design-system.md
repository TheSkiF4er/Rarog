# Design System Suite

Starting with Rarog **3.3.0**, the framework is positioned as a foundation for a
full‑blown design system, not just a CSS/JS library.

## Layers

1. **Tokens**  
   The base layer is `rarog.tokens.json` and CSS variables:

   - color scales (`primary`, `secondary`, `success`, `danger`, `info`);
   - spacing, radius, shadow;
   - semantic tokens (`bg`, `surface`, `border`, `text`, `accentSoft`, `focusRing`);
   - `tokens.themes.*` for `default`, `dark`, `contrast`, `enterprise`, `creative`.

2. **Themes**  
   Ready‑to‑use theme packs in `packages/themes`:

   - `rarog-theme-default.css`
   - `rarog-theme-dark.css`
   - `rarog-theme-contrast.css`
   - `rarog-theme-enterprise.css`
   - `rarog-theme-creative.css`

   Themes override only semantic variables and do not break utilities.

3. **Components & JS**  
   Components (CSS) and JS core rely on semantic tokens, so switching a theme
   does not require changing component code.

4. **Figma Design Kit**  
   The `design/` folder contains Figma‑related assets:

   - `design/figma.tokens.json` — token export for Tokens Studio;
   - `design/figma-kit/` — description of the official Figma Design Kit.

## Design → Dev handshake

Recommended collaboration flow:

1. **Designers** work with tokens and themes in Figma via Tokens Studio,
   using `design/figma.tokens.json` as input.
2. **Developers** mirror those values in `rarog.config.*` (or extend them).
3. Run `npx rarog build` to regenerate CSS variables and `rarog.tokens.json`.
4. When tokens/themes change:

   - update the config and rebuild;
   - export a refreshed `design/figma.tokens.json` and sync it back into Figma.

This way tokens stay the single source of truth, and Rarog is the runtime layer
that guarantees consistent usage across utilities, components and JS patterns.
