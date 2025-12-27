<main class="rg-container-lg py-10">
  <div class="card p-8">
    <h1 class="text-3xl font-semibold mb-4">SvelteKit + Rarog</h1>
    <p class="text-muted mb-4">
      Svelte‑компоненты просто используют классы Rarog. JS Core можно подключить
      через обычный `<script>` с UMD‑бандлом или через ESM‑импорт в hooks.
    </p>

    <button
      type="button"
      class="btn btn-primary"
      data-rg-toggle="modal"
      data-rg-target="#svelteModal"
    >
      Открыть модалку
    </button>
  </div>

  <div class="modal fade" id="svelteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Rarog Modal (SvelteKit)</h5>
          <button type="button" class="btn-close" data-rg-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          Модальное окно, стилизованное через Rarog и управляемое JS‑ядром.
        </div>
      </div>
    </div>
  </div>
</main>
