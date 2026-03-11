# Migration assistant MVP

Migration assistant в этой версии решает три задачи:

1. **inspect** — понять, какие class systems реально используются в проекте;
2. **codemod** — безопасно заменить high-confidence classes;
3. **preset** — удержать UX знакомым для команды во время перехода.

## Included commands

```bash
rarog inspect classes [files...]
rarog migrate bootstrap --input <file> --output <file>
rarog migrate tailwind --input <file> --output <file>
```

## MVP limitations

- не делает полноценный AST-анализ JSX/Vue templates;
- не переписывает arbitrary values;
- не гарантирует полную миграцию custom design systems;
- требует manual review после codemod.

## Why this is enough for v1

Для adoption важнее сначала дать:

- понятный inspection report;
- predictable first-pass conversion;
- compatibility presets;
- docs с mapping tables.

Полный zero-touch migration можно строить уже поверх этой базы.
