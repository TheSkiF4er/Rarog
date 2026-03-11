<template>
  <RarogProvider>
    <div class="rg-container-lg py-10">
      <div class="rg-row rg-gap-y-6">
        <div class="rg-col-12 rg-col-lg-8">
          <RarogCard title="Nuxt 3 + Rarog" subtitle="Vue adapter v1 starter" body-class-name="p-8">
            <div class="d-flex flex-column gap-4">
              <RarogAlert tone="success" title="Nuxt-ready">
                Plugin registration, SSR-safe activation and wrapped components are configured.
              </RarogAlert>
              <RarogInput :value="search" placeholder="Search tokens or components" @input="onInput" />
              <RarogTabs :items="tabItems" default-value="nuxt" />
              <div class="d-flex gap-2">
                <RarogButton>Primary action</RarogButton>
                <RarogButton variant="outline" data-rg-toggle="modal" data-rg-target="#nuxtModal">Open modal</RarogButton>
              </div>
            </div>
          </RarogCard>
        </div>
      </div>

      <RarogModal id="nuxtModal" title="Rarog modal in Nuxt">
        <p>Search: {{ search || 'empty' }}</p>
      </RarogModal>
    </div>
  </RarogProvider>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  RarogAlert,
  RarogButton,
  RarogCard,
  RarogInput,
  RarogModal,
  RarogProvider,
  RarogTabs,
} from "@rarog/vue";

const search = ref("");
const onInput = (event: Event) => {
  search.value = (event.target as HTMLInputElement).value;
};
const tabItems = [
  { value: "nuxt", label: "Nuxt", content: "SSR-safe wrapper activation on mounted." },
  { value: "components", label: "Components", content: "Use adapter components for the common app surface." },
];
</script>
