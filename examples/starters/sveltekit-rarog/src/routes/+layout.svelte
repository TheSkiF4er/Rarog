<script lang="ts">
  // Глобальное подключение CSS Rarog для SvelteKit
  import "rarog-css/dist/rarog-core.min.css";
  import "rarog-css/dist/rarog-utilities.min.css";
  import "rarog-css/dist/rarog-components.min.css";
  import "rarog-css/dist/rarog.jit.css";
</script>

<svelte:head>
  <title>Rarog + SvelteKit</title>
</svelte:head>

<slot />
