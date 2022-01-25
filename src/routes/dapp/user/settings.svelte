<script>
  import { NotificationType } from "$lib/genericTypes";
  import mainStore from "$lib/stores";
  import { isCorsProxyAvailable } from "$lib/utils";
  import { onMount } from "svelte";

  const { notifications, registeredCorsProxies, selectedCorsProxy } = mainStore;

  let selectCorsProxy = "";
  let registerNewCorsProxy = "";
  let modalIsVisible = false;
  let checkingCorsProxy = false;

  const handleSaveSettings = () => {
    const [_, selectCorsProxyURL] = selectCorsProxy;

    // TODO: Add validation
    // console.log(selectCorsProxyURL)

    selectedCorsProxy.setValue(selectCorsProxy);
  };

  const handleRegisterNewCorsProxy = () => {
    let url;
    try {
      url = new URL(registerNewCorsProxy);
    } catch {
    }
    checkingCorsProxy = true;
    isCorsProxyAvailable(url)
      .then((isURLValid) => {
        if (isURLValid) {
          const { origin } = url;
          registeredCorsProxies.addItem(origin);
          modalIsVisible = !modalIsVisible;
          registerNewCorsProxy = "";
        } else {
          notifications.notify({
            type: NotificationType.ERROR,
            message: "URL is Not Valid!",
          });
        }
      })
      .catch((err) => {
        notifications.notify({
          type: NotificationType.ERROR,
          message: "URL is Not Valid!",
        });
      })
      .finally(() => {
        checkingCorsProxy = false;
      });
  };

  onMount(() => {
    selectCorsProxy = $selectedCorsProxy;
  });
</script>

<svelte:head>
  <title>DataGundar Dapp | Settings</title>
</svelte:head>

<!-- TODO: Modularize this -->
<h1>User Settings</h1>
<form class="flex flex-col gap-5" on:submit|preventDefault={handleSaveSettings}>
  <div class="form-control flex">
    <label class="label" for="registeredCorsProxy">
      <span class="label-text">Cors Proxy URL</span>
    </label>
    <!-- TODO: Add option to delete existing CORS Proxy Host -->
    <div class="flex items-center justify-items-center gap-5 w-full">
      <select class="select flex-1" bind:value={selectCorsProxy}>
        {#if $registeredCorsProxies}
          {#each Object.entries($registeredCorsProxies) as [key, corsProxyURL] (key)}
            <option value={corsProxyURL}>{corsProxyURL}</option>
          {:else}
            <option disabled={true}>Please Add new CORS Proxy</option>
          {/each}
        {:else}
          <option disabled={true}>Please Add new CORS Proxy</option>
        {/if}
      </select>
      <label for="my-modal-2" class="btn btn-outline btn-circle">
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
        </svg></label
      >
      <input
        type="checkbox"
        id="my-modal-2"
        class="modal-toggle"
        bind:checked={modalIsVisible}
      />
      <div class="modal">
        <div class="modal-box">
          <form on:submit|preventDefault={handleRegisterNewCorsProxy}>
            <div class="form-control">
              <label class="label" for="newCorsProxy">
                <span class="label-text">New Cors Proxy URL</span>
              </label>
              <input
                type="text"
                placeholder="http://datagundar-corsproxy.app"
                class="input"
                bind:value={registerNewCorsProxy}
              />
            </div>
            <div class="modal-action">
              <button
                type="reset"
                class="btn"
                on:click={() => {
                  modalIsVisible = !modalIsVisible;
                }}
              >
                Cancel
              </button>
              <button
                disabled={checkingCorsProxy}
                class="btn btn-primary"
                type="submit"
              >
                Register CORS Proxy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <button type="submit" class="btn btn-primary">Save Changes</button>
</form>
