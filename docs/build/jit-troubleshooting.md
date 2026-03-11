# JIT troubleshooting guide

## Симптом: класс не попал в output

Проверьте по порядку:

1. файл входит в `content`
2. класс записан как строковый литерал, который может увидеть scanner
3. класс не попал в список unknown utility-like classes
4. если это arbitrary value, он не содержит unsafe значения (`;` / `}`)

## Команды для диагностики

### `rarog analyze`

Показывает:

- сколько файлов просканировано
- сколько классов найдено
- какие utility-like классы считаются неизвестными

### `rarog doctor`

Полезно, когда:

- не выбран config/build manifest
- `content` не матчится ни к одному файлу
- отсутствуют source CSS артефакты utilities/components

### `rarog build --debug`

Записывает JSON-отчёт рядом с JIT bundle, чтобы можно было посмотреть точный scan result.

## Типовые причины проблем

- слишком узкий `content`
- классы собираются динамически без явных строк
- класс относится к utility family, который ещё не реализован
- arbitrary value использует неподдерживаемое семейство
- проект ожидает stacked variants шире, чем текущий generator

## Recommended workflow

1. `rarog doctor`
2. `rarog analyze`
3. `rarog build --debug`
4. поправить `content` / utility usage / missing utility backlog
