<script>
  import { user } from "$lib/initGun";
  import { corsProxy } from "$lib/stores";

  let newCorsProxy = "";

  const handleChangeCorsProxy = () => {
    // @ts-ignore
    user.get("corsProxy").put(newCorsProxy);
  };
</script>

<svelte:head>
  <title>DataGundar Dapp | Settings</title>
</svelte:head>

<h1>User Settings</h1>
{#if $corsProxy}
  <p>Cors Proxy {$corsProxy}</p>
{:else}
  <p>Cors Proxy: Undefined</p>
{/if}

<!-- TODO: Add validation -->
<form on:submit|preventDefault={handleChangeCorsProxy}>
  <div class="form-control">
    <input
      type="text"
      placeholder="http://datagundar-corsproxy.app"
      class="input"
      bind:value={newCorsProxy}
    />
  </div>
  <button type="submit" class="btn btn-primary w-full">Register</button>
</form>
