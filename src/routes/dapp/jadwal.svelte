<script lang="ts">
  import { onMount } from "svelte";

  import mainStore from "$lib/stores";
  import jadwalScraper from "$lib/scraper/jadwal";

  // const { jadwalPerkuliahan } = mainStore;

  onMount(async () => {
    console.log(jadwalScraper.corsProxyURL);
    console.log(await jadwalScraper.getJadwalData("4IA88"));
    // console.log($jadwalPerkuliahan);
  });
</script>

<svelte:head>
  <title>DataGundar Dapp | Jadwal Perkuliahan</title>
</svelte:head>

<!-- TODO: Create a Tab to choose between Table View and Card View -->
<!-- TODO: Optimize for mobile view -->

<h1>Jadwal Perkuliahan</h1>
<div class="flex flex-col items-center justify-center h-full w-full">
  <!-- <button class="btn btn-lg btn-ghost loading">Loading...</button> -->
  <div class="overflow-x-auto w-full">
    <!-- {#if $jadwalPerkuliahan.length > 0}
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
          {#each $jadwalPerkuliahan as jadwal}
            <tr>
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
      <p>Jadwal is Empty</p>
    {/if} -->
  </div>
</div>
