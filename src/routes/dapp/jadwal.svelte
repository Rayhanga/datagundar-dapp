<script lang="ts">
  import { onMount } from "svelte";

  import mainStore from "$lib/stores";
  import jadwalScraper from "$lib/scraper/jadwal";

  let modalIsVisible = false;
  let selectedJadwalItem = null;
  const { selectedCorsProxy, jadwalPerkuliahan } = mainStore;

  const updateJadwal = async () => {
    // jadwalPerkuliahan.clearCollection()
    const updatedJadwal = await jadwalScraper.getJadwalData("4IA88");
    for (const [key, value] of updatedJadwal) {
      jadwalPerkuliahan.addItem(value, key);
    }
  };

  const handleJadwalClick = (key) => {
    modalIsVisible = !modalIsVisible;
    selectedJadwalItem = $jadwalPerkuliahan[key];

    console.log(modalIsVisible, selectedJadwalItem);
  };

  onMount(() => {
    // await updateJadwal();

    // TODO: Create better prompt
    if ($selectedCorsProxy) {
    } else {
      console.log("Please setup CORS Proxy first!");
    }
    // console.log($jadwalPerkuliahan);
  });

  // $: {
  //   console.log($jadwalPerkuliahan);
  //   console.log(Object.entries($jadwalPerkuliahan));
  // }
</script>

<svelte:head>
  <title>DataGundar Dapp | Jadwal Perkuliahan</title>
</svelte:head>

<!-- TODO: Create a Tab to choose between Table View and Card View -->
<!-- TODO: Optimize for mobile view -->

<h1>Jadwal Perkuliahan</h1>
<div class="flex flex-col items-center justify-center h-full w-full">
  <div class="overflow-x-auto w-full">
    {#if $jadwalPerkuliahan}
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
          {#each Object.entries($jadwalPerkuliahan) as [key, jadwal] (key)}
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
  <input id="jadwalItemModal" type="checkbox" class="modal-toggle" bind:checked={modalIsVisible} />
  <div id="jadwalItemModal" class="modal">
    <div class="modal-box card-body">
      {#if selectedJadwalItem}
        <h1 class="card-title">{selectedJadwalItem.matkul}</h1>
        
      {/if}
      <div class="modal-action">
        <button
          type="reset"
          class="btn"
          on:click={() => {
            modalIsVisible = !modalIsVisible;
          }}
        >
          Back
        </button>
      </div>
    </div>
  </div>
</div>
