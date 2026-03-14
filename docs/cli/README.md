# средство командной строки

Используйте средство командной строки для локальной разработки, сборок и диагностики.

## Частые команды

```bash
rarog build
rarog build --debug
rarog analyze
rarog doctor
rarog token inspect rarog.tokens.json --path=tokens.color.semantic
rarog token diff rarog.tokens.json snapshots/rarog.tokens.prev.json
rarog theme diff packages/themes/presets/enterprise-plus.json themes/acme.json
rarog component scaffold PricingCard --dir src/components
rarog audit a11y src
rarog audit bundle dist
rarog inspect classes src/index.html
rarog migrate bootstrap --input src/index.html --output src/index.migrated.html
rarog migrate tailwind --input src/App.tsx --output src/App.rg.tsx
```

## Когда использовать средство командной строки

Используйте средство командной строки, когда вам нужно:

- запускать локальные development-flows;
- собирать production-output;
- инспектировать конфиг или поведение рантайма.

## См. также

- [Конфигурация](../config/README.md)
- [Сборка](../build/README.md)

## Диагностика JIT

- `rarog build --debug` — пишет debug JSON рядом с JIT output
- `rarog analyze` — показывает scan summary и неизвестные utility-like classes
- `rarog doctor` — быстро проверяет config/build/JIT Поверхность

## Toolkit для миграции

- `rarog inspect classes` — показывает mix из Рарог / Bootstrap / Tailwind классов
- `rarog migrate bootstrap` — first-pass codemod для Bootstrap-разметки
- `rarog migrate tailwind` — first-pass codemod для Tailwind-разметки

## Pro tools

- `rarog token inspect` — показывает leaf token values по файлу или dot-path
- `rarog token diff` — сравнивает два JSON snapshot токенов
- `rarog theme diff` — сравнивает semantic/runtime manifests тем
- `rarog component scaffold` — генерирует стартовый шаблон Компонент files
- `rarog audit a11y` — лёгкий static accessibility проверка
- `rarog audit bundle` — проверяет размеры CSS/JS output

Подробнее: [средство командной строки Pro tools](./pro-tools.md)

## средство командной строки Pro порядок работы

Рарог средство командной строки Pro теперь включает эксплуатационные команды для quality bar и система оформления governance:

- `rarog doctor`
- `rarog token inspect`
- `rarog token diff`
- `rarog theme diff`
- `rarog component scaffold`
- `rarog audit a11y`
- `rarog audit bundle`

Для выпуск-готовности используйте также:

- `npm run test:starters-install`
- `npm run test:package-matrix`
- `npm run test:examples-ci`
- `npm run docs:links`
