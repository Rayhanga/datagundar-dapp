<script lang="ts">
  import "../app.css";
  import { goto } from "$app/navigation";
  import mainStore from "$lib/stores";
  import { onMount } from "svelte";
import NotificationArea from "$lib/components/notificationArea.svelte";

  const { username } = mainStore;

  onMount(() => {
    if ($username) {
      goto("/dapp", { replaceState: true });
    }
  });
</script>

<NotificationArea />
<slot />
