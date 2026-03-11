# Accessibility baseline

Rarog now treats accessibility as a release baseline, not as a later enhancement.

## Baseline rules

- Keyboard-first interactions for all interactive components
- ARIA patterns only when native semantics are insufficient
- Shared visible focus ring via `:focus-visible`
- `prefers-reduced-motion` honored across overlays, loaders and transitions
- Color and surface tokens chosen for AA-oriented contrast defaults
- Every component ships with a checklist and visual/a11y regression touchpoint

## Automated checks

- Vitest/jsdom coverage for tabs, dialogs, select semantics and keyboard interactions
- Playwright visual regression with reduced motion enabled
- Storybook a11y addon available for manual review

## Manual checklist

Use `docs/accessibility-checklist-template.md` for every component change.
