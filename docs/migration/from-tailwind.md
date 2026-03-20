# Миграция from Tailwind

Этот guide помогает командам, привыкшим к Tailwind, перейти на Rarog без потери utility-first темпа.

## Mapping mindset

- Tailwind config tokens → Rarog token architecture v2
- utility primitives → utility lookup + parity matrix
- UI kit via external libs → built-in components + adapters
- dark mode config → theme engine + scoped themes

## Рекомендуемый путь

1. перенести design tokens в raw + semantic layers;
2. закрыть parity-gap через audit matrix;
3. заменить ad-hoc headless compositions на Rarog components там, где это выгодно;
4. подключить official starter под нужный stack.
