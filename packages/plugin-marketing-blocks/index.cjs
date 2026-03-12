const { createPlugin } = require("../plugin-sdk/index.cjs");

module.exports = createPlugin({
  name: "@rarog/plugin-marketing-blocks",
  version: "1.0.0",
  description: "Marketing-ready hero, logo cloud, pricing and CTA building blocks.",
  official: true,
  capabilities: { utilities: true, components: true },
  setup() {
    return {
      utilitiesCss: `
.hero-layout { display: grid; gap: var(--rarog-spacing-6, 1.5rem); align-items: center; }
.logo-cloud { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: var(--rarog-spacing-4, 1rem); }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--rarog-spacing-4, 1rem); }
.cta-inline { display: inline-flex; align-items: center; gap: var(--rarog-spacing-3, 0.75rem); }
`,
      componentsCss: `
.hero-card,
.pricing-card,
.cta-banner {
  border-radius: var(--rarog-radius-xl, 1rem);
  border: 1px solid color-mix(in srgb, var(--rarog-color-primary-200, #bfdbfe) 50%, var(--rarog-color-semantic-border, #e5e7eb));
  background: linear-gradient(180deg, var(--rarog-color-semantic-bgSoft, #ffffff), color-mix(in srgb, var(--rarog-color-primary-50, #eff6ff) 30%, #ffffff));
}
.hero-card,
.pricing-card { padding: var(--rarog-spacing-6, 1.5rem); }
.pricing-card-featured { box-shadow: var(--rarog-shadow-md, 0 4px 6px rgba(15, 23, 42, 0.16)); transform: translateY(-2px); }
.cta-banner { padding: var(--rarog-spacing-5, 1.25rem) var(--rarog-spacing-6, 1.5rem); }
`
    };
  }
});
