# IDE & Plugins

Rarog 2.4.0 фокусируется на повседневном DX: IDE, плагины и дизайн-токены.

## VSCode Extension (alpha)

В репозитории есть MVP-расширение VSCode:

- каталог: `tools/vscode-rarog`;
- файл манифеста: `tools/vscode-rarog/package.json`;
- основное тело: `tools/vscode-rarog/out/extension.js`;
- словарь классов: `tools/vscode-rarog/rarog-classmap.json`.

### Установка из репозитория

1. Открой проект Rarog в VSCode.
2. Выполни:

   ```bash
   cd tools/vscode-rarog
   npm install
   # при необходимости: vsce package
   ```

3. Установи получившийся `.vsix` через VSCode (`Extensions → ... → Install from VSIX`).

Расширение даёт:

- автодополнение классов Rarog (utilities, компоненты, plugin-классы);
- hover-доки по классам (описание + категория).

### Обновление словаря классов

Словарь классов генерируется скриптом:

```bash
node tools/generate-class-dictionary.mjs
```

Он использует:

- `rarog.tokens.json` (цвета, spacing, radius, shadow);
- базовый список компонент/утилит.

Результат записывается в `tools/vscode-rarog/rarog-classmap.json`. Расширение подхватывает обновлённый файл после перезапуска VSCode.

## Plugin API v1

В `rarog.config.ts/js` есть поле `plugins`:

```ts
import type { RarogConfig, RarogPlugin } from './rarog.config.types';

const config: RarogConfig = {
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

### Сигнатуры

```ts
export interface RarogPluginContext {
  config: RarogConfig;
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
- CLI вызывает их в `runPlugins(effectiveConfig)`;
- возвращённый CSS добавляется в итоговый `dist/rarog.jit.css`:

  - `utilitiesCss` → секция `/* Rarog plugin utilities */`;
  - `componentsCss` → секция `/* Rarog plugin components */`.

Плагин может:

- читать `ctx.config.theme`, `ctx.config.screens`, `ctx.config.extend`;
- вернуть дополнительный CSS с классами, которые будут доступны в проекте.

## Официальные плагины

### @rarog/plugin-forms

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
const config: RarogConfig = {
  // ...
  plugins: [
    "./packages/plugin-forms/index.cjs"
  ]
};
```

### @rarog/plugin-typography

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

## Design Tokens → Figma

Для интеграции с дизайн-инструментами используется файл:

- `design/figma.tokens.json`

Формат совместим с Tokens Studio / Design Tokens tooling:

- секции: `color`, `spacing`, `radius`, `shadow`;
- значения — объект вида:

  ```json
  {
    "value": "#3b82f6",
    "type": "color"
  }
  ```

### Подключение в Figma (Tokens Studio)

1. Установи плагин Tokens Studio в Figma.
2. В настройках проекта выбери импорт из локального/удалённого JSON.
3. Укажи путь до `design/figma.tokens.json` (через Git-провайдер или ручной импорт).
4. Сопоставь группы:

   - `color.primary.*` / `color.semantic.*` → цветовые токены;
   - `spacing.*` → spacing;
   - `radius.*` → border radius;
   - `shadow.*` → тени.

После этого:

- дизайнеры используют те же токены, что и в Rarog;
- разработчики подхватывают их через `var(--rarog-...)` и утилити-классы.

