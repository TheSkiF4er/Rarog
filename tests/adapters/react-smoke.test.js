import React, { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import {
  RarogProvider,
  RarogModal,
  RarogDropdown,
  useModal
} from "../../packages/react/dist/index.mjs";

function HookHarness() {
  const { ref, api } = useModal({});
  return React.createElement("div", { ref, className: "hook-harness", "data-has-api": typeof api.show === "function" }, "hook-mounted");
}

function ControlledHarness({ onOpen, onClose }) {
  const [open, setOpen] = useState(false);
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("button", { id: "react-open", onClick: () => setOpen(true) }, "open"),
    React.createElement("button", { id: "react-close", onClick: () => setOpen(false) }, "close"),
    React.createElement(RarogModal, {
      id: "react-controlled-modal",
      title: "Controlled",
      open,
      onOpen,
      onClose
    }, React.createElement("p", null, "Controlled body"))
  );
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

  it("renders provider, modal, dropdown, and hook consumers with imperative handles", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    const modalRef = createRef();
    const dropdownRef = createRef();

    await act(async () => {
      root.render(
        React.createElement(
          RarogProvider,
          { "data-testid": "provider" },
          React.createElement(RarogModal, { ref: modalRef, id: "react-modal", title: "Hello React", defaultOpen: true },
            React.createElement("p", null, "Modal body")
          ),
          React.createElement(RarogDropdown, { ref: dropdownRef, label: "Open menu", menuId: "react-dropdown-menu" },
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
    expect(dropdownMenu?.getAttribute("role")).toBe("menu");
    expect(hookHarness?.dataset.hasApi).toBe("true");
    expect(modalRef.current).toBeTruthy();
    expect(typeof modalRef.current.show).toBe("function");
    expect(typeof modalRef.current.dispose).toBe("function");
    expect(typeof dropdownRef.current.hide).toBe("function");
  });

  it("supports controlled open state and lifecycle callbacks", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    const onOpen = vi.fn();
    const onClose = vi.fn();

    await act(async () => {
      root.render(React.createElement(ControlledHarness, { onOpen, onClose }));
    });

    const modal = host.querySelector("#react-controlled-modal");
    modal.dispatchEvent(new CustomEvent("rg:modal:shown", { bubbles: true }));
    modal.dispatchEvent(new CustomEvent("rg:modal:hidden", { bubbles: true }));

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
