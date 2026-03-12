const { createPlugin } = require("../plugin-sdk/index.cjs");

module.exports = createPlugin({
  name: "@rarog/plugin-motion",
  version: "1.0.0",
  description: "Motion primitives, reveal helpers and accessible transition utilities.",
  official: true,
  capabilities: { utilities: true, components: true },
  setup() {
    return {
      utilitiesCss: `
.motion-safe-fade-in { animation: rarog-fade-in .24s ease-out both; }
.motion-safe-slide-up { animation: rarog-slide-up .28s ease-out both; }
.motion-duration-fast { animation-duration: .16s; transition-duration: .16s; }
.motion-duration-base { animation-duration: .24s; transition-duration: .24s; }
.motion-duration-slow { animation-duration: .4s; transition-duration: .4s; }
@media (prefers-reduced-motion: reduce) {
  .motion-safe-fade-in,
  .motion-safe-slide-up,
  .motion-duration-fast,
  .motion-duration-base,
  .motion-duration-slow { animation: none !important; transition-duration: 0s !important; }
}
@keyframes rarog-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes rarog-slide-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`,
      componentsCss: `
.motion-surface {
  transition: transform .24s ease, box-shadow .24s ease, opacity .24s ease;
}
.motion-surface:hover {
  transform: translateY(-2px);
  box-shadow: var(--rarog-shadow-md, 0 4px 6px rgba(15, 23, 42, 0.16));
}
`
    };
  }
});
