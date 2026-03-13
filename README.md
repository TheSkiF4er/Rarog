# Farog

Farog 1.0 is a zero-dependency reactive UI runtime for teams that want a **small runtime**, **explicit reactivity**, and **internals they can actually understand**.

## Positioning

Farog should not be sold as “Vue, but better”. Farog is better than Vue **when you need**:

- less runtime
- explicit reactivity without large framework magic
- simpler internals
- UI embedded into a чужой сайт
- microfrontends and widgets
- performance-sensitive small/medium apps
- a faster start with lower cognitive load

## 1.0 release includes

- stable core
- keyed rendering
- hydration
- documented support matrix
- tiny router package
- starters and Vite integration
- benchmarks
- migration guide and comparison page
- adoption-oriented docs
- published release notes, architecture overview, roadmap after 1.0, known limitations, and support policy

## Install

```bash
npm install farog
```

## Quick example

```js
import { component, createApp, h, signal } from 'farog';

const count = signal(0);

const App = component(() =>
  h('main', null,
    h('h1', null, 'Farog'),
    h('button', { onClick: () => count.update((n) => n + 1) }, () => `count=${count.get()}`)
  )
);

createApp(App).mount(document.getElementById('app'));
```

## Start a project

```bash
npm create farog vanilla my-app
```

Templates:

- `vanilla`
- `router`
- `ssr-lite`
- `widget-embed`

## Stable API surface

Stable in 1.x:

- `signal`, `derive`, `effect`, `watch`, `batch`, `untrack`
- `h`, `component`, `mount`, `hydrate`, `createApp`, `renderToString`
- `Fragment`, `Show`, `For`
- `ref`, `onMount`, `onCleanup`, `onUnmount`, `nextTick`
- `resource`

Compatibility alias kept in 1.x:

- `computed()` as alias of `derive()`

## Docs map

- `docs/getting-started.md`
- `docs/rendering-model.md`
- `docs/reactivity-deep-dive.md`
- `docs/bug-taxonomy.md`
- `docs/lists-and-keys.md`
- `docs/ssr-and-hydration.md`
- `docs/support-matrix.md`
- `docs/router.md`
- `docs/anti-patterns.md`
- `docs/migration.md`
- `docs/api-stability.md`
- `docs/release-1.0.md`
- `docs/release-notes-1.0.md`
- `docs/architecture.md`
- `docs/roadmap-after-1.0.md`
- `docs/known-limitations.md`
- `docs/support-policy.md`
- `docs/comparison.md`
- `docs/benchmark-page.md`
- `docs/build-x-series.md`
- `docs/showcase.md`

## Development

```bash
npm run build
npm test
npm run bench
```

## Project assets

- docs site: `docs/`
- playground: `playground/`
- examples: `examples/`
