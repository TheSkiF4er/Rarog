# Themes

Темизация, semantic tokens, наборы тем и брендовый слой поверх токенов.

## Included устаревший sources

- `theming.md`
- `branding.md`
- `design-system.md`

## Imported from `theming.md`

## Темизация

Рарог поддерживает несколько тем (default, dark, contrast), а также свои темы
через переопределение CSS-переменных.

Базовые токены задаются в:

- `packages/core/src/tokens/_color.css`
- `packages/core/src/tokens/_spacing.css`
- `packages/core/src/tokens/_radius.css`
- `packages/core/src/tokens/_shadow.css`
- `packages/core/src/tokens/_breakpoints.css`

Для кастомизации:

1. Скопируйте `rarog.config.js`.
2. Переопределите `theme.colors`, `spacing`, `radius`, `shadow`, `screens`.
3. Выполните:

```bash
npx rarog build
```

4. Подключите собственный файл темы (если нужно) после базового `rarog-core.css`.


### Готовые наборы тем (3.3.0+)

Начиная с 3.3.0, вместе с базовыми темами (`default`, `dark`, `contrast`) в Рарог
появились преднастроенные theme‑packs:

- `.theme-enterprise` — спокойная B2B‑палитра для дашбордов и внутренних продуктов.
- `.theme-creative` — более яркий вариант для лендингов, промо и креативных проектов.

Они реализованы как отдельные CSS‑файлы в пакете `packages/themes`:

- `rarog-theme-default.css`
- `rarog-theme-dark.css`
- `rarog-theme-contrast.css`
- `rarog-theme-enterprise.css`
- `rarog-theme-creative.css`

Пример подключения альтернативной темы через класс на `<html>`:

```html
<html class="theme-enterprise">
  <head>
    <link rel="stylesheet" href="/css/rarog-core.css">
    <link rel="stylesheet" href="/css/rarog-utilities.css">
    <link rel="stylesheet" href="/css/rarog-components.css">
    <link rel="stylesheet" href="/css/rarog-theme-enterprise.css">
  </head>
  ...
</html>
```

Темы переопределяют семантические переменные:

- `--rarog-color-bg`, `--rarog-color-bg-soft`, `--rarog-color-bg-elevated-*`
- `--rarog-color-surface`
- `--rarog-color-border-*`
- `--rarog-color-text`, `--rarog-color-text-muted`
- `--rarog-color-focus-ring`, `--rarog-color-accent-soft`

за счёт чего все компоненты и утилиты автоматически перекрашиваются.

### Semantic vs raw tokens

`rarog.tokens.json` теперь чётко разделяет:

- **сырые шкалы** (`tokens.color.primary.*`, `tokens.spacing.*`, `tokens.radius.*`);
- **семантику** (`tokens.color.semantic.*`, `tokens.semantic.*`);
- **темы** (`tokens.themes.default/dark/contrast/enterprise/creative`).

Это упрощает интеграцию с дизайн‑инструментами и поддерживает сценарий
«одна дизайн‑система → несколько тем в коде и в Figma».


## Imported from `branding.md`

## Branding

Рарог — это не только CSS‑фреймворк, но и визуальный язык. Этот раздел описывает
базовые бренд‑guidelines и то, как использовать их в продуктах и документации.

### Название и тэглайн

- Полное имя: **Рарог CSS**
- Коротко: **Рарог**
- Рекомендуемый тэглайн:

 > Design tokens + вспомогательные классы + Компонентs + JS core

В русскоязычном контексте можно использовать формулировку:

> «Гибридный CSS‑фреймворк нового поколения»

### Цветовая палитра

Основы — из `rarog.tokens.json`.

#### Основной

По умолчанию основан на шкале синего:

- `--rarog-color-primary-500` → `#3b82f6`
- `--rarog-color-primary-600` → `#2563eb`

Рекомендуемое использование:

- CTA‑кнопки (`btn-primary`);
- ссылки и акцентные элементы;
- focus‑ring (`--rarog-color-semantic-focusRing`).

#### Дополнительный

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

Пока у Рарог нет «тяжёлого» графического логотипа. Рекомендуется:

- текстовое написание `Rarog` базовым шрифтом интерфейса;
- в hero/brand‑зоне Документация и лендингов — немного увеличенный кегль + `font-semibold`;
- использовать Основной‑палитру для подчеркивания.

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

Базово Рарог опирается на системные шрифты:

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

- Используй название «Рарог CSS» при первом упоминании.
- Можно указывать:

 > «UI‑слой построен на базе Рарог CSS (Apache 2.0).»

- Ссылки:

 - GitHub: `https://github.com/TheSkiF4er/rarog`
 - Документация: `https://docs.cajeer.ru/rarog` (условный URL / рекомендуемый паттерн)

---

Если в дальнейшем будет нужен полноценный брендбук (логотип, гайд по иконкам,
иллюстрациям и т.п.), его можно вынести в отдельный репозиторий `rarog-brand`
и синхронизировать через Figma‑токены.


## Imported from `design-system.md`

## Система оформления Suite

Начиная с Рарог **3.3.0**, фреймворк позиционируется не только как CSS‑/JS‑слой,
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

3. **Компонентs & JS** 
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

Таким образом, у дизайн‑системы есть единый источник правды — токены, а Рарог
служит «среда выполнения‑слоем», который гарантирует, что эти токены последовательно
используются во всех утилитах, компонентах и JS‑паттернах.


## Движок тем v1

- [Движок тем v1](theme-engine.md)

Официальные polished themes: `aurora`, `graphite`, `enterprise-plus`. Они доступны как theme presets в `packages/themes/presets/` и как scoped CSS для среда выполнения switching / под стороннюю марку demo.
