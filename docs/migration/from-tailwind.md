# Миграция from Tailwind

Этот guide помогает командам, привыкшим к Tailwind, перейти на Рарог без потери с опорой на вспомогательные классы темпа.

## Mapping mindset

- Tailwind config tokens → Рарог Архитектура токенов v2
- utility базовые элементы → utility справочный + parity matrix
- UI kit via external libs → built-in Компонентs + согласующие слои
- dark mode config → движок тем + scoped themes

## Рекомендуемый путь

1. перенести design tokens в raw + semantic Слои;
2. закрыть parity-gap через проверка matrix;
3. заменить ad-hoc headless compositions на Рарог Компонентs там, где это выгодно;
4. подключить official стартовый шаблон под нужный stack.
