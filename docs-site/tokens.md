# Tokens

Rarog строится вокруг универсального слоя дизайн-токенов.

Основные группы токенов:

- Цвета (`_color.css` и `rarog.tokens.json`)
- Отступы (`_spacing.css`)
- Радиусы (`_radius.css`)
- Тени (`_shadow.css`)
- Брейкпоинты (`_breakpoints.css`)

Все эти файлы генерируются командой:

```bash
npx rarog build
```

на основе `rarog.config.js` / `rarog.config.ts`.

## Интеграция с Figma

Для использования тех же токенов в дизайн-системе доступен экспорт:

- файл `design/figma.tokens.json` — совместим с Tokens Studio / Design Tokens tooling.

Подробнее про импорт в Figma и Tokens Studio см. раздел **IDE & Plugins**.
