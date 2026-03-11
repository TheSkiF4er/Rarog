# Copy-paste examples

Этот раздел собирает короткие production-готовые фрагменты, которые можно вставить в проект без долгой адаптации.

## Button row

```html
<div class="d-flex gap-2 flex-wrap">
  <button class="btn btn-primary">Save changes</button>
  <button class="btn btn-secondary">Preview</button>
  <button class="btn btn-ghost">Cancel</button>
</div>
```

## Settings form

```html
<div class="card">
  <div class="card-header">Workspace settings</div>
  <div class="card-body d-grid gap-3">
    <input class="input" type="text" placeholder="Workspace name" />
    <textarea class="input" rows="4" placeholder="Description"></textarea>
    <label class="d-flex align-items-center gap-2"><input type="checkbox" /> Enable audit log</label>
  </div>
</div>
```

## Dialog trigger

```html
<button class="btn btn-primary" data-rg-toggle="modal" data-rg-target="#demoDialog">Open dialog</button>
<div class="modal" id="demoDialog" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-header">
      <h2 class="modal-title">Publish release</h2>
      <button class="btn btn-ghost" data-rg-dismiss="modal" aria-label="Close">✕</button>
    </div>
    <div class="modal-body">Ready to publish?</div>
  </div>
</div>
```

## Where to go next

- anatomy and accessibility details: [Component anatomy](components/anatomy.md)
- utility search: [Utility lookup](utilities/lookup.md)
- full starters: [Official starters](starters/README.md)
