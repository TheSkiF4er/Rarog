# RELEASE.md

Этот документ описывает **канонический релизный путь** для текущего состояния репозитория.

## Канонические команды

- `npm run build` — полная сборка репозитория (`build:css + build:js + build:adapters`).
- `npm run docs:check` — проверка docs-контракта и сборка VitePress.
- `npm run test:release` — минимальный обязательный тестовый gate перед публикацией (`test:unit + test:adapters + test:contracts`).
- `npm run release:verify` — проверка release/docs-контракта перед сборкой и публикацией.

## Перед релизом

Прогоните:

```bash
npm ci
npm run release:verify
npm run build
npm run test:release
npm run pack:packages
```

Дополнительно стоит проверить CLI smoke:

```bash
node packages/cli/bin/rarog.js --help
node packages/cli/bin/rarog.js validate
```

## Что проверяется в GitHub Actions

Release workflow перед `npm publish` выполняет:

- `npm run release:verify`
- `npm run build:all`
- `npm run test:release`
- `npm run pack:packages`

Это означает, что релизный tag не должен обходить docs/release-проверки и основной тестовый gate.

## Что проверить руками

Перед публикацией убедитесь, что синхронизированы:
- версия в `package.json`;
- версия в README и docs, если она упоминается явно;
- баннеры/headers в CSS и JS-файлах, если они содержат версию;
- реально поставляемый surface пакета.

## После изменения релизного контура

Обязательно перепроверьте:
- `README.md`
- `docs/getting-started.md`
- `docs/javascript.md`
- `CONTRIBUTING.md`
- `plugins/registry.json`, если менялись plugin-обещания

## Что пока не стоит обещать в релиз-нотах без отдельной проверки

Не анонсируйте как стабильные, пока нет отдельного подтверждения качества и упаковки:
- React/Vue adapters;
- внешние JS-бандлы, если они не были собраны и проверены;
- UI kits или starters, если они не входят в опубликованный артефакт.
