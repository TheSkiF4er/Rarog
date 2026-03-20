# Ant Design → Rarog

## Когда миграция особенно уместна

Переход особенно полезен, если команда хочет сохранить сильную enterprise/admin направленность интерфейсов, но при этом уйти от жёсткой привязки к готовому компонентному стеку и сделать темы/токены первым классом платформы.

## Стратегия сопоставления

- Ant Design Design Token / Less overrides → Rarog tokens и theme manifests
- `Layout`, `Grid`, `Space` → Rarog layout utilities и grid helpers
- `Form`, `Input`, `Select`, `Modal`, `Tabs` → Rarog component classes + accessibility review
- Ant-specific theme overrides → Rarog multi-theme manifests и preset-слой

## Рекомендуемый путь

1. Сначала зафиксируйте palette, radius, shadows, density и state-токены.
2. Затем мигрируйте layout shell: header, sider, content, page containers.
3. После этого переносите form-heavy и data-heavy страницы по экрану или по домену.
4. В конце заменяйте Ant-specific utility patterns и убирайте Less overrides из build-pipeline.

## High-value mappings

| Ant Design | Rarog | Комментарий |
| --- | --- | --- |
| `Layout` / `Content` | layout utilities + containers | лучше управлять shell через токены и utilities |
| `Row` / `Col` | `rg-row` / `rg-col-*` | прямой путь для сетки |
| `Space` | gap utilities | меньше вложенных обёрток |
| `Button type="primary"` | `btn btn-primary` | сохранить intent через токены |
| `Tag` | `badge` | бейджи с темизацией через semantic tokens |
| `Alert` | `alert` | перенести severity через color tokens |
| `Modal` | `dialog` patterns | отдельно проверить focus management |
| `Tabs` | `tabs` | проверить controlled-state сценарии |
| `Table` | table pattern + utilities | часто требует отдельной адаптации под продукт |

## Зоны ручной проверки

Особенно внимательно проверьте:

- формы с `Form.Item`, зависимыми validation states и help-text;
- таблицы с custom render, sticky columns и selection;
- date/time pickers, если у проекта есть локальные обёртки над Ant;
- overlays: dropdown, popover, modal, drawer;
- dark/compact themes и все Less-based overrides.

## Практический rollout

- **Шаг 1:** tokens и theme vocabulary
- **Шаг 2:** app shell и spacing/layout слой
- **Шаг 3:** формы, модалки, вкладки, alerts
- **Шаг 4:** сложные data-entry и table flows
- **Шаг 5:** удаление Ant CSS / Less overrides и финальный a11y + bundle audit
