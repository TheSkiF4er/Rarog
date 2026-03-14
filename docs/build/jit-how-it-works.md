# Как работает JIT

## Flow

1. `rarog build` читает `rarog.config.*` и build manifest
2. если `mode === "jit"`, средство командной строки сканирует файлы из `content`
3. из найденных файлов извлекаются utility/class tokens
4. source CSS для utilities/components фильтруется по реально найденным классам
5. arbitrary value classes (`w-[...]`, `bg-[...]`, `translate-x-[...]` и т.д.) компилируются отдельно
6. итоговый bundle дедуплицируется и записывается в `outputs.jitCss`
7. при `rarog build --debug` рядом пишется `rarog.jit.debug.json`

## Что улучшено в этой итерации

- content scanning стал более предсказуемым для glob-like `content` patterns
- unknown utility-like classes теперь репортятся в build output
- arbitrary values поддерживают больше семейств utility
- итоговый output проходит dedupe pass
- появился debug report

## Новые средство командной строки команды

- `rarog build --debug`
- `rarog analyze`
- `rarog doctor`

## Что смотреть в debug report

- `contentPatterns`
- `scannedFiles`
- `usedClasses`
- `unknownClasses`
- `arbitraryIssues`

Если JIT "не видит" класс, сначала проверьте, попадает ли файл в `content`, а затем — есть ли класс в `unknownClasses`.
