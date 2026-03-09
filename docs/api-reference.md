# API Reference (Rarog 3.x)

Этот раздел фиксирует **стабильный публичный API 3.x** для CSS, компонентов и JS Core. Используйте его как быстрый справочник по именам классов, конструкторам, методам и событиям.

## JS Core

Канонический пакетный surface:

- `@rarog/js`
- default export: `Rarog`
- именованные экспорты: `Dropdown`, `Collapse`, `Modal`, `Offcanvas`, `Toast`, `Tooltip`, `Popover`, `Carousel`, `Stepper`, `Datepicker`, `DatetimePicker`, `Select`, `Combobox`, `TagsInput`, `DataTable`, `InputMask`, `Events`
- type exports: `RarogEventMap`, `RarogEventName`, `RarogEventDetail<TName>`, `RarogCustomEvent<TName>`

### Общий lifecycle contract

Для компонентов с открытием/закрытием Rarog 3.x использует единый контракт:

- pre-event: `rg:<component>:show`
- post-event: `rg:<component>:shown`
- pre-hide: `rg:<component>:hide`
- post-hide: `rg:<component>:hidden`

Где runtime уже поддерживает lifecycle-контракт, pre-events считаются **cancelable** и могут использоваться с `preventDefault()` перед изменением состояния.

`event.detail` в lifecycle-событиях может содержать:

- `instance` — инстанс компонента
- `trigger` — DOM-элемент, инициировавший действие, если применимо
- `target` — основной DOM-target компонента, если применимо
- `placement` — для `Tooltip` / `Popover`
- `index`, `fromIndex`, `toIndex`, `direction` — для `Carousel`
- `value` — для `Datepicker`, `Select`, `Combobox`, `Stepper`

### Constructors / methods

#### Overlay & disclosure

- `Dropdown.getInstance(element)` / `Dropdown.getOrCreate(element, options)`
- `Collapse.getInstance(element)` / `Collapse.getOrCreate(element, options)`
- `Modal.getInstance(element)` / `Modal.getOrCreate(element, options)`
- `Offcanvas.getInstance(element)` / `Offcanvas.getOrCreate(element, options)`
- `Toast.getInstance(element)` / `Toast.getOrCreate(element, options)`
- `Tooltip.getInstance(element)` / `Tooltip.getOrCreate(element, options)`
- `Popover.getInstance(element)` / `Popover.getOrCreate(element, options)`

Методы:

- `show()`
- `hide()`
- `toggle()` — где применимо

#### Flow & selection

- `Carousel.getInstance(element)` / `Carousel.getOrCreate(element, options)`
  - `next()`
  - `prev()`
  - `goTo(index)`
  - `play()`
  - `pause()`
  - `destroy()`
- `Stepper.getInstance(element)` / `Stepper.getOrCreate(element, options)`
  - `next()`
  - `prev()`
  - `goTo(index)`
  - `reset()`
  - `destroy()`
- `Datepicker.getInstance(element)` / `Datepicker.getOrCreate(element, options)`
  - `show()` / `hide()` / `toggle()`
  - `dispose()`
- `DatetimePicker.getInstance(element)` / `DatetimePicker.getOrCreate(element, options)`
- `Select.getInstance(element)` / `Select.getOrCreate(element, options)`
  - `show()` / `hide()` / `toggle()`
  - `dispose()`
- `Combobox.getInstance(element)` / `Combobox.getOrCreate(element, options)`
  - `show()` / `hide()` / `toggle()`
  - `dispose()`
- `TagsInput.getInstance(element)` / `TagsInput.getOrCreate(element, options)`
  - `addTag(value)`
  - `removeTag(value)`
  - `clear()`
  - `dispose()`
- `DataTable.getInstance(element)` / `DataTable.getOrCreate(element, options)`
  - `dispose()`
- `InputMask.apply(element, pattern)`
- `InputMask.remove(element)`

### Stable event names

#### Dropdown / Collapse / Modal / Offcanvas / Toast

- `rg:dropdown:show|shown|hide|hidden`
- `rg:collapse:show|shown|hide|hidden`
- `rg:modal:show|shown|hide|hidden`
- `rg:offcanvas:show|shown|hide|hidden`
- `rg:toast:show|shown|hide|hidden`

#### Tooltip / Popover

- `rg:tooltip:show|shown|hide|hidden`
- `rg:popover:show|shown|hide|hidden`

Дополнительно `event.detail.placement` содержит placement popup-элемента.

#### Carousel

Lifecycle:

- `rg:carousel:slide`
- `rg:carousel:slid`

Legacy-compatible события навигации:

- `rg:carousel:next`
- `rg:carousel:prev`
- `rg:carousel:goto`
- `rg:carousel:play`
- `rg:carousel:pause`

#### Stepper

- `rg:stepper:change`
- `rg:stepper:changed`
- `rg:stepper:next`
- `rg:stepper:prev`
- `rg:stepper:goto`
- `rg:stepper:reset`

#### Datepicker / Select / Combobox

- `rg:datepicker:show|shown|hide|hidden`
- `rg:datepicker:select`
- `rg:select:show|shown|hide|hidden`
- `rg:select:change`
- `rg:combobox:show|shown|hide|hidden`
- `rg:combobox:change`

Legacy-compatible для combobox:

- `rg:combobox:open`
- `rg:combobox:close`

#### TagsInput / DataTable / Core

- `rg:tags-input:add`
- `rg:tags-input:remove`
- `rg:tags-input:change`
- `rg:table:search`
- `rg:table:sort`
- `rg:table:page`
- `rg:table:update`
- `rg:core:dispose`

### Typed events in TypeScript

В `packages/js/src/index.d.ts` экспортируются:

- `RarogEventMap`
- `RarogEventName`
- `RarogEventDetail<TName>`
- `RarogCustomEvent<TName>`

Пример:

```ts
import type { RarogCustomEvent, RarogEventDetail } from "@rarog/js";

function onShown(event: RarogCustomEvent<"rg:modal:shown">) {
  const detail: RarogEventDetail<"rg:modal:shown"> = event.detail;
  console.log(detail.instance);
}
```

### Namespace helpers

- `Rarog.config`
- `Rarog.setDebug(value)`
- `Rarog.isDebugEnabled()`
- `Rarog.initDataApi(root?)`
- `Rarog.init(root?)`
- `Rarog.dispose(root?)`
- `Rarog.reinit(root?)`
- `Rarog.Events.on/off/emit(...)`

## CSS / Components

Остальные группы API — utilities, токены, компоненты и модификаторы — описаны в профильных разделах docs. Ветка 3.x считает стабильными только те классы и варианты, которые явно перечислены в документации и migration guides.
