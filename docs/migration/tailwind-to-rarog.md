# Tailwind → Rarog migration guide

Этот гайд нужен для проектов, которые хотят сохранить utility-first DX, но перейти на Rarog tokens, components и theme engine.

## Recommended migration path

1. Запустите `rarog inspect classes`, чтобы увидеть tailwind-heavy surface.
2. Подключите preset `tailwind-aliases` для мягкого входа.
3. Оставьте совместимые spacing/color/state utilities как есть.
4. Переведите layout и component markup на Rarog primitives.
5. Перенесите theme tokens и удалите tailwind config.

## CLI MVP

```bash
rarog inspect classes src/**/*.tsx
rarog migrate tailwind --input src/App.tsx --output src/App.rg.tsx
rarog migrate tailwind --input src/components/Card.tsx --output src/components/Card.tsx --write
```

## High-value mappings

| Tailwind | Rarog | Notes |
| --- | --- | --- |
| `flex` | `d-flex` | display namespace in Rarog |
| `grid` | `d-grid` | display mapping |
| `hidden` | `d-none` | visibility helper |
| `justify-between` | `justify-between` | already aligned |
| `items-center` | `items-center` | already aligned |
| `rounded-lg` | `rounded-lg` | compatible mental model |
| `shadow` | `shadow-sm` | conservative mapping |
| `w-full` | `w-full` | direct mapping |
| `sr-only` | `sr-only` | accessibility helper |
| `hover:bg-*` | `hover:bg-*` | variant syntax kept |
| `md:*` | `md:*` | responsive syntax kept |

## What stays compatible

Rarog уже поддерживает большой слой utility syntax, поэтому чаще всего можно сохранить:

- spacing classes
- color palette classes
- state variants
- responsive variants

Это значит, что migration MVP фокусируется на **inspection + safe codemod + docs**, а не на полном AST-rewrite.

## Manual review zones

- arbitrary values (`w-[37rem]`, `grid-cols-[1fr_auto]`)
- plugin utilities
- prose / typography plugin output
- app-specific design tokens
