<script lang="ts">
  import { goto } from "$app/navigation";

  function goBack() {
    const ref = document.referrer;
    goto(ref.length > 0 ? ref : "/");
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen space-y-4">
  <div class="hidden text-xs text-center lg:block">
    <h1 class="text-4xl">
      404
    </h1>
    <p class="text-xl">Uh oh the page that you're looking for is not here :(</p>
    <button on:click={goBack} class="btn btn-ghost">Go Back</button>
  </div>
</div>