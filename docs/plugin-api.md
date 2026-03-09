# Plugin API

Этот документ фиксирует **текущий публичный контракт** plugin API в ветке 3.x.

## Статус

Plugin API имеет статус **Experimental**.

Это означает:
- базовый контракт уже можно использовать для внутренних и community-плагинов;
- минорные версии 3.x могут расширять контекст и возвращаемую структуру;
- внутренние helper-функции CLI не считаются частью public API, если они не описаны здесь.

## Что считается публичным контрактом

Плагин может быть:
- функцией, переданной напрямую в `plugins`;
- строкой с путём до CommonJS-модуля или совместимого Node-модуля.

Минимальный формат:

```js
module.exports = function rarogPlugin(ctx) {
  return {
    utilitiesCss: ".content-auto { content-visibility: auto; }",
    componentsCss: ".card-accent { border-inline-start: 4px solid var(--rarog-color-primary); }"
  };
};
```

## Контекст плагина

На вход плагин получает объект:

```ts
interface RarogPluginContext {
  config: RarogConfig;
}
```

Гарантируется только поле `config`.

### `config`

Это уже вычисленный effective config, где:
- учтён `defaultConfig`;
- применены пользовательские `theme`, `screens`, `variants`, `content`, `mode`;
- применены расширения из `extend`.

## Возвращаемое значение

Плагин может вернуть объект:

```ts
interface RarogPluginResult {
  utilitiesCss?: string;
  componentsCss?: string;
}
```

### `utilitiesCss`

Строка CSS, которая будет добавлена в секцию utility-слоя JIT-сборки.

### `componentsCss`

Строка CSS, которая будет добавлена в секцию component-слоя JIT-сборки.

## Ограничения текущей версии

В текущем контракте плагин **не должен рассчитывать**, что он может:
- мутировать внутренние структуры CLI;
- менять build manifest;
- регистрировать новые CLI-команды;
- рассчитывать на стабильный доступ к внутренним путям пакета;
- зависеть от недокументированных полей `ctx`.

## Совместимость

При публикации плагина рекомендуется:
- явно указывать поддерживаемый диапазон версий Rarog;
- тестировать минимум сценарии `mode: "full"` и `mode: "jit"`, если плагин влияет на JIT CSS;
- не полагаться на побочные эффекты порядка подключения нескольких плагинов.

## Рекомендации для авторов плагинов

1. Возвращайте чистые CSS-строки без побочных эффектов.
2. Используйте CSS custom properties Rarog вместо жёстко зашитых цветов.
3. Держите utilities и components раздельно.
4. Документируйте, какие классы и паттерны добавляет плагин.
5. Указывайте, зависит ли плагин от `@rarog/js`, React или Vue.

## Пример конфигурации

```js
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue}"],
  plugins: [
    require("./plugins/rarog-plugin-content"),
    "./plugins/rarog-plugin-marketing.cjs"
  ]
};
```
