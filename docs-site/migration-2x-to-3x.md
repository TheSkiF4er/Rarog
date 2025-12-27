# Миграция с Rarog 2.x на 3.0.0

Rarog 3.0.0 — это эволюция 2.x без агрессивных переписываний. Основные цели:

- закрепить API как **3.x API Contract**;
- добавить поддержку container queries и modern layout-паттернов;
- оформить полную RU/EN-документацию и версионирование.

Для большинства проектов миграция сводится к обновлению версии пакета.

## 1. Обновление пакета

- Если вы используете npm/pnpm/yarn:

```bash
npm install rarog-css@^3.0.0
# или
pnpm add rarog-css@^3.0.0
```

- Убедитесь, что:

  - `package.json` содержит `"rarog-css": "^3.0.0"`;
  - в сборке подключается актуальный `rarog.css`/`rarog-*.css` и `rarog.js`.

## 2. Проверка config & CLI

Rarog 3.0.0 использует тот же формат `rarog.config.*`, что и 2.x:

- `theme`, `screens`, `variants`, `plugins`, `mode`.

Проверьте, что:

- нет использования приватных полей/опций в конфиге;
- JIT-конфигурация (`content`, `mode: "jit"`) остаётся прежней.

Если вы писали свои плагины:

- убедитесь, что они используют задокументированный Plugin API,
  а не внутренние структуры.

## 3. Container Queries и modern layout (опционально)

Новый слой 3.0.0 — helpers для container queries:

- токены: `--rarog-cq-sm`, `--rarog-cq-md`, `--rarog-cq-lg`;
- классы:

  - `.rg-cq` — контейнер для `@container (inline-size)`;
  - `.rg-cq-page` — page-level контейнер `container-name: rg-page`;
  - утилиты вида `cq-md:d-flex`, `cq-md:rg-cols-2` внутри @container.

Пример:

```html
<section class="rg-cq">
  <div class="card d-grid cq-md:d-flex cq-md:rg-cols-2">
    ...
  </div>
</section>
```

Никаких breaking changes по layout нет: это **дополнительный** слой.

## 4. Очистка legacy 2.x

В 3.0.0:

- удалены/заморожены только те части, которые:

  - не были документированы;
  - были явно помечены как experimental/@internal.

Если вы опирались на недокументированные классы или внутренние JS-API:

- рекомендуется перейти на задокументированные утилиты/компоненты;
- см. раздел **API Contract**, чтобы понять, какие части считаются публичными.

## 5. Документация и i18n

- RU-документация обновлена под 3.x.
- EN-документация расширена и покрывает те же основные разделы:

  - Getting Started,
  - Why Rarog,
  - Tokens,
  - Utilities,
  - Components,
  - JavaScript,
  - Theming,
  - Guides,
  - Cookbook,
  - Accessibility,
  - Performance & Bundle Size,
  - Branding,
  - Migration.

Версионирование docs:

- /v2 — ссылка и справка по 2.x (legacy);
- /v3 — текущая документация (3.x, по умолчанию).

## 6. Checklist миграции

1. Обновить пакет до `3.0.0`.
2. Убедиться, что проект не использует внутренние API (при необходимости —
   заменить на задокументированные).
3. Перепроверить кастомные плагины Rarog — они должны использовать публичный
   Plugin API.
4. При желании — начать использовать container queries (`.rg-cq`, `cq-md:*`)
   в компонентах/секциях.
5. Обновить ссылки на документацию (при наличии), указав, что проект
   использует Rarog 3.x.
