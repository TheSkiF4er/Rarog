# Tailwind → Рарог migration guide

Этот гайд нужен для проектов, которые хотят сохранить с опорой на вспомогательные классы DX, но перейти на Рарог tokens, Компонентs и движок тем.

## Рекомендуемый путь миграции

1. Запустите `rarog inspect classes`, чтобы увидеть tailwind-heavy Поверхность.
2. Подключите preset `tailwind-aliases` для мягкого входа.
3. Оставьте совместимые spacing/color/state вспомогательные классы как есть.
4. Переведите Компоновка и Компонент markup на Рарог базовые элементы.
5. Перенесите theme tokens и удалите tailwind config.

## средство командной строки MVP

```bash
rarog inspect classes src/**/*.tsx
rarog migrate tailwind --input src/App.tsx --output src/App.rg.tsx
rarog migrate tailwind --input src/components/Card.tsx --output src/components/Card.tsx --write
```

## High-value mappings

| Tailwind | Рарог | Примечания |
| --- | --- | --- |
| `flex` | `d-flex` | display namespace in Рарог |
| `grid` | `d-grid` | display mapping |
| `hidden` | `d-none` | visibility вспомогательное средство |
| `justify-between` | `justify-between` | already aligned |
| `items-center` | `items-center` | already aligned |
| `rounded-lg` | `rounded-lg` | compatible mental model |
| `shadow` | `shadow-sm` | conservative mapping |
| `w-full` | `w-full` | direct mapping |
| `sr-only` | `sr-only` | accessibility вспомогательное средство |
| `hover:bg-*` | `hover:bg-*` | variant syntax kept |
| `md:*` | `md:*` | responsive syntax kept |

## What stays compatible

Рарог уже поддерживает большой слой utility syntax, поэтому чаще всего можно сохранить:

- spacing classes
- color palette classes
- state variants
- responsive variants

Это значит, что migration MVP фокусируется на **inspection + safe codemod + Документация**, а не на полном AST-rewrite.

## Зоны ручной проверки

- arbitrary values (`w-[37rem]`, `grid-cols-[1fr_auto]`)
- расширение вспомогательные классы
- prose / typography расширение output
- app-specific design tokens
