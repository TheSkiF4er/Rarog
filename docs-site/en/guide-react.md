# React Guide (EN)

This is a minimal entry-point for using Rarog with React (Vite, CRA, Next).

## Install

```bash
npm install rarog-css
```

## Import CSS

In your main entry file:

```ts
import 'rarog-css/dist/rarog.css'
import { Rarog } from 'rarog-css/dist/rarog.esm.js'

Rarog.init()
```

## Example component

```tsx
export function Hero() {
  return (
    <section className="rg-container-lg py-16">
      <h1 className="text-4xl font-bold mb-4">
        Rarog + React
      </h1>
      <p className="text-muted mb-6">
        Utilities, components and JS widgets ready to use.
      </p>
      <button className="btn btn-primary">
        Get started
      </button>
    </section>
  );
}
```

For a more complete example, check the `examples/starters/vite-react` project
in the repository (RU docs describe it in detail, but the code is self-explaining).


## 4. @rarog/react wrappers

Starting from 3.4.0 there is an `@rarog/react` package with thin React wrappers
around the Rarog JS Core.

Install:

```bash
npm install rarog-css @rarog/react
```

Basic example with `<RarogProvider>` and a modal:

```tsx
import React from "react";
import { RarogProvider, RarogModal } from "@rarog/react";
import "rarog-css/dist/rarog-core.min.css";
import "rarog-css/dist/rarog-utilities.min.css";
import "rarog-css/dist/rarog-components.min.css";
import "rarog-css/dist/rarog.jit.css";

export function App() {
  return (
    <RarogProvider>
      <main className="rg-container-lg py-10">
        <button
          type="button"
          className="btn btn-primary"
          data-rg-toggle="modal"
          data-rg-target="#demoModal"
        >
          Open modal
        </button>

        <RarogModal id="demoModal" title="Rarog Modal">
          <p className="mb-0">
            Modal content. JS behavior is powered by Rarog JS Core, while React
            components provide ergonomic markup.
          </p>
        </RarogModal>
      </main>
    </RarogProvider>
  );
}
```

`RarogProvider` ensures SPA/SSR‑friendly initialization: it calls
`Rarog.init(root)` on mount and `Rarog.dispose(root)` on unmount.
