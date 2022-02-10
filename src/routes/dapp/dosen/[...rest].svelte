<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { goto } from "$app/navigation";

  import { page } from "$app/stores";
  import { NotificationType } from "$lib/genericTypes";
  import dosenScraper from "$lib/scraper/dosen";
  import mainStore from "$lib/stores";

  const { selectedCorsProxy, notifications, dataDosen } = mainStore;
  let filteredDosenData = [];
  let selectedDosenData;
  let modalIsVisible = false;

  const handleRestParameters = async (restParam: string) => {
    filteredDosenData = [];
    if (validateSetup()) {
      const namaDosen = restParam.split("/")[0].replace(/\-/g, " ");
      filterDosenData(namaDosen);
    }
    // console.log(namaDosen);
    // console.log(await dosenScraper.getData());
  };

  const handleDosenItemClick = (key) => {
    const selectedData = $dataDosen[key];
    // console.log(selectedData);
    if (selectedData) {
      selectedDosenData = selectedData;
      modalIsVisible = true;
    } else {
      notifications.notify({
        type: NotificationType.ERROR,
        message: "Item doesn't exists!",
      });
      goto("/dapp/dosen/");
    }
  };

  const handleCloseModal = () => {
    modalIsVisible = false;
    // handleGoBack();
  };

  const filterDosenData = async (teks) => {
    const localDosenData = $dataDosen;
    const filteredLocalData = Object.entries(localDosenData).filter(
      ([key, _]) => {
        return key.replace(/\-/g, " ").includes(teks);
      }
    );

    if (teks !== "") {
      if (filteredLocalData.length === 0) {
        notifications.notify({
          type: NotificationType.INFO,
          message: `No dosen data found for ${teks} locally`,
        });
        notifications.notify({
          type: NotificationType.INFO,
          message: `Trying to get data for ${teks} from staffsite`,
        });
        const remoteData = await dosenScraper.getData();
        const filteredRemoteData = Object.entries(remoteData).filter(
          ([key, _]) => {
            return key.replace(/\-/g, " ").includes(teks);
          }
        );
        if (filteredRemoteData.length > 0) {
          filteredDosenData = filteredRemoteData;
          for (const [key, value] of filteredRemoteData) {
            dataDosen.updateItem(key, value);
          }
          notifications.notify({
            type: NotificationType.INFO,
            message: `Found data for ${teks} from staffsite`,
          });
          console.log(filteredDosenData);
        } else {
          notifications.notify({
            type: NotificationType.ERROR,
            message: `No data for ${teks} from staffsite`,
          });
        }
      } else {
        filteredDosenData = filteredLocalData;
      }
    } else {
      filteredDosenData = Object.entries(localDosenData);
    }
  };

  const validateSetup = () => {
    if ($selectedCorsProxy === "" || !$selectedCorsProxy) {
      notifications.notify({
        type: NotificationType.INFO,
        message: "Please setup Cors Proxy First!",
      });
      goto("/dapp/user/settings/");
      return false;
    }
    return true;
  };

  // onMount(async () => {
  //   await handleUpdate();
  // });

  $: {
    handleRestParameters($page.params.rest);
  }
</script>

<svelte:head>
  <title>DataGundar Dapp | Dosen</title>
</svelte:head>

{#if filteredDosenData.length > 0}
  <table class="table w-full table">
    <thead class="text-center">
      <tr>
        <th>Nama</th>
        <th>Email</th>
        <th>Homesite</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredDosenData as [key, dosenDataItem] (key)}
        <!-- <tr> -->
        <tr class="cursor-pointer" on:click={() => handleDosenItemClick(key)}>
          <th>{dosenDataItem.nama}</th>
          <td>{dosenDataItem.email}</td>
          <td>{dosenDataItem.homesite}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <input
    id="dosenDataItemModal"
    type="checkbox"
    class="modal-toggle"
    bind:checked={modalIsVisible}
  />
  <div id="sapMatkulItemModal" class="modal">
    <div class="modal-box card-body text-center space-y-4">
      {#if selectedDosenData}
        <h1 class="card-title">
          {selectedDosenData.nama}
        </h1>
        <div>
          <h2 class="card-title">Email</h2>
          <p>
            {selectedDosenData.email}
          </p>
        </div>
        <div>
          <h2 class="card-title">Homesite</h2>
          <p>
            {selectedDosenData.homesite
              ? selectedDosenData.homesite
              : "Doesn't have one :("}
          </p>
        </div>

        <div class="flex justify-center modal-action">
          <a
            class="btn btn-primary flex-1"
            href={`mailto:${selectedDosenData.email}`}
            target="_BLANK"
          >
            Send an email
          </a>
          {#if selectedDosenData.homesite}
            <a
              class="btn btn-primary flex-1"
              href={selectedDosenData.homesite}
              target="_BLANK"
            >
              Go to homesite
            </a>
          {/if}
        </div>
        <div class="flex justify-center modal-action">
          <button
            type="reset"
            class="btn flex-1"
            on:click={() => handleCloseModal()}
          >
            Back
          </button>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex flex-col items-center justify-center h-full w-full">
    {#if $page.params.rest.split("/")[0] === ""}
      <h1>No Saved Data Dosen yet</h1>
    {:else}
      <h1>No Dosen data found for {$page.params.rest.split("/")[0]}</h1>
    {/if}
  </div>
{/if}
