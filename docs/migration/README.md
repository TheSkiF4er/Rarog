# Migration

Миграция между версиями, политика версионирования и стабильность публичных поверхностей.

## Included legacy sources

- `migration-1x-to-2x.md`
- `migration-2x-to-3x.md`
- `versioning.md`
- `stability.md`

## Imported from `migration-1x-to-2x.md`

## Migration 1.x → 2.0.0

Выпуск **Rarog 2.0.0** акцентирован на шлифовке, стабилизации API и позиционировании
фреймворка как альтернативы связке Tailwind + Bootstrap.

Основная цель миграции — сделать переход с 1.x на 2.x максимально предсказуемым.

### Ключевые изменения

#### 1. Удалены legacy-классы `.grid-2`, `.grid-3`, `.grid-4`

В 1.x эти классы были помечены как legacy:

```css
/* Legacy simple grid helpers — сохранены для обратной совместимости.
 * Предпочтительно использовать .rg-row / .rg-col.
 */
.grid-2 { ... }
.grid-3 { ... }
.grid-4 { ... }
```

В 2.0.0 они **удалены**.

##### Как мигрировать

Если в проекте использовались:

```html
<div class="grid-3 gap-4">
  ...
</div>
```

Рекомендуемый эквивалент:

```html
<div class="rg-row rg-gap-y-4">
  <div class="rg-col-12 rg-col-md-4">
    ...
  </div>
  <div class="rg-col-12 rg-col-md-4">
    ...
  </div>
  <div class="rg-col-12 rg-col-md-4">
    ...
  </div>
</div>
```

В общем случае:

- `grid-2` → сетка на основе `.rg-row` + `.rg-col-6` (или `.rg-col-md-6`) для двух колонок.
- `grid-3` → `.rg-col-md-4`.
- `grid-4` → `.rg-col-md-3`.

#### 2. Уточнены naming-конвенции

Для ветки 2.x действуют следующие требования:

- Layout и сетка:
  - `rg-*` — префикс для структурных классов сетки (`rg-row`, `rg-col-*`, контейнеры, order/offset).
- Компоненты:
  - `btn-*`, `alert-*`, `badge-*`, `nav-*`, `pagination-*`, `progress-*`, `modal-*` и т.д.
- Утилиты:
  - короткие, семантически понятные имена (`d-flex`, `mt-4`, `text-center`, `bg-primary`).
- Responsive:
  - префиксы `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.
- Состояния:
  - `hover:*`, `focus:*` поверх базового класса.
- JIT:
  - arbitrary-значения в виде `w-[320px]`, `bg-[#0f172a]`, `text-[white]`.

Существующие классы 1.x, которые соответствуют этим правилам, **не менялись** — 2.0.0 вносит
одно реальное breaking change: удаление `.grid-2/3/4`.

#### 3. Документация и API Reference

- Добавлен раздел **API Reference**, фиксирующий список поддерживаемых утилит и компонентов.
- Добавлен раздел **Versioning & Support**:
  - описывает политику semver и поддержку ветки 2.x.

### Чек-лист миграции

1. Найти использование `.grid-2`, `.grid-3`, `.grid-4` и заменить их на сетку `rg-row`/`rg-col-*`.
2. Проверить кастомные темы и токены:
   - структура `rarog.config.js` не изменилась, но рекомендуется свериться с актуальным примером.
3. Убедиться, что JIT-конфигурация (`mode: "jit"`, `content`) соответствует реальной структуре проекта.
4. Обновить версии зависимостей/артефактов (CSS/JS) до 2.0.0.

После выполнения шагов выше проект должен без проблем работать на Rarog 2.0.0.


## Imported from `migration-2x-to-3x.md`

## Миграция с Rarog 2.x на 3.0.0

Rarog 3.0.0 — это эволюция 2.x без агрессивных переписываний. Основные цели:

- закрепить API как **3.x API Contract**;
- добавить поддержку container queries и modern layout-паттернов;
- оформить полную RU/EN-документацию и версионирование.

Для большинства проектов миграция сводится к обновлению версии пакета.

### 1. Обновление пакета

- Если вы используете npm/pnpm/yarn:

```bash
npm install rarog@^3.0.0
## или
pnpm add rarog@^3.0.0
```

- Убедитесь, что:

  - `package.json` содержит `"rarog": "^3.0.0"`;
  - в сборке подключается актуальный `rarog.css`/`rarog-*.css` и `rarog.js`.

### 2. Проверка config & CLI

Rarog 3.0.0 использует тот же формат `rarog.config.*`, что и 2.x:

- `theme`, `screens`, `variants`, `plugins`, `mode`.

Проверьте, что:

- нет использования приватных полей/опций в конфиге;
- JIT-конфигурация (`content`, `mode: "jit"`) остаётся прежней.

Если вы писали свои плагины:

- убедитесь, что они используют задокументированный Plugin API,
  а не внутренние структуры.

### 3. Container Queries и modern layout (опционально)

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

### 4. Очистка legacy 2.x

В 3.0.0:

- удалены/заморожены только те части, которые:

  - не были документированы;
  - были явно помечены как experimental/@internal.

Если вы опирались на недокументированные классы или внутренние JS-API:

- рекомендуется перейти на задокументированные утилиты/компоненты;
- см. раздел **API Contract**, чтобы понять, какие части считаются публичными.

### 5. Документация и i18n

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

### 6. Checklist миграции

1. Обновить пакет до `3.0.0`.
2. Убедиться, что проект не использует внутренние API (при необходимости —
   заменить на задокументированные).
3. Перепроверить кастомные плагины Rarog — они должны использовать публичный
   Plugin API.
4. При желании — начать использовать container queries (`.rg-cq`, `cq-md:*`)
   в компонентах/секциях.
5. Обновить ссылки на документацию (при наличии), указав, что проект
   использует Rarog 3.x.


## Imported from `versioning.md`

## Versioning Policy

Rarog следует **SemVer**: `MAJOR.MINOR.PATCH`.

### Что означает версия

#### PATCH

Patch-релизы используются для:
- bug fixes;
- security fixes;
- docs/build/publish fixes без расширения surface;
- non-breaking DX improvements.

PATCH **не должен**:
- менять stable API contract;
- удалять entrypoints;
- менять expected output paths в каноническом flow.

#### MINOR

Minor-релизы используются для:
- добавления новых stable возможностей;
- расширения utilities/components/themes;
- продвижения surface из beta в stable;
- добавления opt-in возможностей без breaking changes.

MINOR может:
- добавлять новые subpath exports;
- вводить deprecation warnings;
- расширять CLI, если старый stable path остаётся рабочим.

#### MAJOR

Major нужен для:
- удаления deprecated stable surface;
- изменения root package contract;
- смены канонического config/build flow;
- любого intentional breaking change для stable API.

### Deprecation policy

Для stable surface действует такой процесс:
1. Сначала появляется deprecation note в docs/README/release notes.
2. Затем surface остаётся рабочим минимум один minor-цикл, если нет security/critical reason убрать его раньше.
3. Удаление происходит только в следующем major.

Для beta/experimental surface срок может быть короче, но изменение всё равно должно быть задокументировано.

### RFC process для больших API изменений

RFC обязателен, если изменение затрагивает:
- root package exports;
- config/build flow;
- публичный Plugin API;
- adapter/runtime contracts;
- migration path для stable пользователей.

Минимальный RFC должен содержать:
- problem statement;
- proposed API;
- compatibility impact;
- migration plan;
- rollout plan;
- alternatives considered.

### Release policy

Канонический release gate:

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

- Stable surface поддерживается в пределах текущего major.
- Beta surface поддерживается best-effort с migration notes.
- Experimental surface не имеет долгосрочных compatibility guarantees.


## Imported from `stability.md`

## Stability Matrix

Этот документ фиксирует, что в Rarog считается **stable**, **beta** и **experimental**.

### Public surface matrix

| Surface | Status | Compatibility promise |
|---|---|---|
| Core CSS | Stable | Не ломается в patch/minor без deprecation window. |
| Utilities CSS | Stable | Имена классов и поведение меняются только через documented deprecation. |
| Components CSS | Stable | Breaking changes только в major. |
| Built-in themes | Stable | Публичные theme entrypoints сохраняются в пределах major. |
| CLI flow (`init`, `validate`, `build`) | Stable | Канонический flow поддерживается как основной DX path. |
| `rarog.config.js` | Stable | Основной theme-config contract. |
| `rarog.build.json` | Stable | Основной build-manifest contract. |
| `rarog.config.ts` | Beta | Поддерживается как compatibility-path. Может быть упрощён или убран в следующем major. |
| `@rarog/js` | Beta | API usable, но ещё расширяется. |
| `@rarog/react` | Experimental | Без strong compatibility guarantees. |
| `@rarog/vue` | Experimental | Без strong compatibility guarantees. |
| Plugin API | Experimental | Все большие изменения идут через RFC. |

### Что значит каждый статус

#### Stable

Гарантии:
- SemVer обязателен;
- breaking changes только в major;
- deprecations документируются заранее;
- docs и publish surface должны совпадать с реальностью.

#### Beta

Гарантии:
- surface публичный, но может ещё доформировываться;
- minor-релизы могут менять детали API, если это явно задокументировано;
- при возможности даётся migration note.

#### Experimental

Гарантии:
- feedback-first surface;
- изменения возможны даже в minor;
- production adoption только после собственной проверки команды.

### Stable-by-default rules

Следующие вещи должны оставаться предсказуемыми:
- один канонический theme-config (`rarog.config.js`);
- один канонический build-manifest (`rarog.build.json`);
- root package без CSS `main`;
- `verify:artifacts` только после полной сборки;
- publish pipeline без обхода release/test/artifact gates.

### Изменение статуса surface

Surface можно перевести:
- из Experimental в Beta — после smoke/compatibility gates и стабилизации docs;
- из Beta в Stable — после как минимум одного релизного цикла без неожиданных breaking changes и с понятным publish contract.
