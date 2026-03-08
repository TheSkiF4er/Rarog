import { Events, Rarog } from "../../packages/js/src/rarog.esm.js";

describe("Rarog public API", () => {
  test("Rarog namespace exposes stable modules", () => {
    expect(Rarog.Dropdown).toBeTypeOf("function");
    expect(Rarog.Modal).toBeTypeOf("function");
    expect(Rarog.DataTable).toBeTypeOf("function");
    expect(Rarog.Events).toBe(Events);
  });

  test("event bus subscribe/unsubscribe works", () => {
    const handler = vi.fn();

    Events.on("rg:test", handler);
    Events.emit("rg:test", { ok: true });
    expect(handler).toHaveBeenCalledWith({ ok: true });

    Events.off("rg:test", handler);
    Events.emit("rg:test", { ok: false });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
