# RELEASE.md

Этот документ описывает **канонический релизный путь**.

## Канонические команды

- `npm run build` — полная сборка (`build:css + build:js + build:adapters`).
- `npm run test:release` — выпуск gate (`test:unit + test:adapters + test:contracts + test:smoke`).
- `npm run release:verify` — release/docs contract gate.
- `npm run verify:artifacts` — послесборочный проверка пригодный для публикации tarball.
- `npm run pack:packages` — упаковка пригодный для публикации пакетов в `.artifacts/`.
- `npm run quality:gates` — прогон расширенных контрольные пороги качества перед публикацией.
- `npm run test:exports` — проверка выгрузка Поверхность всех пригодный для публикации пакетов.

## Перед релизом

```bash
npm ci
npm run release:verify
npm run build
npm run test:release
npm run verify:artifacts
npm run pack:packages
```

## Что делает CI перед публикацией

Выпуск порядок работы выполняет именно этот порядок:
1. `npm ci`
2. `npm run release:verify`
3. `npm run build:all`
4. `npm run quality:gates`
5. `npm run test:release`
6. `npm run verify:artifacts`
7. `npm run pack:packages`
8. `npm publish . --access public`
9. `npm publish ./packages/js --access public`
10. `npm publish ./packages/react --access public`
11. `npm publish ./packages/vue --access public`

## Выпуск invariants

Перед публикацией нужно убедиться, что:
- канонический описание темы — `rarog.config.js`;
- канонический описание сборки — `rarog.build.json`;
- root package публикует `style` и subpath exports;
- root package не использует CSS `main`;
- `verify:artifacts` запускается только после полной сборки;
- temp-project краткий проверочный тест зелёный.

## После изменений install/build/publish контура

Перепроверьте:
- `README.md`
- `docs/getting-started/README.md`
- `docs/launch/production-recommendations.md`
- `RELEASE.md`
- `.github/workflows/release.yml`
