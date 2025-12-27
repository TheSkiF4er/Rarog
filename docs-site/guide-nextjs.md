# Next.js Guide

Rarog можно использовать и в приложениях на Next.js (13/14+).

## 1. Установка

```bash
npm install rarog-css --save-dev
```

## 2. rarog.config.*

В корне Next‑проекта:

```ts
import type { RarogConfig } from "rarog-css/rarog.config.types";

const config: RarogConfig = {
  mode: "jit",
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {}
};

export default config;
```

## 3. Скрипты сборки

В `package.json`:

```json
{
  "scripts": {
    "rarog:build": "rarog build",
    "dev": "npm run rarog:build && next dev",
    "build": "npm run rarog:build && next build"
  }
}
```

## 4. Подключение CSS

В `app/layout.tsx` (Next 13+):

```tsx
import '../dist/rarog.jit.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  )
}
```

## 5. Типовой layout

```tsx
export default function Page() {
  return (
    <main className="rg-container-lg py-10">
      <div className="card p-8">
        <h1 className="text-3xl font-semibold mb-4">Next.js + Rarog</h1>
        <p className="text-muted mb-4">
          Используйте JIT‑режим Rarog для минимального CSS‑бандла.
        </p>
        <a className="btn btn-primary" href="/dashboard">
          Перейти в dashboard
        </a>
      </div>
    </main>
  );
}
```

---

Оптимизации и особенности JIT описаны в разделе [Performance & Bundle Size](/performance).

## Использование UI‑китов в Next.js

Любой из HTML‑layout’ов из `examples/ui-kits` можно перенести в `app/` или
`pages/`:

- Admin dashboard → `/app/(dashboard)/page.tsx`;
- Landing Kit → `/app/page.tsx`;
- SaaS Starter → `/app/(auth)/login/page.tsx`, `/app/(app)/dashboard/page.tsx` и т.п.

Важно:

- классы Rarog остаются без изменений;
- сборка CSS/JS происходит через `rarog build` и подключается в `_app`/layout.
