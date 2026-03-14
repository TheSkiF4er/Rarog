# Миграция from Bootstrap

Bootstrap-команды обычно уже привыкли к готовым компонентам и JS patterns. В Рарог migration focus смещается на tokens, themes и utility density.

## Mapping mindset

- Bootstrap variables → semantic + среда выполнения tokens
- Компонент CSS/JS → compatible Рарог Компонент pack
- theme customization → official themes + под стороннюю марку стартовый шаблон
- Документация usage → GitBook pages + испытательная площадка + copy-paste Примеры

## Рекомендуемый путь

1. сохранить знакомый Компонент-first слой;
2. постепенно внедрить utility classes для Компоновка и spacing;
3. вынести brand-variations в движок тем вместо форков CSS.
