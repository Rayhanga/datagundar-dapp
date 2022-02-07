<script lang="ts">
  import { onMount } from "svelte";
  import mainStore from "$lib/stores";

  // TODO: Fix Stateless Store when first initialization
  // To replicate bug: logout, force refresh, login, there will be no states on any stores

  const { username, selectedCorsProxy, registeredCorsProxies } = mainStore;

  onMount(() => {
    if (username) {
      if (!$selectedCorsProxy) {
        const defaultCorsProxy = window.location.href.replace("/dapp", "/api/defaultcorsproxy")
        registeredCorsProxies.addItem(
          defaultCorsProxy,
          defaultCorsProxy
        );
        selectedCorsProxy.setValue(defaultCorsProxy)
      }
    }
  });
</script>

<svelte:head>
  <title>DataGundar Dapp | Dashboard</title>
</svelte:head>

<h1>Dashboard</h1>
