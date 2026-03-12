const { createPlugin } = require("../plugin-sdk/index.cjs");

module.exports = createPlugin({
  name: "@rarog/plugin-charts-theme",
  version: "1.0.0",
  description: "CSS variables and layout primitives for dashboards and embedded charts.",
  official: true,
  capabilities: { utilities: true, components: true, themes: true },
  setup() {
    return {
      utilitiesCss: `
.chart-grid { display: grid; gap: var(--rarog-spacing-4, 1rem); }
.chart-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.chart-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.chart-tone-positive { --rarog-chart-accent: var(--rarog-color-success-500, #22c55e); }
.chart-tone-warning { --rarog-chart-accent: var(--rarog-color-warning-500, #f97316); }
.chart-tone-danger { --rarog-chart-accent: var(--rarog-color-danger-500, #ef4444); }
`,
      componentsCss: `
.chart-card {
  --rarog-chart-accent: var(--rarog-color-primary-500, #3b82f6);
  --rarog-chart-grid: color-mix(in srgb, var(--rarog-color-semantic-border, #e5e7eb) 70%, transparent);
  border: 1px solid var(--rarog-color-semantic-border, #e5e7eb);
  border-radius: var(--rarog-radius-lg, 0.75rem);
  background: linear-gradient(180deg, var(--rarog-color-semantic-bgSoft, #ffffff), var(--rarog-color-semantic-bgElevatedSoft, #f9fafb));
  padding: var(--rarog-spacing-4, 1rem);
}
.chart-card svg [stroke="currentColor"],
.chart-card .chart-line { stroke: var(--rarog-chart-accent); }
.chart-card .chart-bar,
.chart-card .chart-fill { fill: var(--rarog-chart-accent); }
`
    };
  }
});
