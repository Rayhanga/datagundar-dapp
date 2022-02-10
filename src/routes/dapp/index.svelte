<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import mainStore from "$lib/stores";
  import { NotificationType } from "$lib/genericTypes";
  import { goto } from "$app/navigation";

  // TODO: Fix Stateless Store when first initialization
  // To replicate bug: logout, force refresh, login, there will be no states on any stores

  const {
    username,
    userkelas,
    userjurusan,
    notifications,
    jadwalPerkuliahan,
    selectedCorsProxy,
    registeredCorsProxies,
    dataDosen,
  } = mainStore;

  let filteredJadwal = [];

  const getLatestJadwal = () => {
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
        console.log("hello");
        if (key.split("_")[0].toLowerCase().includes(kelas.toLowerCase())) {
          filteredJadwal = [...filteredJadwal, [key, value]];
        }
      }
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
    if ($userjurusan === "" || !$userjurusan) {
      notifications.notify({
        type: NotificationType.INFO,
        message: "Please setup your jurusan First!",
      });
      goto("/dapp/user/");
      return false;
    }

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

  // const

  onMount(() => {
    if (username) {
      if (!$selectedCorsProxy) {
        const defaultCorsProxy = window.location.href.replace(
          "/dapp",
          "/api/defaultcorsproxy"
        );
        registeredCorsProxies.addItem(defaultCorsProxy, defaultCorsProxy);
        selectedCorsProxy.setValue(defaultCorsProxy);
      } else {
        if (validateSetup()) {
          getLatestJadwal();
        }
      }
    }
  });
</script>

<svelte:head>
  <title>DataGundar Dapp | Dashboard</title>
</svelte:head>

{#if $username && $selectedCorsProxy}
  <h1 class="text-4xl text-center">Jadwal Perkuliahan</h1>
  <div class="items-center justify-center w-full">
    <div class="carousel carousel-center rounded-box">
      {#each filteredJadwal as [key, jadwal], i (key)}
        <div
          id={`slide${i}`}
          class="relative w-full pt-20 carousel-item card text-center shadow-2xl left-5 right-5 "
        >
          <div class="card-body space-y-4">
            <h2 class="card-title">
              {jadwal.hari}<br />{jadwal.waktu}
            </h2>
            <h2 class="card-title">{jadwal.matkul}</h2>
            <h2 class="card-title">{jadwal.ruang}</h2>
            <h2 class="card-title">{jadwal.dosen}</h2>
            <div class="justify-center card-actions">
              <a href={`/dapp/jadwal/${key}`} class="btn btn-primary"
                >More info</a
              >
            </div>
            <div
              class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
            >
              {#if i !== 0}
                <a href={`/dapp/#slide${i - 1}`} class="btn btn-circle">❮</a>
              {:else}
                <p class="btn btn-ghost btn-disabled btn-circle" />
              {/if}
              {#if i + 1 !== filteredJadwal.length}
                <a href={`/dapp/#slide${i + 1}`} class="btn btn-circle">❯</a>
              {:else}
                <p class="btn btn-ghost btn-disabled btn-circle" />
              {/if}
            </div>
          </div>
        </div>
      {:else}
        <div class="flex flex-col items-center justify-center h-full w-full">
          <h1>Can't see anything here?</h1>
          <p class="text-2xs italic">
            Please go to <a href="/dapp/jadwal">Jadwal Perkuliahan Page</a> to get
            latest Jadwal Perkuliahan data
          </p>
        </div>
      {/each}
    </div>
  </div>
  <h1 class="text-4xl text-center">Saved Data Dosen</h1>
  {#if Object.entries($dataDosen).length > 0}
    <table class="table w-full table">
      <thead class="text-center">
        <tr>
          <th>Nama</th>
          <th>Email</th>
          <th>Homesite</th>
        </tr>
      </thead>
      <tbody>
        {#each Object.entries($dataDosen) as [key, dosenDataItem] (key)}
          <!-- <tr> -->
          <tr
            class="cursor-pointer"
            on:click={() => goto(`/dapp/dosen/${key}`)}
          >
            <th>{dosenDataItem.nama}</th>
            <td>{dosenDataItem.email}</td>
            <td>{dosenDataItem.homesite}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="flex flex-col items-center justify-center h-full w-full">
      <h1>Can't see anything here?</h1>
      <p class="text-2xs italic">
        Please go to a specific dosen page from jadwal page, all recently opened Data Dosen page will be shown here afterwards
      </p>
    </div>
  {/if}
{:else}
  <div class="flex flex-col items-center justify-center h-full w-full">
    <h1>Can't see anything here?</h1>
    <p class="text-2xs italic">
      Please refresh the page to (hopefully) fix the app, thank you!
    </p>
  </div>
{/if}
