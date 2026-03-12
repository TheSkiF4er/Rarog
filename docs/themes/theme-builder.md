# Конструктор тем / редактор токенов

Theme builder превращает редактирование токенов в полноценную продуктовую поверхность для white-label команд.

## Что входит

- визуальный редактор токенов;
- живой предпросмотр темы;
- сравнение тем бок о бок;
- import/export JSON темы;
- экспорт build manifest;
- предпросмотр доступности для критичных сочетаний текста и фона;
- управление плотностью, радиусами и тенями.

## Браузерное демо

Откройте:

```text
examples/ui-kits/white-label-demo/index.html
```

Используйте демо для:

1. онбординга бренда тенанта;
2. маркетингового ревью продукта;
3. финального согласования доступности;
4. экспорта стартового manifest для команд внедрения.

## Что экспортируется

Конструктор экспортирует два JSON-артефакта:

- manifest темы, совместимый с `rarog theme diff`;
- стартовый build manifest для handoff в продуктовую команду.

## Рекомендуемый workflow

```bash
rarog theme diff packages/themes/presets/enterprise-plus.json my-theme.json
rarog token inspect rarog.tokens.json --path=tokens.color.semantic
rarog audit a11y examples/ui-kits/white-label-demo
```

## Чек-лист white-label handoff

- подтвердить primary / secondary цвета;
- подтвердить цели по контрасту;
- сравнить тему с enterprise-базой;
- экспортировать JSON темы;
- экспортировать build manifest;
- закоммитить артефакты рядом с tenant docs.
