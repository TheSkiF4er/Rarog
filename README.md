# Rarog CSS Framework 3.5.0

> **Rarog** — гибридный CSS‑фреймворк и дизайн‑система: design‑tokens + utilities + компоненты + JS‑ядро.  
> Альтернатива связке **Tailwind CSS + Bootstrap**, заточенная под продуктовую разработку и Cajeer‑экосистему — но не только.

<p align="left">
  <a href="https://github.com/TheSkiF4er/rarog/actions/workflows/ci.yml">
    <img src="https://github.com/TheSkiF4er/rarog/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://www.npmjs.com/package/rarog">
    <img src="https://img.shields.io/npm/v/rarog.svg?logo=npm" alt="npm" />
  </a>
  <a href="https://github.com/TheSkiF4er/rarog/releases">
    <img src="https://img.shields.io/github/v/release/TheSkiF4er/rarog?logo=github" alt="GitHub release" />
  </a>
  <a href="https://cajeer.ru/rarog">
    <img src="https://img.shields.io/badge/docs-cajeer.ru%2Frarog-blue?logo=readthedocs" alt="Docs" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202.0-green" alt="License" />
  </a>
</p>

- Автор: **TheSkiF4er**
- Лицензия: **Apache 2.0**
- Контакты: `support@cajeer.ru`
- Текущая стабильная ветка: **3.x**
- Текущая версия: **3.5.0 (Reliability, Observability & Ecosystem)**
- Документация: `https://cajeer.ru/rarog`
- CDN: `https://cdn.cajeer.ru/rarog`


---

## Зачем нужен Rarog

Rarog решает типичную проблему продуктовых команд:

- **Tailwind** даёт гибкий utility‑слой, но не даёт готовой дизайн‑системы «из коробки».
- **Bootstrap** даёт компоненты, но слабо управляется через tokens/JIT и быстро устаревает для сложных фронтов.

**Rarog совмещает оба подхода**:

- как Tailwind — даёт богатый набор utility‑классов, responsive/state‑префиксы, JIT‑сборку и произвольные значения;
- как Bootstrap — даёт готовые компоненты, сетку, JS‑ядро и UI‑киты (Admin, Landing, SaaS);
- как дизайн‑система — даёт tokens (`rarog.tokens.json`), theme‑packs и Figma Design Kit.

Rarog хорошо ложится и на **Cajeer‑экосистему**, и на «обычные» стеки: Laravel, React, Vue, Next.js, SvelteKit, статические сайты и др.

---

## Быстрый старт

### CDN (официальный эндпоинт cdn.cajeer.ru)

Быстрее всего начать с подключении Rarog через официальное CDN.  
Версионированный пример (рекомендуется для продакшена):

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.cajeer.ru/rarog/3.5.0/rarog.min.css">
<link rel="stylesheet" href="https://cdn.cajeer.ru/rarog/3.5.0/themes/default.css">

<!-- JavaScript-ядро (опционально, только если вы используете JS-компоненты) -->
<script src="https://cdn.cajeer.ru/rarog/3.5.0/rarog.umd.js" defer></script>
```

Для экспериментов можно использовать алиас `latest` (если он настроен на стороне CDN):

```html
<link rel="stylesheet" href="https://cdn.cajeer.ru/rarog/latest/rarog.min.css">
<link rel="stylesheet" href="https://cdn.cajeer.ru/rarog/latest/themes/default.css">
<script src="https://cdn.cajeer.ru/rarog/latest/rarog.umd.js" defer></script>
```

### Локальное статическое подключение

Если вы собираете статические файлы у себя (например, из `dist/` релиза), структура может выглядеть так:

```html
<link rel="stylesheet" href="/css/rarog-core.min.css">
<link rel="stylesheet" href="/css/rarog-utilities.min.css">
<link rel="stylesheet" href="/css/rarog-components.min.css">
<link rel="stylesheet" href="/css/rarog-theme-default.min.css">
<script src="/js/rarog.umd.js" defer></script>
```

```html
<div class="rg-container-lg mt-6">
  <div class="card shadow-md">
    <div class="card-header flex items-center justify-between">
      <h1 class="h5 mb-0">Добро пожаловать в Rarog 3.5.0</h1>
      <span class="badge badge-primary">3.x stable</span>
    </div>
    <div class="card-body">
      <p class="text-muted mb-4">
        Design‑tokens, utilities, компоненты и JS‑ядро — всё в одном фреймворке.
      </p>
      <button class="btn btn-primary btn-lg">
        Начать
      </button>
    </div>
  </div>
</div>
```

### npm + CLI + JIT

```bash
npm install rarog
```

```js
// rarog.config.ts
import { defineConfig } from "rarog/rarog.config.types";

export default defineConfig({
  mode: "jit",
  content: ["./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#0f172a"
        }
      }
    }
  }
});
```

```bash
# Сборка с учётом JIT и конфига
npx rarog build
```

---

## Что входит в Rarog 3.x

### Design‑tokens и темы

- `rarog.tokens.json` — единый источник truth для цветов, типографики, spacing, radius, shadow.
- Темы:
  - `default`, `dark`, `contrast`, `enterprise`, `creative` и др.
- Экспорт токенов в Figma / design‑инструменты (см. `design/` и раздел **Design System Suite** в docs).

### Utilities

- Layout, flex/grid, spacing, sizing, typography, эффекты, фильтры, scroll/overscroll, scroll‑snap, print, RTL‑утилиты.
- Responsive‑префиксы: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.
- State/variants:
  - `hover:`, `focus:`, `group-hover:`, `peer-*`, `data-[state=*]:*` и др.
- Arbitrary values (ограниченный, но полезный набор): `w-[320px]`, `bg-[#0f172a]`, `rounded-[12px]`, `gap-[3.5rem]`…

### Components & JS Core

- Компоненты без JS: alerts, badges, list group, breadcrumbs, nav/tabs, pagination, progress, forms, grid/layout‑паттерны.
- JS‑компоненты (vanilla, без jQuery):
  - modal, dropdown, offcanvas, collapse/accordion, toast, tooltip, popover;
  - navbar/header, carousel, stepper/wizard;
  - advanced forms (`datepicker`, `select/combobox`, `tags-input`, маски ввода);
  - data‑table (MVP) с сортировкой, поиском и пагинацией.
- JS Core v3:
  - единый event‑bus `rg:*`, data‑API (`data-rg-toggle`, `data-rg-target`),
  - `Rarog.init/reinit/dispose` для SPA/SSR,
  - debug‑режим (`Rarog.setDebug`, `Rarog.isDebugEnabled`).

### DX, LSP и плагины

- CLI: `rarog build`, `rarog init`, `rarog docs`, `rarog validate`.
- JIT/Tree‑shaking: анализ `content`, режимы `full` / `jit` / split‑build.
- LSP + VSCode‑extension: автодополнение классов, переход к docs, подсветка ошибок `rarog.config.*`.
- Plugin API + registry:
  - `plugins/registry.json` + docs `plugins-registry.md`,
  - официальные плагины (`@rarog/plugin-forms`, `@rarog/plugin-typography`) и место для community‑экосистемы.

### UI‑киты и примеры

В каталоге `examples/` и `design/`:

- **Rarog UI Admin** — admin‑dashboard (sidebar + navbar + таблицы + формы + toasts).
- **Rarog Landing Kit** — hero, features, pricing, FAQ, blog, CTA.
- **Rarog SaaS Starter** — auth layout, dashboard, settings/billing.
- Starters под стеки:
  - Laravel, Vite + React, Vue/Nuxt, Next.js, SvelteKit, Cajeer‑стек.

---

## Для кого Rarog

- **Продуктовые команды** — нужен единый дизайн‑язык и компонентная библиотека поверх разных сервисов.
- **CTO/Team Lead** — нужен устойчивый foundation (tokens + CSS + JS) с понятной политикой версионирования.
- **Дизайнеры** — нужен Figma‑kit и связка «макет → токены → код» без лишнего glue‑кода.
- **Фулл‑стек разработчики** — нужен стек «подключил, собрал, верстаю 80–90% макета без кастомного CSS».

---

## Документация и поддержка

- Docs: `https://cajeer.ru/rarog` (RU + EN, с версионированием `/v2` и `/v3`).
- Основные разделы:
  - Getting Started, Tokens, Utilities, Components, JavaScript,
  - Theming, Guides (Laravel, React, Vue, Next.js, Cajeer‑Stack),
  - Cookbook & Patterns, Accessibility, Performance, Why Rarog, Versioning & Support.

Подробный контракт API и политика поддержки описаны в `docs-site/versioning.md` и разделе **Rarog 3.x API Contract**.

---

## Contributing

Pull‑request’ы, issues и plugin‑идеи приветствуются.

- Перед PR:
  - прогоните `npm run build` и `npm test`;
  - обновите docs, если меняете публичный API или добавляете фичу.
- Для плагинов:
  - оформляйте отдельные npm‑пакеты,
  - добавляйте их в `plugins/registry.json` через PR (с описанием и ссылкой на репо).

Подробнее см. `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` и `SECURITY.md`.
