<script lang="ts">
  import "../app.css";
  import { goto } from "$app/navigation";
  import { username } from "$lib/stores";
  import { onMount } from "svelte";

  onMount(() => {
    if ($username) {
      goto("/dapp", { replaceState: true });
    }
  });
</script>

<slot />
