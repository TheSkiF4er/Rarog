# RELEASE.md

Этот документ описывает **канонический релизный путь**.

## Канонические команды

- `npm run build` — полная сборка (`build:css + build:js + build:adapters`).
- `npm run test:release` — release gate (`test:unit + test:adapters + test:contracts + test:smoke`).
- `npm run release:verify` — release/docs contract gate.
- `npm run verify:artifacts` — post-build проверка publishable tarball.
- `npm run pack:packages` — упаковка publishable пакетов в `.artifacts/`.

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

Release workflow выполняет именно этот порядок:
1. `npm ci`
2. `npm run release:verify`
3. `npm run build:all`
4. `npm run test:release`
5. `npm run verify:artifacts`
6. `npm run pack:packages`
7. `npm publish . --access public`
8. `npm publish ./packages/js --access public`
9. `npm publish ./packages/react --access public`
10. `npm publish ./packages/vue --access public`

## Release invariants

Перед публикацией нужно убедиться, что:
- канонический theme-config — `rarog.config.js`;
- канонический build-manifest — `rarog.build.json`;
- root package публикует `style` и subpath exports;
- root package не использует CSS `main`;
- `verify:artifacts` запускается только после полной сборки;
- temp-project smoke test зелёный.

## После изменений install/build/publish контура

Перепроверьте:
- `README.md`
- `docs/getting-started.md`
- `docs/stability.md`
- `docs/versioning.md`
- `.github/workflows/release.yml`
