# средство командной строки Pro tools

Рарог средство командной строки Pro добавляет диагностику, инспекцию токенов и инструменты поставки вокруг базового build-flow.

## Команды

```bash
rarog doctor
rarog token inspect rarog.tokens.json --path=tokens.color.semantic
rarog token diff rarog.tokens.json snapshots/rarog.tokens.prev.json
rarog theme diff packages/themes/presets/aurora.json packages/themes/presets/graphite.json
rarog component scaffold PricingCard --dir src/components --style css-module
rarog audit a11y src
rarog audit bundle dist
```

## Реальные порядок работы-сценарии

### 1. Проверка под стороннюю марку релиз-кандидата

```bash
rarog doctor
rarog audit bundle dist
rarog audit a11y src
```

Запускайте это перед отправкой tenant-specific bundle, чтобы увидеть конфиг, артефакты сборки и очевидные статические проблемы доступности.

### 2. Ревью изменения токенов

```bash
rarog token inspect rarog.tokens.json --path=tokens.color.semantic
rarog token diff rarog.tokens.json snapshots/rarog.tokens.prev.json
```

Это помогает система оформления maintainers увидеть, какие именно semantic aliases поменялись, вместо чтения полного JSON различие.

### 3. Сравнение новой темы с базовый уровень

```bash
rarog theme diff packages/themes/presets/enterprise-plus.json themes/acme-finance.json
```

Используйте это в code review, чтобы подтвердить, что изменились только ожидаемые semantic и среда выполнения токены.

### 4. Быстрый старт продуктового компонента

```bash
rarog component scaffold BillingHero --dir src/components/marketing
```

Scaffold создаёт React-компонент, стили, test stub и story для Storybook.

## Примечания

- `rarog audit a11y` статический и намеренно лёгкий. Он ловит пропущенные `alt`, слабые подписи кнопок и вероятно неподписанные поля ввода.
- `rarog audit bundle` ориентирован на размер и помогает замечать неожиданно крупные CSS/JS-артефакты.
