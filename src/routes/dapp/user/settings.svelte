<script>
  import jadwalScraper from "$lib/scraper/jadwal";
  import { user } from "$lib/initGun";
  import mainStore from "$lib/stores";

  const { registeredCorsProxies } = mainStore;

  let newCorsProxy = "";
  let showModal = false;

  const handleChangeCorsProxy = () => {
    jadwalScraper.setCorsProxyURL(newCorsProxy);
    console.log(jadwalScraper.corsProxyURL);
    // @ts-ignore
    user.get("corsProxy").put(newCorsProxy);
  };

  console.log($registeredCorsProxies);
</script>

<svelte:head>
  <title>DataGundar Dapp | Settings</title>
</svelte:head>

<h1>User Settings</h1>
<form class="flex flex-col gap-5" on:submit|preventDefault={handleChangeCorsProxy}>
  <div class="form-control flex">
    <label class="label">
      <span class="label-text">Cors Proxy URL</span>
    </label>
    <div class="flex items-center justify-items-center gap-5 w-full">
      <select
        class="select flex-1"
        bind:value={newCorsProxy}
      >
        {#if $registeredCorsProxies}
          {#each $registeredCorsProxies as registeredCorsProxy}
            <option value={registeredCorsProxy}>{registeredCorsProxy} </option>
          {:else}
            <option disabled={true}>Add new CORS Proxy</option>
          {/each}
        {:else}
          <option disabled={true}>Add new CORS Proxy</option>
        {/if}
      </select>
      <button class="btn btn-outline btn-circle" on:click={() => {showModal = !showModal}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  </div>
  <button type="submit" class="btn btn-primary">Save Changes</button>
</form>

<!-- TODO: Add validation -->
<!-- <form on:submit|preventDefault={handleChangeCorsProxy}>
  <div class="form-control">
    <input
      type="text"
      placeholder="http://datagundar-corsproxy.app"
      class="input"
      bind:value={newCorsProxy}
    />
  </div>
  <button type="submit" class="btn btn-primary w-full">Register</button>
</form> -->
