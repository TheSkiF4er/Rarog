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
