import Rarog, {
  Events,
  Dropdown,
  Modal,
  DataTable,
  VERSION,
  init,
  dispose,
  reinit
} from "../../packages/js/src/index.js";

describe("Rarog public интерфейс", () => {
  test("canonical entrypoint exposes stable modules", () => {
    expect(Rarog.Dropdown).toBe(Dropdown);
    expect(Rarog.Modal).toBe(Modal);
    expect(Rarog.DataTable).toBe(DataTable);
    expect(Rarog.Events).toBe(Events);
    expect(Rarog.VERSION).toBe(VERSION);
    expect(typeof init).toBe("function");
    expect(typeof dispose).toBe("function");
    expect(typeof reinit).toBe("function");
  });

  test("component constructors expose stable static factories", () => {
    const button = document.createElement("button");
    const menu = document.createElement("div");
    menu.id = "menu";
    menu.hidden = true;
    button.setAttribute("data-rg-target", "#menu");
    document.body.append(button, menu);

    expect(Dropdown.getInstance(button)).toBeNull();
    const instance = Dropdown.getOrCreate(button);
    expect(Dropdown.getInstance(button)).toBe(instance);
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

  test("version is a stable semver-like string", () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
