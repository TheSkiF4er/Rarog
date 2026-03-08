# RELEASE.md

Этот документ описывает **ручной релизный чеклист**, соответствующий текущему состоянию репозитория.

## Перед релизом

Прогоните:

```bash
npm install
npm run build
npm run test:unit
npm run docs:check
```

Дополнительно стоит проверить CLI smoke:

```bash
node packages/cli/bin/rarog.js --help
node packages/cli/bin/rarog.js validate
```

## Что проверить руками

Перед публикацией убедитесь, что синхронизированы:
- версия в `package.json`;
- версия в README и docs, если она упоминается явно;
- баннеры/headers в CSS и JS-файлах, если они содержат версию;
- реально поставляемый surface пакета.

## После изменения релизного контура

Обязательно проверьте:
- `README.md`
- `docs-site/getting-started.md`
- `docs-site/javascript.md`
- `CONTRIBUTING.md`
- `plugins/registry.json`, если менялись plugin-обещания

## Что пока не стоит обещать в релиз-нотах без отдельной проверки

Не анонсируйте как стабильные, пока нет полного контракта и сборки:
- React/Vue adapters;
- внешние JS-бандлы, если они не были собраны и проверены;
- UI kits или starters, если они не входят в опубликованный артефакт.
