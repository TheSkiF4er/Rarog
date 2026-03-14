import { describe, test, expect } from "vitest";
import Rarog from "../../packages/js/src/rarog.esm.js";

describe("component pack v1 accessibility baseline", () => {
  test("Tabs wire ARIA roles and arrow-key navigation", () => {
    document.body.innerHTML = `
      <section class="tabs" data-rg-tabs>
        <div class="tab-list" data-rg-tab-list>
          <button class="tab-trigger" data-rg-tab data-rg-target="#panel-a" aria-selected="true">One</button>
          <button class="tab-trigger" data-rg-tab data-rg-target="#panel-b">Two</button>
        </div>
        <div id="panel-a" class="tab-panel" data-rg-tab-panel>Alpha</div>
        <div id="panel-b" class="tab-panel" data-rg-tab-panel hidden>Предварительное</div>
      </section>
    `;

    const root = document.querySelector('[data-rg-tabs]');
    const tabs = Rarog.Tabs.getOrCreate(root);
    const triggers = root.querySelectorAll('[role="tab"]');
    triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(root.querySelector('[role="tablist"]').getAttribute('aria-orientation')).toBe('horizontal');
    expect(triggers[1].getAttribute('aria-selected')).toBe('true');
    expect(document.getElementById('panel-b').hidden).toBe(false);
    tabs.dispose();
  });

  test("Modal keeps dialog semantics and restores focus", () => {
    document.body.innerHTML = `
      <button id="before">Open</button>
      <div class="modal" id="dialog" aria-hidden="true">
        <div class="modal-dialog dialog-surface">
          <div class="dialog-header"><button class="btn btn-ghost" data-rg-dismiss="modal">Close</button></div>
          <div class="dialog-body"><input class="input" data-rg-autofocus /></div>
        </div>
      </div>
    `;
    const before = document.getElementById('before');
    before.focus();
    const modal = Rarog.Modal.getOrCreate(document.getElementById('dialog'));
    modal.show();

    expect(document.getElementById('dialog').getAttribute('role')).toBe('dialog');
    expect(document.getElementById('dialog').getAttribute('aria-modal')).toBe('true');

    modal.hide();
    expect(document.activeElement).toBe(before);
  });
});
