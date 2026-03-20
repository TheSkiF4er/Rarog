# Бэклог оптимизаций

## P0

- Снизить время core-сборки за счёт кеширования нормализации токенов между CSS и JS build-steps.
- Дедуплицировать escape-обработку JIT-селекторов при повторных content-scan.
- Ввести benchmark threshold alerts в CI для регрессий сборки и JIT.

## P1

- Добавить pinned checkouts конкурентов для parity-сценариев Tailwind и UnoCSS.
- Добавить browser-based runtime benchmark для стоимости переключения темы и initial hydration.
- Разделить component CSS output на опциональные бандлы для dashboard и marketing сценариев.

## P2

- Добавить Storybook-driven захват render overhead по семействам компонентов.
- Публиковать график исторических трендов по median-результатам между релизами.
- Отслеживать стоимость import/export тем для больших наборов токенов.
