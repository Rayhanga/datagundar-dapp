<script lang="ts">
import { NotificationType } from "$lib/genericTypes";

  import mainStore from "$lib/stores";

  import { onMount } from "svelte";

  const { userkelas, username, notifications } = mainStore;

  let userProfile = {
    username: "",
    userkelas: "",
  };

  const handleSaveProfile = () => {
    username.setValue(userProfile.username);
    userkelas.setValue(userProfile.userkelas);
    notifications.notify({
      type: NotificationType.SUCCESS,
      message: "Changes have been saved!"
    })
  };

  onMount(() => {
    userProfile.username = $username;
    userProfile.userkelas = $userkelas;
  });
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
  <button type="submit" class="btn btn-primary w-full">Save Changes</button>
</form>
