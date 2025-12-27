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

## Token pipeline v2 (3.3.0+)

В 3.3.0 структура `rarog.tokens.json` была уточнена под сценарий «полноценная
дизайн‑система»:

- `tokens.color.*` — «сырые» палитры (primary, secondary, success, danger, info…);
- `tokens.spacing`, `tokens.radius`, `tokens.shadow`, `tokens.layout` — атомарные шкалы;
- `tokens.color.semantic` и `tokens.semantic` — семантические токены (фон, текст, бордеры);
- `tokens.themes.*` — набор тем (`default`, `dark`, `contrast`, `enterprise`, `creative`),
  каждая из которых задаёт свой набор `semantic`‑значений.

Экспорт в Figma теперь строится поверх этой структуры:

- `design/figma.tokens.json` содержит как базовые шкалы, так и semantic‑слой и темы;
- Figma‑kit (см. `design/figma-kit/`) использует эти токены как единственный источник правды.

Базовый flow:
1. Настраиваете токены в `rarog.config.*`.
2. Запускаете `npx rarog build` для генерации CSS и `rarog.tokens.json`.
3. Обновляете `design/figma.tokens.json` (через тот же пайплайн).
4. Обновляете токены в Figma (Tokens Studio или аналог).
