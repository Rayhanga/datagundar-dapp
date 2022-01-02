<script context="module">
  export function load({ error, status }) {
    return {
      props: {
        message: error.message,
        status,
      },
    };
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";

  export let message;
  export let status;

  function goBack() {
    const ref = document.referrer;
    goto(ref.length > 0 ? ref : "/dashboard");
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen space-y-4">
  <div class="hidden text-xs text-center lg:block">
    <h1 class="text-4xl">
      {status}
    </h1>
    <p class="text-xl">{message}</p>
    <button on:click={goBack} class="btn btn-ghost">Go Back</button>
  </div>
</div>
