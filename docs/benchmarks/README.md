# Benchmark program

Rarog больше не должен просто *казаться* быстрым. Этот раздел фиксирует единый benchmark program и связывает его с optimization backlog и release gates.

## Metrics

- **Build speed** — полный CSS/JS build path
- **JIT speed** — скорость локальной генерации проекта
- **Output size** — итоговый размер publishable CSS output
- **Runtime cost** — стоимость runtime theme diff / orchestration
- **Theme switch cost** — переключение white-label темы
- **Component render overhead** — накладные расходы на рендер компонентных шаблонов

## Compared stacks

- Bootstrap
- Tailwind
- UnoCSS
- shadcn/ui stack
- Chakra UI
- MUI

## Public benchmark page

Benchmark page строится из `benchmarks/results/latest.json` и публикуется в docs через `npm run bench:publish`.

- [Latest benchmark snapshot](latest.md)
- [Optimization backlog](optimization-backlog.md)
- [Reproducible benchmark workspace](../../benchmarks/README.md)

## Rules

1. Любая optimization claim должна ссылаться на metric category.
2. Любой regression выше agreed threshold должен попадать в backlog.
3. Release без benchmark snapshot для затронутого pipeline не считается завершённым.
