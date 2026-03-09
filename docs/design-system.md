# Design System Suite

Начиная с Rarog **3.3.0**, фреймворк позиционируется не только как CSS‑/JS‑слой,
но и как основа полноценной дизайн‑системы.

## Слои дизайн‑системы

1. **Tokens**  
   Базовый уровень — `rarog.tokens.json` и CSS‑переменные:

   - цветовые шкалы (`primary`, `secondary`, `success`, `danger`, `info`);
   - spacing, radius, shadow;
   - semantic‑токены (`bg`, `surface`, `border`, `text`, `accentSoft`, `focusRing`);
   - `tokens.themes.*` для `default`, `dark`, `contrast`, `enterprise`, `creative`.

2. **Themes**  
   Набор готовых тем в пакете `packages/themes`:

   - `rarog-theme-default.css`
   - `rarog-theme-dark.css`
   - `rarog-theme-contrast.css`
   - `rarog-theme-enterprise.css`
   - `rarog-theme-creative.css`

   Темы переопределяют только семантические переменные и не ломают утилити‑слой.

3. **Components & JS**  
   Компонентный слой (CSS) и JS‑ядро используют только семантические токены,
   поэтому переключение темы не требует переписывать компоненты.

4. **Figma Design Kit**  
   В каталоге `design/` находятся артефакты для Figma:

   - `design/figma.tokens.json` — экспорт токенов в формате Tokens Studio;
   - `design/figma-kit/` — описание состава Figma Design Kit и рекомендованного flow.

## Design → Dev handshake

Рекомендуемый цикл работы команды «дизайнеры + разработчики»:

1. **Дизайнеры** настраивают токены и темы в Figma через Tokens Studio,
   основываясь на `design/figma.tokens.json`.
2. **Разработчики** описывают те же значения в `rarog.config.*` (или правят существующие).
3. Запускается `npx rarog build`, который обновляет CSS‑переменные и `rarog.tokens.json`.
4. При изменении токенов/тем:

   - сначала обновляется конфиг и выполняется сборка;
   - затем экспортируется обновлённый `design/figma.tokens.json` и синхронизируется с Figma.

Таким образом, у дизайн‑системы есть единый источник правды — токены, а Rarog
служит «runtime‑слоем», который гарантирует, что эти токены последовательно
используются во всех утилитах, компонентах и JS‑паттернах.
