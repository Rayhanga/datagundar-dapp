<script lang="ts">
  import mainStore from "$lib/stores";
  import Notification from "./notification.svelte";

  const { notifications } = mainStore;

  const lifespan = 2000; // in ms
</script>

{#if $notifications}
  {#if Object.entries($notifications).length !== 0}
    <div class="fixed w-screen z-50 p-5">
      {#each Object.entries($notifications) as [key, notification] (key)}
        <Notification {key} {notification} {lifespan} />
      {/each}
    </div>
  {/if}
{/if}
