# Integration Guides (overview)

High-level view of how Rarog integrates with different stacks:

- Laravel (Blade templates + JIT build).
- React (Vite + Rarog).
- Vue.
- Next.js.
- Cajeer stack.

Each stack has its own dedicated guide:

- `guide-laravel`,
- `guide-react`,
- `guide-vue`,
- `guide-nextjs`,
- `guide-cajeer-stack`.


## SPA/SSR starters

The repo ships ready‑to‑run starters for SPA/SSR stacks:

- `examples/starters/nextjs-rarog` — Next.js 14 (App Router) + Rarog + `@rarog/react`;
- `examples/starters/nuxt-rarog` — Nuxt 3 + Rarog + `@rarog/vue`;
- `examples/starters/sveltekit-rarog` — SvelteKit + Rarog.

They demonstrate:

- how to wire Rarog CSS/JS into SSR frameworks;
- how JS Core behaves in SPA navigation;
- hybrid SSR + client‑side hydration setup.

## Microfrontends / Module Federation (MVP)

For microfrontends with a shared design system:

- keep tokens and themes in a shared package (`rarog-css` + theme packs);
- share the main CSS bundle (or per‑theme bundles) across microfrontends;
- expose Rarog JS Core as a singleton module (Webpack Module Federation, Vite, etc.).

Key recommendations:

- use a single source of truth for tokens (`rarog.tokens.json` + theme packs);
- ensure JS Core is loaded only once (singleton);
- for each microfrontend call `Rarog.init(root)` / `Rarog.dispose(root)` on its container.
