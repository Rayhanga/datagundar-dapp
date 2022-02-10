<script lang="ts">
  import { NotificationType } from "$lib/genericTypes";
  import mainStore from "$lib/stores";
  import { toTitleCase } from "$lib/utils";
  import { onDestroy, onMount } from "svelte";

  export let key;
  export let notification;
  export let lifespan;

  const { notifications } = mainStore;
  const { type, message } = notification;

  let timeleft;
  let autoDismiss;
  let alertClass;

  const forceDismiss = () => {
    notifications.removeNotification(key);
  };

  onMount(() => {
    alertClass = `my-3 alert alert-${type} bg-base-300 mx-auto z-50`;
    autoDismiss = setInterval(() => {
      timeleft = Date.now() - key;
      timeleft = timeleft - lifespan;
      if (timeleft >= 0) {
        notifications.removeNotification(key);
      }
    }, 1);
  });

  onDestroy(() => {
    clearInterval(autoDismiss);
  });
</script>

<div class={alertClass}>
  <div class="flex-1 gap-2">
    {#if type === NotificationType.ERROR}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="w-6 h-6 mx-2 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
    {:else if type === NotificationType.INFO}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="w-6 h-6 mx-2 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    {:else if type === NotificationType.WARNING}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="w-6 h-6 mx-2 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    {:else if type === NotificationType.SUCCESS}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    {/if}
    <p>{toTitleCase(message)}</p>
  </div>
  <div class="gap-2">
    <p>
      ({((-1 * timeleft) / 1000).toFixed(1)}s)
    </p>

    <button
      class="btn btn-circle btn-xs btn-ghost"
      on:click={() => forceDismiss()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="inline-block w-6 h-6 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</div>
