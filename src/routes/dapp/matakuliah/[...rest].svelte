<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { goto } from "$app/navigation";

  import { page } from "$app/stores";
  import { NotificationType } from "$lib/genericTypes";
  import sapScraper from "$lib/scraper/sap";
  import mainStore from "$lib/stores";

  import { onMount } from "svelte";

  const { notifications, selectedCorsProxy, sapMataKuliah, userjurusan } =
    mainStore;

  let filteredSapMatkul = [];
  let selectedSapMatkul = null;
  let modalIsVisible = false;

  const handleRestParameters = (restParam: string) => {
    const sapSearchText = restParam.split("/")[0];
    filterSapData(sapSearchText);
  };

  const handleSapItemClick = (key) => {
    const rawData = $sapMataKuliah[$userjurusan];
    const parsedData = JSON.parse(rawData);
    const selectedData = parsedData[key];
    // console.log(selectedData);
    if (selectedData) {
      selectedSapMatkul = selectedData;
      modalIsVisible = true;
    } else {
      notifications.notify({
        type: NotificationType.ERROR,
        message: "Item doesn't exists!",
      });
      goto("/dapp/matakuliah/");
    }
  };

  const handleCloseModal = () => {
    modalIsVisible = false;
    // handleGoBack();
  };

  const handleGoBack = () => {
    // TODO: Add history to be able to go back to previously visited page
    const ref = document.referrer;
    goto(ref.length > 0 ? ref : "/dapp/matakuliah/");
  };

  const filterSapData = (teks) => {
    if (validateSetup()) {
      const rawData = $sapMataKuliah[$userjurusan];
      const parsedData = JSON.parse(rawData);
      for (const [key, data] of Object.entries(parsedData)) {
        if (teks !== "") {
          if (
            // @ts-ignore
            data.nama.includes(teks.replace(/\-/g, " ").replace(/\_/g, ": "))
          ) {
            filteredSapMatkul = [...filteredSapMatkul, [key, data]];
          }
        } else {
          filteredSapMatkul = [...filteredSapMatkul, [key, data]];
        }
      }
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
    if ($userjurusan === "" || !$userjurusan) {
      notifications.notify({
        type: NotificationType.INFO,
        message: "Please setup your jurusan First!",
      });
      goto("/dapp/user/");
      return false;
    }
    return true;
  };

  const checkNeedUpdate = () => {
    const updateMeta = JSON.parse(
      localStorage.getItem("sapMataKuliahUpdateMeta")
    );
    if (!updateMeta) {
      return true;
    } else {
      return false;
    }
  };

  const updateSapData = async () => {
    notifications.notify({
      type: NotificationType.INFO,
      message: "Updating sap mata kuliah...",
    });
    const updatedSapData = await sapScraper.getSapData();
    if (updatedSapData) {
      sapMataKuliah.setCollection(updateSapData, () => {
        notifications.notify({
          type: NotificationType.INFO,
          message: "Update sap mata kuliah complete",
        });
        localStorage.setItem(
          "sapMataKuliahUpdateMeta",
          JSON.stringify({
            lastUpdate: Date.now(),
          })
        );
      });
    }
  };

  const handleUpdate = async () => {
    let needUpdate = false;

    const isSetupValid = validateSetup();

    if (isSetupValid) {
      needUpdate = checkNeedUpdate();
      if (needUpdate) {
        await updateSapData();
      }
    }
  };

  onMount(async () => {
    // await handleUpdate();
  });

  $: filteredSapMatkul;
  $: {
    handleRestParameters($page.params.rest);
    // console.log($sapMataKuliah);
  }
</script>

<svelte:head>
  <title>DataGundar Dapp | Mata Kuliah</title>
</svelte:head>

<h1>Mata Kuliah</h1>
{#if filteredSapMatkul.length > 0}
  <table class="table w-full table">
    <thead class="text-center">
      <tr>
        <th>Kode</th>
        <th>Nama</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredSapMatkul as [key, sapMatkulItem] (key)}
        <tr class="cursor-pointer" on:click={() => handleSapItemClick(key)}>
          <th>{sapMatkulItem.kode}</th>
          <td>{sapMatkulItem.nama}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <input
    id="sapMatkulItemModal"
    type="checkbox"
    class="modal-toggle"
    bind:checked={modalIsVisible}
  />
  <div id="sapMatkulItemModal" class="modal">
    <div class="modal-box card-body text-center space-y-4">
      {#if selectedSapMatkul}
        <h1 class="card-title">
          {selectedSapMatkul.kode}
          <br />
          {selectedSapMatkul.nama}
        </h1>
        <div>
          <h2 class="card-title">Deskripsi</h2>
          <p>
            {selectedSapMatkul.deskripsi}
          </p>
        </div>

        <div class="flex justify-center modal-action">
          <a
            class="btn btn-primary flex-1"
            href={selectedSapMatkul.downloadUrl}
            target="_BLANK"
          >
            Download SAP / RPS
          </a>
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
    <h1>No SAP matkul found for {$page.params.rest.split("/")[0]}</h1>
  </div>
{/if}
