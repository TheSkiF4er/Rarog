# Accessibility notes

Этот раздел агрегирует общие accessibility expectations для компонентного слоя Rarog.

## Baseline

- keyboard-first interactions
- visible focus rings
- reduced motion support
- contrast-safe defaults
- ARIA roles/patterns for interactive widgets
- predictable disabled and invalid states

## By component family

- **Forms**: labels, descriptions, error text, required/invalid states
- **Overlays**: focus trap, escape handling, restore focus, inert background expectations
- **Navigation**: arrow-key support where pattern requires it
- **Status UI**: alerts, badges, spinners should not create noisy announcements

## Team workflow

Use [accessibility checklist](../accessibility.md) and [template](../accessibility-checklist-template.md) together with component docs and visual fixtures.
