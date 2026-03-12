# Заметки по доступности

Этот раздел агрегирует общие expectations по доступности для компонентного слоя Rarog.

## Базовый уровень

- keyboard-first interactions;
- видимые focus rings;
- поддержка reduced motion;
- contrast-safe defaults;
- ARIA roles/patterns для интерактивных widgets;
- предсказуемые disabled и invalid states.

## По семействам компонентов

- **Формы**: labels, descriptions, error text, required/invalid states
- **Оверлеи**: focus trap, escape handling, restore focus, expectations по inert background
- **Навигация**: поддержка стрелок там, где этого требует паттерн
- **Status UI**: alerts, badges, spinners не должны создавать шумные анонсы

## Командный workflow

Используйте [чек-лист доступности](../accessibility.md) и [шаблон](../accessibility-checklist-template.md) вместе с документацией по компонентам и визуальными fixtures.
