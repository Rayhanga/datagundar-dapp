<script lang="ts">
  import "../app.css";
  import { goto } from "$app/navigation";
  import mainStore from "$lib/stores";
  import { onMount } from "svelte";

  const { username } = mainStore

  onMount(() => {
    if ($username) {
      goto("/dapp", { replaceState: true });
    }
  });
</script>

<slot />
