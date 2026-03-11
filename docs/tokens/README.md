# Tokens

Токены как базовый слой дизайн-системы: структура, pipeline и связь с Figma.

## Included legacy sources

- `tokens.md`
- `design-system.md`
- `branding.md`

## Imported from `tokens.md`

## Tokens

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

### Интеграция с Figma

Для использования тех же токенов в дизайн-системе доступен экспорт:

- файл `design/figma.tokens.json` — совместим с Tokens Studio / Design Tokens tooling.

Подробнее про импорт в Figma и Tokens Studio см. раздел **IDE & Plugins**.

### Token pipeline v2 (3.3.0+)

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


## Imported from `design-system.md`

## Design System Suite

Начиная с Rarog **3.3.0**, фреймворк позиционируется не только как CSS‑/JS‑слой,
но и как основа полноценной дизайн‑системы.

### Слои дизайн‑системы

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

### Design → Dev handshake

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


## Imported from `branding.md`

## Branding

Rarog — это не только CSS‑фреймворк, но и визуальный язык. Этот раздел описывает
базовые бренд‑guidelines и то, как использовать их в продуктах и документации.

### Название и тэглайн

- Полное имя: **Rarog CSS**
- Коротко: **Rarog**
- Рекомендуемый тэглайн:

  > Design tokens + utilities + components + JS core

В русскоязычном контексте можно использовать формулировку:

> «Гибридный CSS‑фреймворк нового поколения»

### Цветовая палитра

Основы — из `rarog.tokens.json`.

#### Primary

По умолчанию основан на шкале синего:

- `--rarog-color-primary-500` → `#3b82f6`
- `--rarog-color-primary-600` → `#2563eb`

Рекомендуемое использование:

- CTA‑кнопки (`btn-primary`);
- ссылки и акцентные элементы;
- focus‑ring (`--rarog-color-semantic-focusRing`).

#### Secondary

Тёмно‑серо‑синяя палитра:

- `--rarog-color-secondary-600` → основан на `#475569`.

Рекомендуемое использование:

- второстепенные кнопки (`btn-secondary`);
- навигация, сайдбар, фон карточек.

#### Semantic

Из `color.semantic`:

- `bg` / `bgSoft` / `bgElevated` — фоновые слои;
- `surface` — поверхность карточек/компонент;
- `border` / `borderSubtle` / `borderStrong` — границы;
- `text` / `textMuted` — текст;
- `accentSoft` — мягкий акцент для фона.

### Лого и отображение бренда

Пока у Rarog нет «тяжёлого» графического логотипа. Рекомендуется:

- текстовое написание `Rarog` базовым шрифтом интерфейса;
- в hero/brand‑зоне docs и лендингов — немного увеличенный кегль + `font-semibold`;
- использовать primary‑палитру для подчеркивания.

Пример:

```html
<div class="d-inline-flex items-center gap-2">
  <span class="text-xl font-semibold">Rarog</span>
  <span class="badge badge-outline">CSS</span>
</div>
```

В дальнейшем логотип можно добавить как SVG‑иконку, но текущие гайды не завязаны
на конкретном артефакте.

### Типографика

Базово Rarog опирается на системные шрифты:

- в UI/панелях — `system-ui`;
- в коде — `ui-monospace`.

Для контентных страниц и документации:

- рекомендуется использовать `.prose` из `@rarog/plugin-typography`;
- избегать чрезмерного количества разных шрифтов, чтобы не ломать визуальную
  целостность экосистемы.

### Тон документации (tone of voice)

Рекомендуемый стиль:

- спокойный, инженерный;
- минимум маркетингового шума, максимум пользы;
- короткие и точные примеры кода;
- объяснение «почему» (design decisions) рядом с «как».

### Использование бренда в сторонних проектах

- Используй название «Rarog CSS» при первом упоминании.
- Можно указывать:

  > «UI‑слой построен на базе Rarog CSS (Apache 2.0).»

- Ссылки:

  - GitHub: `https://github.com/TheSkiF4er/rarog`
  - docs: `https://docs.cajeer.ru/rarog` (условный URL / рекомендуемый паттерн)

---

Если в дальнейшем будет нужен полноценный брендбук (логотип, гайд по иконкам,
иллюстрациям и т.п.), его можно вынести в отдельный репозиторий `rarog-brand`
и синхронизировать через Figma‑токены.


## Token architecture v2

- [Token architecture v2](../tokens.md)
- [Semantic tokens](../semantic-tokens.md)

Rarog теперь разделяет raw, semantic, component и runtime theme tokens, чтобы поддерживать multi-brand и per-tenant theming без дублирования CSS.
