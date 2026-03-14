<script lang="ts">
  // Глобальное подключение CSS Рарог для SvelteKit
  import "rarog/dist/rarog-core.min.css";
  import "rarog/dist/rarog-utilities.min.css";
  import "rarog/dist/rarog-components.min.css";
  import "rarog/dist/rarog.jit.css";
</script>

<svelte:head>
  <title>Rarog + SvelteKit</title>
</svelte:head>

<slot />
