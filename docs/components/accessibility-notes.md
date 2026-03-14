# Заметки по доступности

Этот раздел агрегирует общие expectations по доступности для компонентного слоя Рарог.

## Базовый уровень

- keyboard-first interactions;
- видимые focus rings;
- поддержка reduced motion;
- contrast-safe defaults;
- ARIA roles/patterns для интерактивных widgets;
- предсказуемые disabled и invalid states.

## По семействам компонентов

- **Формы**: labels, descriptions, error Текст, required/invalid states
- **Оверлеи**: focus trap, escape handling, restore focus, expectations по inert Фон
- **Навигация**: поддержка стрелок там, где этого требует паттерн
- **Состояние UI**: alerts, badges, spinners не должны создавать шумные анонсы

## Командный порядок работы

Используйте [чек-лист доступности](../accessibility.md) и [шаблон](../accessibility-checklist-template.md) вместе с документацией по компонентам и визуальными fixtures.
