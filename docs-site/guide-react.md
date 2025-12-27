# React Guide

Rarog хорошо сочетается с проектами на React. В репозитории есть starter:

- `examples/starters/vite-react`

## 1. Стартовый проект

Быстрый запуск starter‑а из монорепы Rarog:

```bash
cd examples/starters/vite-react
npm install
cd ../../..
npm run build     # собирает Rarog
cd examples/starters/vite-react
npm run dev
```

Открой `http://localhost:5173` — там уже используется ряд классов Rarog.

## 2. Интеграция в свой React‑проект

### Установка

```bash
npm install rarog-css --save-dev
```

### rarog.config.ts

В корне проекта:

```ts
import type { RarogConfig } from "rarog-css/rarog.config.types";

const config: RarogConfig = {
  mode: "jit",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    // при необходимости — расширяем токены
  }
};

export default config;
```

### Vite + React

В `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rarogPlugin } from 'rarog-css/tools/vite-plugin-rarog'

export default defineConfig({
  plugins: [
    react(),
    rarogPlugin()
  ]
})
```

`rarogPlugin()` будет дергать `rarog build` в JIT‑режиме при изменении файлов.

### Подключение CSS

Входной файл React‑приложения:

```ts
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Подключаем собранный CSS Rarog
import '../../dist/rarog.jit.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

## 3. Использование variants & plugins

Классы Rarog хорошо ложатся на React‑компоненты:

```tsx
export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        'btn btn-primary',
        'group-hover:bg-primary-600',
        'disabled:opacity-50 disabled:pointer-events-none',
        props.className
      ].filter(Boolean).join(' ')}
    />
  );
}
```

JIT найдёт классы в:

- строковых литералах;
- `className="..."`;
- `classList.add(...)`;
- `clsx(...)` / `cx(...)` / `classnames(...)`.

Подробнее — в разделе [Variants & JIT](/variants-jit).
