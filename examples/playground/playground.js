import Rarog from '../../packages/js/src/rarog.esm.js';

const sceneSelect = document.getElementById('sceneSelect');
const themeSelect = document.getElementById('themeSelect');
const rtlToggle = document.getElementById('rtlToggle');
const debugToggle = document.getElementById('debugToggle');
const rerenderBtn = document.getElementById('rerenderBtn');
const scopeThemeBtn = document.getElementById('scopeThemeBtn');
const stage = document.getElementById('playgroundStage');
const eventLog = document.getElementById('eventLog');
const themeLink = document.getElementById('rarog-theme-link');

window.Rarog = Rarog;

const scenes = {
  modal: () => `
    <div class="d-flex gap-3 flex-wrap align-items-center mb-4">
      <button class="btn btn-primary" data-rg-toggle="modal" data-rg-target="#demoModal">Открыть modal</button>
      <button class="btn btn-secondary" data-rg-toggle="offcanvas" data-rg-target="#demoOffcanvas">Открыть offcanvas</button>
      <button class="btn btn-ghost" data-rg-toggle="toast" data-rg-target="#demoToast">Показать toast</button>
    </div>
    <div class="card">
      <div class="card-body">
        <p class="mb-0">Сцена для проверки overlay lifecycle, focus management и dismiss событий.</p>
      </div>
    </div>
    <div class="modal" id="demoModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-header">
          <h2 class="modal-title">Launch review</h2>
          <button class="btn btn-ghost" data-rg-dismiss="modal" aria-label="Закрыть">✕</button>
        </div>
        <div class="modal-body">
          <input class="input mb-3" placeholder="owner@rarog.dev" data-rg-autofocus />
          <textarea class="input" rows="4" placeholder="Примечания"></textarea>
        </div>
        <div class="modal-footer d-flex gap-2 justify-content-end">
          <button class="btn btn-secondary" data-rg-dismiss="modal">Отмена</button>
          <button class="btn btn-primary">Сохранить</button>
        </div>
      </div>
    </div>
    <div class="offcanvas offcanvas-end" id="demoOffcanvas" aria-hidden="true">
      <div class="offcanvas-header">
        <div class="offcanvas-title">Mobile navigation</div>
        <button class="btn btn-ghost" data-rg-dismiss="offcanvas" aria-label="Закрыть">✕</button>
      </div>
      <div class="offcanvas-body d-flex flex-column gap-2">
        <a class="btn btn-ghost justify-content-start" href="#">Dashboard</a>
        <a class="btn btn-ghost justify-content-start" href="#">Billing</a>
      </div>
    </div>
    <div class="toast" id="demoToast" aria-hidden="true">
      <div class="toast-header d-flex justify-content-between align-items-center">
        <strong>Saved</strong>
        <button class="btn btn-ghost" data-rg-dismiss="toast" aria-label="Закрыть">✕</button>
      </div>
      <div class="toast-body">Deployment checklist updated.</div>
    </div>
  `,
  dropdown: () => `
    <div class="d-flex gap-3 flex-wrap align-items-center">
      <div class="dropdown">
        <button class="btn btn-secondary" data-rg-toggle="dropdown">Dropdown</button>
        <div class="dropdown-menu">
          <button class="dropdown-item">Edit</button>
          <button class="dropdown-item">Duplicate</button>
          <button class="dropdown-item">Archive</button>
        </div>
      </div>
      <button class="btn btn-primary" data-rg-toggle="popover" data-rg-title="Deployment" data-rg-content="Production rollout at 16:00 UTC.">Popover</button>
      <button class="btn btn-ghost" data-rg-toggle="tooltip" data-rg-title="Keyboard + pointer supported">Tooltip</button>
    </div>
  `,
  forms: () => `
    <div class="rg-row rg-gap-y-4">
      <div class="rg-col-12 rg-col-lg-6">
        <label class="d-block mb-2">Select</label>
        <div data-rg-select>
          <button type="button" class="input d-flex justify-content-between align-items-center"><span>Choose status</span><span>▾</span></button>
          <div class="dropdown-menu">
            <button class="dropdown-item" data-value="draft">Draft</button>
            <button class="dropdown-item" data-value="review">In review</button>
            <button class="dropdown-item" data-value="shipped">Shipped</button>
          </div>
        </div>
      </div>
      <div class="rg-col-12 rg-col-lg-6">
        <label class="d-block mb-2">Combobox</label>
        <div data-rg-combobox>
          <input class="input" type="text" placeholder="Search member" />
          <div class="dropdown-menu">
            <button class="dropdown-item" data-value="anna">Anna</button>
            <button class="dropdown-item" data-value="dmitry">Dmitry</button>
            <button class="dropdown-item" data-value="lina">Lina</button>
          </div>
        </div>
      </div>
      <div class="rg-col-12">
        <label class="d-block mb-2">Tags input</label>
        <div data-rg-tags-input>
          <input class="input" type="text" placeholder="Type tag and press Enter" />
        </div>
      </div>
    </div>
  `,
  table: () => `
    <table class="table" data-rg-table>
      <thead>
        <tr>
          <th data-rg-sort="string">Project</th>
          <th data-rg-sort="string">Owner</th>
          <th data-rg-sort="string">Состояние</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Ridge</td><td>Anna</td><td>Active</td></tr>
        <tr><td>Orion</td><td>Dmitry</td><td>Review</td></tr>
        <tr><td>Falcon</td><td>Lina</td><td>Paused</td></tr>
      </tbody>
    </table>
  `  ,
  tokens: () => `
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <h3 class="h5 mb-1">Token browser</h3>
          <p class="text-muted mb-0">Raw, semantic and runtime tokens for the selected theme.</p>
        </div>
        <span class="badge badge-outline">theme v1</span>
      </div>
      <div class="card-body">
        <div id="tokenBrowserRoot" class="rg-row rg-gap-y-4"></div>
      </div>
    </div>
  `

};

function logEvent(event) {
  if (!debugToggle.checked) return;
  const line = `[${new Date().toLocaleTimeString()}] ${event.type}`;
  eventLog.textContent = `${line}\n${eventLog.textContent}`.trim();
}

function bindEventLog() {
  document.querySelectorAll('[id], [data-rg-toggle], [data-rg-select], [data-rg-combobox], [data-rg-tags-input], [data-rg-table]').forEach((node) => {
    [
      'rg:modal:show','rg:modal:shown','rg:modal:hidden',
      'rg:offcanvas:show','rg:offcanvas:shown','rg:offcanvas:hidden',
      'rg:toast:shown','rg:dropdown:shown','rg:popover:shown','rg:tooltip:shown',
      'rg:select:change','rg:combobox:change','rg:tags-input:add','rg:table:sort'
    ].forEach((name) => node.addEventListener(name, logEvent));
  });
}

function renderScene() {
  stage.innerHTML = scenes[sceneSelect.value]();
  eventLog.textContent = '';
  Rarog.reinit(stage);
  bindEventLog();
  renderTokenBrowser();
}

function updateTheme() {
  const theme = themeSelect.value;
  const legacyThemes = ['default', 'dark', 'creative', 'contrast', 'enterprise'];
  if (legacyThemes.includes(theme)) {
    themeLink.setAttribute('href', `../../packages/themes/src/rarog-theme-${theme}.css`);
    stage.removeAttribute('data-rg-theme');
    document.documentElement.removeAttribute('data-rg-theme');
  } else {
    themeLink.setAttribute('href', '../../packages/themes/src/rarog-theme-default.css');
    stage.setAttribute('data-rg-theme', theme);
  }
  renderTokenBrowser();
}

function updateDirection() {
  document.documentElement.dir = rtlToggle.checked ? 'rtl' : 'ltr';
}

themeSelect.addEventListener('change', updateTheme);
rtlToggle.addEventListener('change', updateDirection);
sceneSelect.addEventListener('change', renderScene);
rerenderBtn.addEventListener('click', renderScene);
debugToggle.addEventListener('change', () => {
  eventLog.textContent = debugToggle.checked ? 'Event logging enabled' : '';
});

updateTheme();
updateDirection();
renderScene();


async function renderTokenBrowser() {
  if (sceneSelect.value !== 'tokens') return;
  const root = document.getElementById('tokenBrowserRoot');
  if (!root) return;
  const response = await fetch('../../rarog.tokens.json');
  const data = await response.json();
  const raw = data.tokenArchitecture?.raw || data.tokens || {};
  const semantic = data.tokenArchitecture?.semantic || {};
  const runtime = data.tokenArchitecture?.runtime || {};
  const renderBlock = (title, entries) => `
    <div class="rg-col-12 rg-col-lg-4">
      <div class="card h-100">
        <div class="card-header"><strong>${title}</strong></div>
        <div class="card-body">${Object.entries(entries).slice(0, 8).map(([k,v]) => `<div class="d-flex justify-content-between gap-3 py-1"><code>${k}</code><span class="text-muted">${typeof v === 'object' ? JSON.stringify(v) : v}</span></div>`).join('')}</div>
      </div>
    </div>`;
  root.innerHTML = [
    renderBlock('raw.color.primary', raw.color?.primary || {}),
    renderBlock('semantic.color', semantic.color || semantic),
    renderBlock('runtime.presets', Object.fromEntries(Object.entries(runtime.presets || {}).map(([k,v]) => [k, Object.keys(v).join(', ')])))
  ].join('');
}

scopeThemeBtn.addEventListener('click', () => {
  const active = stage.getAttribute('data-rg-theme');
  if (active) stage.removeAttribute('data-rg-theme');
  else if (!['default','dark','creative','contrast','enterprise'].includes(themeSelect.value)) stage.setAttribute('data-rg-theme', themeSelect.value);
});
