const meta = {
  title: 'Components/Pack v1',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' }
};

export default meta;

export const Overview = {
  render: () => `
    <div class="p-6 d-grid gap-4">
      <section class="card">
        <div class="card-header">Forms</div>
        <div class="card-body d-grid gap-3">
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-primary">Primary</button>
            <button class="btn btn-secondary">Secondary</button>
            <span class="badge badge-primary">Beta</span>
          </div>
          <input class="input" placeholder="Input" />
          <textarea class="textarea" placeholder="Textarea"></textarea>
          <select class="select"><option>Native select</option></select>
          <label class="check"><input class="checkbox" type="checkbox" checked /><span class="check-indicator"></span><span class="check-label">Checkbox</span></label>
          <label class="choice"><input class="radio" type="radio" name="pack-story" checked /><span class="radio-indicator"></span><span class="choice-label">Radio</span></label>
          <label class="switch-field"><input class="switch" type="checkbox" role="switch" checked /><span class="switch-track"></span><span class="switch-label">Switch</span></label>
        </div>
      </section>
      <section class="tabs" data-rg-tabs>
        <div class="tab-list" data-rg-tab-list>
          <button class="tab-trigger" data-rg-tab data-rg-target="#story-tab-a" aria-selected="true">Overview</button>
          <button class="tab-trigger" data-rg-tab data-rg-target="#story-tab-b">Status</button>
        </div>
        <div id="story-tab-a" class="tab-panel" data-rg-tab-panel>Accordion, tooltip and dialog are covered in the visual fixture.</div>
        <div id="story-tab-b" class="tab-panel" data-rg-tab-panel hidden><span class="spinner"></span> <span class="ml-2">Loading state</span></div>
      </section>
    </div>
  `
};
