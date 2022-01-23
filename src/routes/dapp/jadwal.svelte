<script lang="ts">
  import { getJadwalKuliah } from "$lib/scraper/jadwal";
  import { corsProxy } from "$lib/stores";

  /** Jadwal update flow:
   *  1.    Empty?
   *  1.1.  If Yes, then
   *
   *
   * */

  corsProxy.subscribe((value) => {
    if (value) {
      getJadwalKuliah("4IA88", value);
    }
  });
</script>

<svelte:head>
  <title>DataGundar Dapp | Jadwal Perkuliahan</title>
</svelte:head>

<!-- TODO: Create a Tab to choose between Table View and Card View -->
<!-- TODO: Optimize for mobile view -->

<h1>Jadwal Perkuliahan</h1>
<div class="flex flex-col items-center justify-center h-full w-full">
  <!-- {#await jadwalKuliah}
    <button class="btn btn-lg btn-ghost loading">Loading...</button>
  {:then jadwalData}
    <div class="overflow-x-auto w-full">
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
          {#each jadwalData as jadwal}
            <tr>
              <th>{jadwal.hari}</th>
              <td>{jadwal.waktu}</td>
              <td>{jadwal.ruang}</td>
              <td>{jadwal.matkul}</td>
              <td>{jadwal.dosen}</td>
            </tr>
          {:else}
            <p>Jadwal Kosong...</p>
          {/each}
        </tbody>
      </table>
    </div>
  {:catch error}
    <p class="text-red-600">{error.message}</p>
  {/await} -->
</div>
