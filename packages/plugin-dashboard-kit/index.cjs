const { createPlugin } = require("../plugin-sdk/index.cjs");

module.exports = createPlugin({
  name: "@rarog/plugin-dashboard-kit",
  version: "1.0.0",
  description: "Dashboard shells, stat cards and responsive analytics layout primitives.",
  official: true,
  capabilities: { utilities: true, components: true },
  setup() {
    return {
      utilitiesCss: `
.dashboard-shell { display: grid; grid-template-columns: 280px minmax(0, 1fr); min-height: 100vh; }
.dashboard-stack { display: grid; gap: var(--rarog-spacing-4, 1rem); }
.dashboard-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--rarog-spacing-4, 1rem); }
.dashboard-sidebar-sticky { position: sticky; top: 0; align-self: start; min-height: 100vh; }
`,
      componentsCss: `
.kpi-card,
.dashboard-panel {
  border: 1px solid var(--rarog-color-semantic-border, #e5e7eb);
  border-radius: var(--rarog-radius-lg, 0.75rem);
  background: var(--rarog-color-semantic-bgSoft, #ffffff);
  box-shadow: var(--rarog-shadow-xs, 0 1px 2px rgba(15, 23, 42, 0.08));
}
.kpi-card { padding: var(--rarog-spacing-4, 1rem); }
.kpi-value { font-size: 1.875rem; font-weight: 700; line-height: 1.1; }
.dashboard-panel-header { display: flex; align-items: center; justify-content: space-between; gap: var(--rarog-spacing-3, 0.75rem); margin-bottom: var(--rarog-spacing-4, 1rem); }
`
    };
  }
});
