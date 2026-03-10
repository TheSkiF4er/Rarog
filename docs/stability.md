# Stability Matrix

Этот документ фиксирует, что в Rarog считается **stable**, **beta** и **experimental**.

## Public surface matrix

| Surface | Status | Compatibility promise |
|---|---|---|
| Core CSS | Stable | Не ломается в patch/minor без deprecation window. |
| Utilities CSS | Stable | Имена классов и поведение меняются только через documented deprecation. |
| Components CSS | Stable | Breaking changes только в major. |
| Built-in themes | Stable | Публичные theme entrypoints сохраняются в пределах major. |
| CLI flow (`init`, `validate`, `build`) | Stable | Канонический flow поддерживается как основной DX path. |
| `rarog.config.js` | Stable | Основной theme-config contract. |
| `rarog.build.json` | Stable | Основной build-manifest contract. |
| `rarog.config.ts` | Beta | Поддерживается как compatibility-path. Может быть упрощён или убран в следующем major. |
| `@rarog/js` | Beta | API usable, но ещё расширяется. |
| `@rarog/react` | Experimental | Без strong compatibility guarantees. |
| `@rarog/vue` | Experimental | Без strong compatibility guarantees. |
| Plugin API | Experimental | Все большие изменения идут через RFC. |

## Что значит каждый статус

### Stable

Гарантии:
- SemVer обязателен;
- breaking changes только в major;
- deprecations документируются заранее;
- docs и publish surface должны совпадать с реальностью.

### Beta

Гарантии:
- surface публичный, но может ещё доформировываться;
- minor-релизы могут менять детали API, если это явно задокументировано;
- при возможности даётся migration note.

### Experimental

Гарантии:
- feedback-first surface;
- изменения возможны даже в minor;
- production adoption только после собственной проверки команды.

## Stable-by-default rules

Следующие вещи должны оставаться предсказуемыми:
- один канонический theme-config (`rarog.config.js`);
- один канонический build-manifest (`rarog.build.json`);
- root package без CSS `main`;
- `verify:artifacts` только после полной сборки;
- publish pipeline без обхода release/test/artifact gates.

## Изменение статуса surface

Surface можно перевести:
- из Experimental в Beta — после smoke/compatibility gates и стабилизации docs;
- из Beta в Stable — после как минимум одного релизного цикла без неожиданных breaking changes и с понятным publish contract.
