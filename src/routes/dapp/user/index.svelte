<script lang="ts">
  import { goto } from "$app/navigation";

  import { NotificationType } from "$lib/genericTypes";
  import sapScraper from "$lib/scraper/sap";

  import mainStore from "$lib/stores";

  import { onMount } from "svelte";

  const {
    selectedCorsProxy,
    userkelas,
    username,
    userjurusan,
    notifications,
    sapMataKuliah,
  } = mainStore;

  let userProfile = {
    username: "",
    userkelas: "",
    userjurusan: "",
  };

  const handleSaveProfile = () => {
    username.setValue(userProfile.username);
    userkelas.setValue(userProfile.userkelas);
    userjurusan.setValue(userProfile.userjurusan);
    notifications.notify({
      type: NotificationType.SUCCESS,
      message: "Changes have been saved!",
    });
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

  onMount(async () => {
    const updatedData = await sapScraper.getSapData();
    // console.log(updatedData)
    sapMataKuliah.setCollection(updatedData, () => {});
    userProfile.username = $username;
    userProfile.userkelas = $userkelas;
    userProfile.userjurusan = $userjurusan;
  });

  $: {
    // console.log($sapMataKuliah)
  }
</script>

<svelte:head>
  <title>DataGundar Dapp | Profile</title>
</svelte:head>

<h1>User Profile</h1>
<form
  class="flex flex-col space-y-4"
  on:submit|preventDefault={handleSaveProfile}
>
  <div class="form-control">
    <label for="username" class="label">
      <span class="label-text">Username</span>
    </label>
    <input
      type="text"
      placeholder="Username"
      class="input"
      bind:value={userProfile.username}
    />
  </div>
  <div class="form-control">
    <label for="Kelas" class="label">
      <span class="label-text">Kelas</span>
    </label>
    <input
      type="text"
      placeholder="Kelas"
      class="input"
      bind:value={userProfile.userkelas}
    />
  </div>
  <div class="form-control flex">
    <label class="label" for="registeredCorsProxy">
      <span class="label-text">Jurusan</span>
    </label>
    <select class="select flex-1" bind:value={userProfile.userjurusan}>
      {#if $sapMataKuliah}
        {#each Object.keys($sapMataKuliah) as fakultasJurusan (fakultasJurusan)}
          <option value={fakultasJurusan}
            >{fakultasJurusan.replace(/\-/g, " ").replace(/\_/g, ": ")}</option
          >
        {:else}
          <option disabled={true}
            >Please Wait while we retrieve daftar jurusan</option
          >
        {/each}
      {:else}
        <option disabled={true}
          >Please Wait while we retrieve daftar jurusan</option
        >
      {/if}
    </select>
  </div>
  <button type="submit" class="btn btn-primary w-full">Save Changes</button>
</form>
