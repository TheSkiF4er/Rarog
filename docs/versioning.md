# Versioning Policy

Rarog следует **SemVer**: `MAJOR.MINOR.PATCH`.

## Что означает версия

### PATCH

Patch-релизы используются для:
- bug fixes;
- security fixes;
- docs/build/publish fixes без расширения surface;
- non-breaking DX improvements.

PATCH **не должен**:
- менять stable API contract;
- удалять entrypoints;
- менять expected output paths в каноническом flow.

### MINOR

Minor-релизы используются для:
- добавления новых stable возможностей;
- расширения utilities/components/themes;
- продвижения surface из beta в stable;
- добавления opt-in возможностей без breaking changes.

MINOR может:
- добавлять новые subpath exports;
- вводить deprecation warnings;
- расширять CLI, если старый stable path остаётся рабочим.

### MAJOR

Major нужен для:
- удаления deprecated stable surface;
- изменения root package contract;
- смены канонического config/build flow;
- любого intentional breaking change для stable API.

## Deprecation policy

Для stable surface действует такой процесс:
1. Сначала появляется deprecation note в docs/README/release notes.
2. Затем surface остаётся рабочим минимум один minor-цикл, если нет security/critical reason убрать его раньше.
3. Удаление происходит только в следующем major.

Для beta/experimental surface срок может быть короче, но изменение всё равно должно быть задокументировано.

## RFC process для больших API изменений

RFC обязателен, если изменение затрагивает:
- root package exports;
- config/build flow;
- публичный Plugin API;
- adapter/runtime contracts;
- migration path для stable пользователей.

Минимальный RFC должен содержать:
- problem statement;
- proposed API;
- compatibility impact;
- migration plan;
- rollout plan;
- alternatives considered.

## Release policy

Канонический release gate:

```bash
npm ci
npm run release:verify
npm run build
npm run test:release
npm run verify:artifacts
npm run pack:packages
```

Только после этого CI публикует `rarog`, `@rarog/js`, `@rarog/react` и `@rarog/vue`.

## Support policy

- Stable surface поддерживается в пределах текущего major.
- Beta surface поддерживается best-effort с migration notes.
- Experimental surface не имеет долгосрочных compatibility guarantees.
