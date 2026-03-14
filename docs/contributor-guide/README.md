# Руководство для контрибьюторов

Материалы для контрибьюторов: локальная разработка, playground/storybook, плагины и поддержка документации.

## Включено устаревший sources

- `design-system.md`
- `playground.md`
- `storybook.md`
- `ide-plugins.md`
- `versioning.md`

## Imported from `design-system.md`

## Система оформления Suite

Начиная с Рарог **3.3.0**, фреймворк позиционируется не только как CSS‑/JS‑слой,
но и как основа полноценной дизайн‑системы.

### Слои дизайн‑системы

1. **Токены** 
 Базовый уровень — `rarog.tokens.json` и CSS‑переменные:

 - цветовые шкалы (`primary`, `secondary`, `success`, `danger`, `info`);
 - spacing, radius, shadow;
 - semantic‑токены (`bg`, `surface`, `border`, `text`, `accentSoft`, `focusRing`);
 - `tokens.themes.*` для `default`, `dark`, `contrast`, `enterprise`, `creative`.

2. **Темы** 
 Набор готовых тем в пакете `packages/themes`:

 - `rarog-theme-default.css`
 - `rarog-theme-dark.css`
 - `rarog-theme-contrast.css`
 - `rarog-theme-enterprise.css`
 - `rarog-theme-creative.css`

 Темы переопределяют только семантические переменные и не ломают утилити‑слой.

3. **Компоненты & JS** 
 Компонентный слой (CSS) и JS‑ядро используют только семантические токены,
 поэтому переключение темы не требует переписывать компоненты.

4. **Figma Design Kit** 
 В каталоге `design/` находятся артефакты для Figma:

 - `design/figma.tokens.json` — экспорт токенов в формате Токены Studio;
 - `design/figma-kit/` — описание состава Figma Design Kit и рекомендованного flow.

### Design → Dev handshake

Рекомендуемый цикл работы команды «дизайнеры + разработчики»:

1. **Дизайнеры** настраивают токены и темы в Figma через Токены Studio,
 основываясь на `design/figma.tokens.json`.
2. **Разработчики** описывают те же значения в `rarog.config.*` (или правят существующие).
3. Запускается `npx rarog build`, который обновляет CSS‑переменные и `rarog.tokens.json`.
4. При изменении токенов/тем:

 - сначала обновляется конфиг и выполняется сборка;
 - затем экспортируется обновлённый `design/figma.tokens.json` и синхронизируется с Figma.

Таким образом, у дизайн‑системы есть единый источник правды — токены, а Рарог
служит «среда выполнения‑слоем», который гарантирует, что эти токены последовательно
используются во всех утилитах, компонентах и JS‑паттернах.


## Imported from `playground.md`

## Испытательная площадка

Рарог теперь включает локальный demo испытательная площадка без отдельной сборки.

### Запуск

```bash
npm run playground
```

Открой `http://127.0.0.1:4173/examples/playground/`.

### Что умеет испытательная площадка

- переключение сцен (`Modal`, `Dropdown`, `Forms`, `DataTable`)
- смена темы
- RTL toggle
- логирование среда выполнения-событий

Испытательная площадка использует исходные CSS entrypoints и `packages/js/src/rarog.esm.js`, поэтому хорошо подходит для быстрой ручной проверки компонентов и lifecycle.


## Imported from `storybook.md`

## Storybook

Рарог теперь включает локальный Storybook-контур для HTML/JS Core компонентов.

### Запуск

```bash
npm install
npm run storybook
```

По умолчанию Storybook поднимается на `http://127.0.0.1:6006`.

### Что уже покрыто

- Foundations / Кнопка
- Overlays / Modal
- Overlays / Выпадающее меню
- Data / DataTable

Storybook собран на `@storybook/html-vite`, поэтому истории работают прямо с исходными CSS entrypoints и `packages/js/src/rarog.esm.js`.


## Imported from `ide-plugins.md`

## IDE & Plugins

Рарог 2.4.0 фокусируется на повседневном DX: IDE, плагины и дизайн-токены.

### VSCode Extension (alpha)

В репозитории есть MVP-расширение VSCode:

- каталог: `tools/vscode-rarog`;
- файл манифеста: `tools/vscode-rarog/package.json`;
- основное тело: `tools/vscode-rarog/out/extension.js`;
- словарь классов: `tools/vscode-rarog/rarog-classmap.json`.

#### Установка из репозитория

1. Открой проект Рарог в VSCode.
2. Выполни:

 ```bash
   cd tools/vscode-rarog
   npm install
   # при необходимости: vsce package
   ```

3. Установи получившийся `.vsix` через VSCode (`Extensions → ... → Install from VSIX`).

Расширение даёт:

- автодополнение классов Рарог (вспомогательные классы, компоненты, расширение-классы);
- hover-доки по классам (описание + категория).

#### Обновление словаря классов

Словарь классов генерируется скриптом:

```bash
node tools/generate-class-dictionary.mjs
```

Он использует:

- `rarog.tokens.json` (цвета, spacing, radius, shadow);
- базовый список компонент/утилит.

Результат записывается в `tools/vscode-rarog/rarog-classmap.json`. Расширение подхватывает обновлённый файл после перезапуска VSCode.

### Интерфейс расширений v1

В `rarog.config.ts/js` есть поле `plugins`:

```ts
import type { RarogКонфигурация, RarogPlugin } from './rarog.config.types';

const config: RarogКонфигурация = {
  // ...
  plugins: [
    "./packages/plugin-forms/index.cjs",
    "./packages/plugin-typography/index.cjs"
  ]
};

export default config;
```

Плагин может быть:

- строкой (путь до модуля);
- функцией `(ctx) => void | { utilitiesCss?: string; componentsCss?: string }`.

#### Сигнатуры

```ts
export interface RarogPluginContext {
  config: RarogКонфигурация;
}

export interface RarogPluginResult {
  utilitiesCss?: string;
  componentsCss?: string;
}

export type RarogPlugin =
  | ((ctx: RarogPluginContext) => void | RarogPluginResult)
  | string;
```

Плагины вызываются в JIT-режиме (`mode: "jit"`):

- регистрируются в `rarog.config.*`;
- средство командной строки вызывает их в `runPlugins(effectiveКонфигурация)`;
- возвращённый CSS добавляется в итоговый `dist/rarog.jit.css`:

 - `utilitiesCss` → секция `/* Rarog plugin utilities */`;
 - `componentsCss` → секция `/* Rarog plugin components */`.

Плагин может:

- читать `ctx.config.theme`, `ctx.config.screens`, `ctx.config.extend`;
- вернуть дополнительный CSS с классами, которые будут доступны в проекте.

### Официальные плагины

#### @rarog/plugin-forms

Расположение:

- `packages/plugin-forms/index.cjs`

Возможности (MVP):

- `.form-control-sm`, `.form-control-lg` — уменьшенные/увеличенные поля ввода;
- `.field`, `.field-label-inline`, `.field-hint` — структуры для форменных полей;
- `.input-muted` — «мягкое» поле ввода;
- `.switch` (checkbox/radio) — простые switch-переключатели на чистом CSS.

Пример подключения:

```ts
// rarog.config.ts
const config: RarogКонфигурация = {
  // ...
  plugins: [
    "./packages/plugin-forms/index.cjs"
  ]
};
```

#### @rarog/plugin-typography

Расположение:

- `packages/plugin-typography/index.cjs`

Возможности:

- `.prose` — типографика для markdown/контентных статей;
- стилизация:

 - заголовков `h1–h4`,
 - абзацев,
 - списков,
 - `code` и `pre`,
 - `blockquote`,
 - встроенных медиа (`img`, `video`).

Пример:

```html
<article class="prose">
  <h1>Заголовок статьи</h1>
  <p>Контентный параграф с оформлением в стиле Rarog.</p>
</article>
```

И подключение:

```ts
plugins: [
  "./packages/plugin-typography/index.cjs"
]
```

### Design Токены → Figma

Для интеграции с дизайн-инструментами используется файл:

- `design/figma.tokens.json`

Формат совместим с Токены Studio / Design Токены tooling:

- секции: `color`, `spacing`, `radius`, `shadow`;
- значения — объект вида:

 ```json
  {
    "value": "#3b82f6",
    "type": "color"
  }
  ```

#### Подключение в Figma (Токены Studio)

1. Установи плагин Токены Studio в Figma.
2. В настройках проекта выбери импорт из локального/удалённого JSON.
3. Укажи путь до `design/figma.tokens.json` (через Git-провайдер или ручной импорт).
4. Сопоставь группы:

 - `color.primary.*` / `color.semantic.*` → цветовые токены;
 - `spacing.*` → spacing;
 - `radius.*` → Граница radius;
 - `shadow.*` → тени.

После этого:

- дизайнеры используют те же токены, что и в Рарог;
- разработчики подхватывают их через `var(--rarog-...)` и утилити-классы.


### Рарог LSP Server (3.2.0+)

Начиная с 3.2.0, помимо простого VSCode-расширения, Рарог предоставляет полноценный
LSP-сервер, который можно подключать из любых современных IDE/редакторов.

- бинарь: `node tools/lsp/rarog-lsp.js`;
- протокол: стандартный Language Server Protocol;
- возможности:
 - автодополнение классов (`rg-*`, `btn-*`, `bg-*`, `text-*`, variants и т.д.);
 - подсказки по токенам (`primary-500`, `space-4`, `radius-md`, `shadow-lg`);
 - hover-подсказки с кратким описанием и ссылкой на Документация;
 - базовая валидация `rarog.config.*` (та же логика, что и в `rarog validate`).

Поддерживаемые типы файлов (MVP):

- `.html`, `.blade.php`;
- `.js` / `.ts` / `.jsx` / `.tsx`;
- `.vue`;
- любые шаблоны, где используется строковый `class=""` / `className=""` и Tailwind-подобные списки классов.

#### VSCode + LSP

Расширение в каталоге `tools/vscode-rarog` может использовать как локальный
словари-классов, так и LSP-сервер (через стандартный VSCode LSP-клиент). В простом
сценарии можно просто:

```bash
node tools/lsp/rarog-lsp.js --stdio
```

и подключить его через любую LSP-конфигурацию VSCode/Neovim/WebStorm, указав корень
проекта как рабочее пространство root.

#### WebStorm / Neovim / другие IDE

Так как сервер реализует стандартный LSP, его можно подключать как обычный
`node`-LSP:

- команда: `node tools/lsp/rarog-lsp.js --stdio`;
- root: корень проекта с `rarog.config.*` и `rarog.tokens.json`;
- триггеры:
 - HTML/Blade/JSX/TSX/Vue-файлы;
 - конфиг `rarog.config.*` для валидации.

Подробные примеры конфигураций для WebStorm/Neovim можно взять из типовых
настроек LSP для Tailwind CSS и адаптировать, заменив команду и root.

### средство командной строки DX: Рарог validate

В 3.2.0 появился отдельный DX-инструмент для проверки конфига:

```bash
npx rarog validate
## или
pnpm rarog validate
```

Команда:

- ищет `rarog.config.js/ts/json` в корне;
- запускает базовую проверку:
 - формата и сортировки `screens` (брейкпоинты);
 - типа `plugins` (обязан быть массив);
 - типа `theme.colors`;
- выводит:
 - `[warn]` — мягкие предупреждения (например, нестандартный формат брейкпоинтов);
 - `[error]` — ошибки, из-за которых стоит поправить конфиг (и код возврата `1`).

Это тот же самый валидатор, который использует LSP-сервер для диагностики
`rarog.config.*` прямо в IDE.


## Imported from `versioning.md`

## Versioning Policy

Рарог следует **SemVer**: `MAJOR.MINOR.PATCH`.

### Что означает версия

#### PATCH

Patch-релизы используются для:
- bug fixes;
- security fixes;
- docs/build/publish fixes без расширения Поверхность;
- non-breaking DX improvements.

PATCH **не должен**:
- менять stable интерфейс contract;
- удалять entrypoints;
- менять expected output paths в каноническом flow.

#### MINOR

Minor-релизы используются для:
- добавления новых stable возможностей;
- расширения utilities/components/themes;
- продвижения Поверхность из beta в stable;
- добавления opt-in возможностей без breaking changes.

MINOR может:
- добавлять новые subpath exports;
- вводить deprecation warnings;
- расширять средство командной строки, если старый stable path остаётся рабочим.

#### MAJOR

Major нужен для:
- удаления deprecated stable Поверхность;
- изменения root package contract;
- смены канонического config/build flow;
- любого intentional breaking change для stable интерфейс.

### Deprecation policy

Для stable Поверхность действует такой процесс:
1. Сначала появляется deprecation note в docs/README/release notes.
2. Затем Поверхность остаётся рабочим минимум один minor-цикл, если нет security/critical reason убрать его раньше.
3. Удаление происходит только в следующем major.

Для beta/experimental Поверхность срок может быть короче, но изменение всё равно должно быть задокументировано.

### RFC process для больших интерфейс изменений

RFC обязателен, если изменение затрагивает:
- root package exports;
- config/build flow;
- публичный Интерфейс расширений;
- adapter/runtime contracts;
- migration path для stable пользователей.

Минимальный RFC должен содержать:
- problem statement;
- proposed интерфейс;
- compatibility impact;
- migration plan;
- rollout plan;
- alternatives considered.

### Выпуск policy

Канонический выпуск gate:

```bash
npm ci
npm run release:verify
npm run build
npm run test:release
npm run verify:artifacts
npm run pack:packages
```

Только после этого CI публикует `rarog`, `@rarog/js`, `@rarog/react` и `@rarog/vue`.

### Support policy

- Стабильное Поверхность поддерживается в пределах текущего major.
- Предварительное Поверхность поддерживается best-effort с migration notes.
- Экспериментальное Поверхность не имеет долгосрочных compatibility guarantees.
