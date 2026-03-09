# RELEASE.md

Этот документ описывает **ручной релизный чеклист**, соответствующий текущему состоянию репозитория.

`npm run build` в текущем контракте — это каноническая полная сборка (`build:css + build:js + build:adapters`).

`npm run release:verify` теперь включает не только release metadata check, но и `npm run docs:check`, чтобы docs/release-поверхность не расходилась с root scripts.

`npm run release:verify` теперь включает не только release metadata check, но и `npm run docs:check`, чтобы docs/release-поверхность не расходилась с root scripts.

## Перед релизом

Прогоните:

```bash
npm ci
npm run release:verify
npm run build
npm run test:unit
npm run test:adapters
npm run test:contracts
npm run pack:packages
```

`npm run test:adapters` нужен отдельно даже после `npm run build`: эта команда принудительно пересобирает адаптерный `dist` перед smoke-тестами и снижает риск локального запуска по устаревшим артефактам.

`npm run test:adapters` нужен отдельно даже после `npm run build`: эта команда принудительно пересобирает адаптерный `dist` перед smoke-тестами и снижает риск локального запуска по устаревшим артефактам.

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
- `docs/getting-started.md`
- `docs/javascript.md`
- `CONTRIBUTING.md`
- `plugins/registry.json`, если менялись plugin-обещания

## Что пока не стоит обещать в релиз-нотах без отдельной проверки

Не анонсируйте как стабильные, пока нет полного контракта и сборки:
- React/Vue adapters;
- внешние JS-бандлы, если они не были собраны и проверены;
- UI kits или starters, если они не входят в опубликованный артефакт.
