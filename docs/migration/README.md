# Миграция

Этот раздел включает не только миграцию между версиями Рарог, но и adoption toolkit для перехода со сторонних UI-стеков.

## Доступные гайды

- [Bootstrap → Рарог](bootstrap-to-rarog.md)
- [Tailwind → Рарог](tailwind-to-rarog.md)
- [Chakra UI → Рарог](chakra-to-rarog.md)
- [MUI → Рарог](mui-to-rarog.md)
- [Ant Design → Рарог](ant-design-to-rarog.md)
- [Таблицы сопоставления классов](class-mapping-tables.md)
- [Migration Assistant MVP](migration-assistant-mvp.md)

## Когда переход на Рарог особенно оправдан

Рарог особенно полезен, когда команде нужно:

- уйти от React-only или framework-specific UI Поверхность;
- выстроить токены и темы как source of truth;
- поддерживать несколько брендов или tenant themes;
- стандартизировать dashboard/admin UI и дисциплину релизов.

## Проверка полноты перед миграцией

Перед стартом миграции зафиксируйте:

1. список компонентов и form patterns, которые критичны для продукта;
2. текущую модель темизации и список брендов;
3. требования по a11y, bundle size и SSR/SPA compatibility;
4. план перехода: big bang, по экранам или по слоям (tokens → Компоновка → Компонентs).
