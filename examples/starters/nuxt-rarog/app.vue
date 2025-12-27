<template>
  <RarogProvider>
    <div class="rg-container-lg py-10">
      <div class="rg-row rg-gap-y-6">
        <div class="rg-col-12 rg-col-lg-8">
          <div class="card p-8">
            <h1 class="text-3xl font-semibold mb-4">Nuxt 3 + Rarog</h1>
            <p class="text-muted mb-4">
              JS-ядро Rarog инициализируется через Vue-компонент <code>RarogProvider</code>.
            </p>

            <button
              type="button"
              class="btn btn-primary me-3"
              data-rg-toggle="modal"
              data-rg-target="#nuxtModal"
            >
              Открыть модалку
            </button>
          </div>
        </div>
        <div class="rg-col-12 rg-col-lg-4">
          <div class="alert alert-success">
            Готово для SSR + SPA‑навигации Nuxt.
          </div>
        </div>
      </div>

      <div
        id="nuxtModal"
        class="modal fade"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Rarog Modal (Nuxt)</h5>
              <button type="button" class="btn-close" data-rg-dismiss="modal" aria-label="Close" />
            </div>
            <div class="modal-body">
              Модальное окно, работающее через Rarog JS Core внутри Nuxt‑приложения.
            </div>
          </div>
        </div>
      </div>
    </div>
  </RarogProvider>
</template>

<script setup lang="ts">
import { RarogProvider } from "@rarog/vue";
</script>
