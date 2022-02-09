<script lang="ts">
  import mainStore from "$lib/stores";
  import { goto } from "$app/navigation";
  import { user } from "$lib/initGun";
  import { onMount } from "svelte";
  import NotificationArea from "$lib/components/notificationSystem/notificationArea.svelte";
import { NotificationType } from "$lib/genericTypes";

  const { notifications, username } = mainStore;

  let userCredential = {
    username: "",
    password: "",
  };

  onMount(() => {
    if ($username) {
      goto("/dapp");
    }
  });

  const handleLogin = () => {
    const { username, password } = userCredential;

    user.auth(username, password, (ack) => {
      if ("err" in ack) {
        if (ack) {
          notifications.notify({
            type: NotificationType.ERROR,
            message: ack.err
          })
        }
      } else {
          notifications.notify({
            type: NotificationType.INFO,
            message: `Successfully Logged in as ${username}`
          })
        console.log(`Logged In`);
        goto("/dapp");
      }
    });
    userCredential = {
      username: "",
      password: "",
    };
  };
</script>

<svelte:head>
  <title>DataGundar | Login</title>
</svelte:head>

<NotificationArea />
<div
  class="flex flex-col items-center justify-center drawer-content min-h-screen"
>
  <div class="card bordered">
    <div class="card-body space-y-2">
      <h1 class="text-4xl mb-4">Login</h1>
      <form
        class="flex flex-col space-y-4"
        on:submit|preventDefault={handleLogin}
      >
        <div class="form-control">
          <label for="username" class="label">
            <span class="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="username"
            class="input"
            bind:value={userCredential.username}
          />
        </div>
        <div class="form-control">
          <label for="password" class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="******"
            class="input"
            bind:value={userCredential.password}
          />
        </div>
        <button type="submit" class="btn btn-primary w-full">Login</button>
      </form>
      <p>
        Doesn't have an account? <a href="/register"
          ><u>Create one here!</u>
        </a>
      </p>
    </div>
  </div>
</div>
