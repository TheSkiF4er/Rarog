# Миграция from Bootstrap

Bootstrap-команды обычно уже привыкли к готовым компонентам и JS patterns. В Rarog migration focus смещается на tokens, themes и utility density.

## Mapping mindset

- Bootstrap variables → semantic + runtime tokens
- component CSS/JS → compatible Rarog component pack
- theme customization → official themes + white-label starter
- docs usage → GitBook pages + playground + copy-paste examples

## Рекомендуемый путь

1. сохранить знакомый component-first слой;
2. постепенно внедрить utility classes для layout и spacing;
3. вынести brand-variations в theme engine вместо форков CSS.
