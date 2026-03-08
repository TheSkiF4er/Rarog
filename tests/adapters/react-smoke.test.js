import React, { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import {
  RarogProvider,
  RarogModal,
  RarogDropdown,
  useModal
} from "../../packages/react/dist/index.mjs";

function HookHarness() {
  const { ref } = useModal({});
  return React.createElement("div", { ref, className: "hook-harness" }, "hook-mounted");
}

describe("@rarog/react smoke", () => {
  let host;
  let root;

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root.unmount();
      });
    }
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
    host = null;
    root = null;
  });

  it("imports the built adapter and renders provider, modal, dropdown, and hook consumers", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    const modalRef = createRef();

    await act(async () => {
      root.render(
        React.createElement(
          RarogProvider,
          { "data-testid": "provider" },
          React.createElement(RarogModal, { ref: modalRef, id: "react-modal", title: "Hello React" },
            React.createElement("p", null, "Modal body")
          ),
          React.createElement(RarogDropdown, { label: "Open menu", menuId: "react-dropdown-menu" },
            React.createElement("a", { href: "#item" }, "Item")
          ),
          React.createElement(HookHarness)
        )
      );
    });

    const provider = host.querySelector('[data-testid="provider"]');
    const modal = host.querySelector("#react-modal.modal");
    const dropdownButton = host.querySelector(".dropdown button[data-rg-target='#react-dropdown-menu']");
    const dropdownMenu = host.querySelector("#react-dropdown-menu.dropdown-menu");
    const hookHarness = host.querySelector(".hook-harness");

    expect(provider).toBeTruthy();
    expect(modal).toBeTruthy();
    expect(modal?.querySelector(".modal-title")?.textContent).toBe("Hello React");
    expect(dropdownButton?.textContent).toContain("Open menu");
    expect(dropdownMenu).toBeTruthy();
    expect(hookHarness?.textContent).toBe("hook-mounted");
    expect(modalRef.current).toBeTruthy();
    expect(typeof modalRef.current.show).toBe("function");
    expect(typeof modalRef.current.hide).toBe("function");
  });
});
