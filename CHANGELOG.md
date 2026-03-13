# Changelog

## 1.0.0

### Final 1.0 publication
- published the 1.0 release notes, architecture overview, roadmap after 1.0, known limitations, and support policy as part of the release surface
- clarified the frozen 1.x package contract and post-release support expectations
- kept RC and release checks as the gate for any published package

### Core freeze
- stabilized the public reactivity and rendering primitives
- documented semver guarantees for 1.x
- kept `computed()` only as a compatibility alias for `derive()`

### Release surface
- keyed rendering with `For`
- SSR-lite hydration via `hydrate()`
- router package, starters, and Vite plugin
- migration/comparison/benchmark/showcase docs

### Positioning
- Farog is positioned as a smaller, more explicit runtime for widgets, embeds, microfrontends, and performance-sensitive small/medium apps

## 1.0.0-rc.1

### API freeze
- froze the public 1.0 API for runtime, router, server utilities, and Vite plugin entry points
- documented the semver boundary, upgrade path, feature matrix, and known limitations

### Release candidate readiness
- added an explicit RC checklist and verification script
- required release artifacts before an RC can be treated as valid
- aligned release notes, migration guidance, and support docs with the final 1.0 surface
