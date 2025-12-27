# Rarog 3.x API Contract

Rarog 3.x фиксирует стабильный публичный API фреймворка. Всё, что описано
в этом документе, считается «контрактом» между Rarog и проектами, которые
его используют.

## Слои API

1. **CSS-токены (design tokens)**

   - Цвета (`--rarog-color-*`, см. `tokens.md`).
   - Spacing (`--rarog-space-*`).
   - Radius (`--rarog-radius-*`).
   - Тени (`--rarog-shadow-*`).
   - Брейкпоинты (`--rarog-breakpoint-*`).
   - Container Queries (`--rarog-cq-*`).
   - Grid-токены (`--rarog-grid-gap-x`, `--rarog-grid-gap-y`).

   Гарантии:

   - имена токенов в этих неймспейсах стабильны в пределах ветки 3.x;
   - значения могут эволюционировать без ломки семантики (например,
     уточнение оттенка primary-600).

2. **Utility-классы**

   - Базовые группы: layout, spacing, sizing, typography, effects, scroll,
     print, RTL, grid, responsive/state-утилиты.
   - Префиксы:

     - responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`;
     - state: `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:`,
       `peer-*`, `data-[state=*]`;
     - JIT arbitrary values: `w-[...]`, `bg-[#...]`, `rounded-[...]` и др.

   Гарантии:

   - все утилиты, перечисленные в `Utilities` + `API Reference`, считаются
     стабильными;
   - новые утилиты могут добавляться, но существующие не будут переименованы
     в рамках 3.x без миграционного гайда.

3. **Компоненты**

   - Структурные классы: `.btn`, `.alert`, `.badge`, `.navbar`, `.offcanvas`,
     `.modal`, `.dropdown`, `.tabs`, `.carousel`, `.stepper` и др.
   - Варианты: `-primary`, `-secondary`, `-success`, `-danger`, `-outline`,
     `-ghost`, `-sm`, `-lg` и т.п.

   Гарантии:

   - HTML-структура, описанная в разделе `Components`, считается опорной;
   - модификаторы и вариации, указанные в документации, стабильны;
   - внутренние вспомогательные классы без документации (часто с префиксом
     `rg-` и пометкой `@internal`) не входят в контракт.

4. **JS Core**

   - Глобальный неймспейс: `Rarog.*` (UMD) и именованные ESM-экспорты.
   - Компоненты:

     - `Rarog.Modal`,
     - `Rarog.Dropdown`,
     - `Rarog.Collapse`,
     - `Rarog.Offcanvas`,
     - `Rarog.Tooltip`,
     - `Rarog.Popover`,
     - `Rarog.Toast`,
     - `Rarog.Carousel`,
     - `Rarog.Stepper`,
     - Navbar helpers и др.

   - Data-API:

     - `data-rg-toggle`, `data-rg-target`, `data-rg-dismiss`, `data-rg-placement`
       и др.

   - События:

     - `rg:modal:show`, `rg:modal:shown`, `rg:modal:hide`, `rg:modal:hidden`;
     - аналогичные события для других компонентов (`rg:dropdown:*`,
       `rg:offcanvas:*`, `rg:carousel:*`, `rg:stepper:*` и т.д.).

   Гарантии:

   - публичные методы и события, описанные в `JavaScript` и `API Reference`,
     стабильны в пределах 3.x;
   - внутренние поля/методы (обычно с `_` или пометкой `@internal`) могут
     меняться без предупреждения.

5. **Config & CLI**

   - Конфиг: `rarog.config.(ts|js|json)`:

     - `theme` (tokens), `screens`, `variants`, `plugins`, `mode` (`full`/`jit`).

   - CLI:

     - `rarog build`,
     - `rarog init`,
     - `rarog docs`.

   Гарантии:

   - формат `rarog.config.*`, описанный в docs, считается стабильным;
   - команды CLI и их основные флаги не будут ломаться в рамках 3.x.

6. **Plugin API**

   - Хуки:

     - расширение токенов (`extendTokens`),
     - добавление утилит (`extendUtilities`),
     - добавление компонентов/JS (`extendComponents`),
     - интеграционные хуки JIT/Builder.

   - Официальные плагины:

     - `@rarog/plugin-forms`,
     - `@rarog/plugin-typography`, и последующие.

   Гарантии:

   - интерфейс плагина, описанный в разделе `Plugin API`, стабилен для 3.x;
   - новые хуки могут добавляться, но существующие не будут удалены без
     миграционного гайда.

## Что не входит в контракт

- Любые нестандартные классы, не описанные в документации.
- Внутренние файлы в `packages/*/src`, помеченные как `@internal`.
- Временные экспериментальные флаги/опции, явно помеченные как experimental.

## Обновление контракта

- При всех релизах 3.x:

  - раздел `API Contract` обновляется при добавлении нового публичного API;
  - breaking changes не допускаются — для них будет выпущена ветка 4.x
    и отдельный миграционный гайд.
