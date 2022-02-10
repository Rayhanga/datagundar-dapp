<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import mainStore from "$lib/stores";
  import jadwalScraper from "$lib/scraper/jadwal";
  import { NotificationType } from "$lib/genericTypes";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { createKeyFromString } from "$lib/utils";

  let modalIsVisible = false;
  let selectedJadwalItem = null;
  let filteredJadwal = [];

  const { notifications, selectedCorsProxy, jadwalPerkuliahan, userkelas } =
    mainStore;

  const handleJadwalClick = (key: string) => {
    goto(`/dapp/jadwal/${key}`);
  };

  const handleGoToDosenPage = (dosenKey: string) => {
    handleCloseModal();
    goto(`/dapp/dosen/${createKeyFromString(dosenKey)}`);
  };

  const handleGoToMatkulPage = (matkulKey: string) => {
    handleCloseModal();
    goto(`/dapp/matakuliah/${createKeyFromString(matkulKey)}`);
  };

  const handleGoBack = () => {
    // TODO: Add history to be able to go back to previously visited page
    const ref = document.referrer;
    goto(ref.length > 0 ? ref : "/dapp/jadwal");
  };

  const handleOpenModal = (key: string) => {
    selectedJadwalItem = $jadwalPerkuliahan[key];
    // console.log(selectedJadwalItem)
    if (selectedJadwalItem) {
      modalIsVisible = true;
    } else {
      notifications.notify({
        type: NotificationType.ERROR,
        message: "Item doesn't exists!",
      });
      goto("/dapp/jadwal");
    }
  };

  const handleCloseModal = () => {
    modalIsVisible = false;
    handleGoBack();
  };

  const handleRestParameters = (restParam: string) => {
    filteredJadwal = []
    const jadwalKey = restParam.split("/")[0];
    const jadwalUpdateMeta = JSON.parse(
      localStorage.getItem("jadwalUpdateMeta")
    );
    let kelas = "";
    if (jadwalUpdateMeta) {
      kelas = jadwalUpdateMeta.kelas;
    }
    for (const [key, value] of Object.entries($jadwalPerkuliahan)) {
      if (kelas !== "") {
        // console.log(key.split("_")[0].toLowerCase() === kelas)
        if (key.split("_")[0].toLowerCase().includes(kelas.toLowerCase())) {
          filteredJadwal = [...filteredJadwal, [key, value]];
        }
      } else {
        console.log("hello")
        if (key.split("_")[0].toLowerCase().includes(kelas.toLowerCase())) {
          filteredJadwal = [...filteredJadwal, [key, value]];
        }
      }
    }
    if (jadwalKey !== "") {
      handleOpenModal(jadwalKey);
    } else {
      handleCloseModal();
    }
  };

  const validateSetup = () => {
    if ($userkelas === "" || !$userkelas) {
      notifications.notify({
        type: NotificationType.INFO,
        message: "Please setup your kelas First!",
      });
      goto("/dapp/user/");
      return false;
    }

    if ($selectedCorsProxy === "" || !$selectedCorsProxy) {
      notifications.notify({
        type: NotificationType.INFO,
        message: "Please setup Cors Proxy First!",
      });
      goto("/dapp/user/settings");
      return false;
    }

    return true;
  };

  const checkNeedUpdate = () => {
    const jadwalUpdateMeta = JSON.parse(
      localStorage.getItem("jadwalUpdateMeta")
    );

    if (jadwalUpdateMeta) {
      const { kelas, lastUpdate } = jadwalUpdateMeta;
      if (kelas !== $userkelas) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const updateJadwal = async () => {
    notifications.notify({
      type: NotificationType.INFO,
      message: "Updating jadwal...",
    });
    const updatedJadwal = await jadwalScraper.getJadwalData($userkelas);
    if (updatedJadwal) {
      // if ($userkelas !== kelas) {
      //   jadwalPerkuliahan.clearCollection()
      // for (const [key, _] of Object.entries($jadwalPerkuliahan)) {
      //   console.log(key);
      //   jadwalPerkuliahan.removeItem(key);
      // }
      // }

      for (const [key, value] of updatedJadwal) {
        jadwalPerkuliahan.addItem(value, key);
        filteredJadwal = [...filteredJadwal, [key, value]]
      }
      localStorage.setItem(
        "jadwalUpdateMeta",
        JSON.stringify({
          lastUpdate: Date.now(),
          kelas: $userkelas,
        })
      );
      notifications.notify({
        type: NotificationType.INFO,
        message: "Update jadwal complete",
      });
    }
  };

  const handleUpdate = async () => {
    let needUpdate = false;

    const isSetupValid = validateSetup();

    if (isSetupValid) {
      needUpdate = checkNeedUpdate();
      if (needUpdate) {
        await updateJadwal();
      }
    }
  };

  onMount(async () => {
    validateSetup()
    await handleUpdate();
    if(filteredJadwal.length === 0) {
      handleRestParameters($page.params.rest)
    }
  });

  $: filteredJadwal
  $: {
    handleRestParameters($page.params.rest);
  }
</script>

<svelte:head>
  <title>DataGundar Dapp | Jadwal Perkuliahan</title>
</svelte:head>

<!-- TODO: Create a Tab to choose between Table View and Card View -->
<!-- TODO: Optimize for mobile view -->

<h1>Jadwal Perkuliahan</h1>
<div class="flex flex-col items-center justify-center h-full w-full">
  <div class="overflow-x-auto w-full">
    {#if filteredJadwal.length > 0}
      <table class="table w-full table">
        <thead class="text-center">
          <tr>
            <th>Hari</th>
            <th>Waktu</th>
            <th>Ruang</th>
            <th>Mata Kuliah</th>
            <th>Dosen</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredJadwal as [key, jadwal] (key)}
            <tr class="cursor-pointer" on:click={() => handleJadwalClick(key)}>
              <th>{jadwal.hari}</th>
              <td>{jadwal.waktu}</td>
              <td>{jadwal.ruang}</td>
              <td>{jadwal.matkul}</td>
              <td>{jadwal.dosen}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <button class="btn btn-lg btn-ghost loading">Loading...</button>
    {/if}
  </div>
  <input
    id="jadwalItemModal"
    type="checkbox"
    class="modal-toggle"
    bind:checked={modalIsVisible}
  />
  <div id="jadwalItemModal" class="modal">
    <div class="modal-box card-body text-center space-y-4">
      {#if selectedJadwalItem}
        <h1 class="card-title">{selectedJadwalItem.matkul}</h1>
        <div>
          <h2 class="card-title">Hari, Waktu</h2>
          <p>{selectedJadwalItem.hari}, {selectedJadwalItem.waktu}</p>
        </div>
        <div>
          <h2 class="card-title">Ruang</h2>
          <p>{selectedJadwalItem.ruang}</p>
        </div>
        <div>
          <h2 class="card-title">Dosen</h2>
          <p>{selectedJadwalItem.dosen}</p>
        </div>
        <div class="flex justify-center modal-action">
          <button
            type="reset"
            class="btn btn-primary flex-1"
            on:click={() => handleGoToMatkulPage(selectedJadwalItem.matkul)}
          >
            Go To {selectedJadwalItem.matkul} Page
          </button>
          <button
            type="reset"
            class="btn btn-primary flex-1"
            on:click={() => handleGoToDosenPage(selectedJadwalItem.dosen)}
          >
            Go To {selectedJadwalItem.dosen} Page
          </button>
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
</div>
