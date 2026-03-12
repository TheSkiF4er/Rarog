const { describe, it, expect } = require("vitest");
const { createPlugin, createPluginTestHarness, validatePluginCompatibility } = require("../../packages/plugin-sdk/index.cjs");

describe("plugin sdk v1", () => {
  it("creates stable plugin manifest and executes through harness", () => {
    const plugin = createPlugin({
      name: "@rarog/plugin-test",
      version: "1.0.0",
      capabilities: { utilities: true, diagnostics: true },
      setup() {
        return {
          utilitiesCss: ".plugin-test { display:block; }",
          diagnostics: [{ level: "info", message: "ok" }]
        };
      }
    });

    const harness = createPluginTestHarness({ rarogVersion: "3.5.0", rootDir: process.cwd() });
    const execution = harness.execute(plugin, { config: { mode: "jit" } });

    expect(execution.compatibility.ok).toBe(true);
    expect(execution.manifest.name).toBe("@rarog/plugin-test");
    expect(execution.result.utilitiesCss).toContain(".plugin-test");
    expect(execution.result.diagnostics).toHaveLength(1);
  });

  it("reports incompatible engine ranges", () => {
    const plugin = createPlugin({
      name: "@rarog/plugin-incompatible",
      version: "1.0.0",
      engine: { rarog: ">=4.0.0 <5.0.0" },
      setup() {
        return {};
      }
    });

    const result = validatePluginCompatibility(plugin, { rarogVersion: "3.5.0" });
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toContain("expects Rarog");
  });
});
