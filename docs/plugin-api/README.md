# Plugin SDK v1

Plugin system в Rarog 3.5+ теперь рассматривается как **реальная расширяемая платформа**, а не как декоративный CSS-hook.

## Что входит в Plugin SDK v1

- **stable plugin contract** — стабильный объектный контракт `createPlugin()` / `definePlugin()`;
- **plugin test harness** — `createPluginTestHarness()` для локальной и CI-проверки плагинов;
- **plugin starter template** — генератор `create-rarog-plugin`;
- **plugin compatibility docs** — правила совместимости и поддержки движка;
- **semantic version policy** — зафиксированная SemVer-политика для API v1.

## Stable plugin contract

Rarog поддерживает два типа плагинов:

1. **SDK v1 plugin object** — рекомендуемый и стабильный формат.
2. **Legacy function plugin** — обратно совместимый формат для ветки 3.x.

### Рекомендуемый формат

```js
const { createPlugin } = require("@rarog/plugin-sdk");

module.exports = createPlugin({
  name: "@rarog/plugin-example",
  version: "1.0.0",
  description: "Example first-class plugin.",
  engine: {
    rarog: ">=3.5.0 <4.0.0"
  },
  capabilities: {
    utilities: true,
    components: true,
    diagnostics: true
  },
  setup(ctx) {
    return {
      utilitiesCss: ".example-stack { display:grid; gap:1rem; }",
      componentsCss: ".example-card { border-radius:var(--rarog-radius-lg); }",
      diagnostics: [
        { level: "info", message: "Example plugin active." }
      ]
    };
  }
});
```

### Обязательные поля

- `name`
- `setup(ctx)`

### Рекомендуемые поля

- `version`
- `description`
- `engine.rarog`
- `capabilities`
- `keywords`
- `official`

## Plugin context

`setup(ctx)` получает стабильный контекст:

```ts
interface RarogPluginContext {
  config: RarogConfig;
  meta?: {
    mode: "full" | "jit";
    rootDir: string;
    env: string;
  };
  helpers?: {
    warn(message: string): void;
  };
}
```

### Стабильно гарантируется

- `ctx.config`
- `ctx.meta.mode`
- `ctx.meta.rootDir`
- `ctx.meta.env`
- `ctx.helpers.warn()`

### Не считается публичным контрактом

- внутренние пути CLI;
- прямой доступ к build manifest;
- регистрация новых CLI-команд через runtime hook;
- мутация внутренних структур build pipeline.

## Plugin result

```ts
interface RarogPluginResult {
  utilitiesCss?: string;
  componentsCss?: string;
  diagnostics?: Array<{
    level: "info" | "warn" | "error";
    message: string;
  }>;
}
```

## Plugin test harness

SDK поставляет test harness для двух сценариев:

- проверка совместимости по `engine.rarog` и `apiVersion`;
- smoke-test CSS-выхода и diagnostics.

```js
const { createPluginTestHarness } = require("@rarog/plugin-sdk");
const plugin = require("./index.cjs");

const harness = createPluginTestHarness({
  rarogVersion: "3.5.0",
  rootDir: process.cwd()
});

const execution = harness.execute(plugin, {
  config: { mode: "jit" }
});

console.log(execution.compatibility);
console.log(execution.result.utilitiesCss);
```

## Starter template

Создать новый плагин можно командой:

```bash
create-rarog-plugin my-plugin
```

Или через npm script внутри репозитория:

```bash
npm run create:plugin -- my-plugin
```

Генератор создаёт:

- `plugins/<plugin-name>/index.cjs`
- `plugins/<plugin-name>/README.md`
- `plugins/<plugin-name>/plugin.test.cjs`

## Official plugins

Первый пакет официальных плагинов на SDK v1:

- `@rarog/plugin-typography`
- `@rarog/plugin-forms`
- `@rarog/plugin-motion`
- `@rarog/plugin-charts-theme`
- `@rarog/plugin-dashboard-kit`
- `@rarog/plugin-marketing-blocks`

## Legacy compatibility

Функции-плагины старого формата продолжают работать в ветке 3.x:

```js
module.exports = function legacyPlugin(ctx) {
  return {
    utilitiesCss: ".legacy { display:block; }"
  };
};
```

Но для новых плагинов SDK v1 обязателен.

## Deliverables

В рамках Plugin SDK v1 в репозитории добавлены:

- `packages/plugin-sdk/index.cjs`
- `packages/cli/bin/create-rarog-plugin.js`
- `packages/cli/lib/plugin-starter.js`
- обновлённый runtime loader в `packages/cli/lib/api.js`
- официальный registry в `plugins/registry.json`
- first-party plugins v1
- test harness coverage в `tests/js/plugin-sdk.test.js`

Подробнее про версионирование и совместимость — в [Plugin Compatibility](./compatibility.md).
