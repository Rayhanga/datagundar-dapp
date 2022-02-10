<svelte:head>
  <title>DataGundar</title>
</svelte:head>

<div
  class="navbar mb-10 shadow-lg bg-neutral text-neutral-content fixed top-0 w-full z-10"
>
  <div class="flex-none px-2 mx-2">
    <span class="text-lg font-bold"> Data Gundar </span>
  </div>
  <div class="flex-1 px-2 mx-2">
    <div class="items-stretch hidden lg:flex">
      <a href="/" class="btn btn-ghost btn-sm rounded-btn"> Home </a>
      <!-- <a href="/404"/> -->
      <a href="/login" />
      <a href="/register" />
      <a href="/404" />
      <a href="/about" class="btn btn-ghost btn-sm rounded-btn">
        About Data Gundar
      </a>
      <a
        href="https://github.com/rayhanga/datagundar-dapp"
        target="_BLANK"
        class="btn btn-ghost btn-sm rounded-btn"
      >
        Source Code
      </a>
    </div>
  </div>
  <div class="flex-none">
    <a href="/dapp" class="btn btn-square btn-ghost w-44 lg:w-48">
      Continue to Dapp <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 ml-2 lg:ml-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  </div>
</div>
<div class="hero min-h-screen bg-base-200">
  <div class="text-center hero-content">
    <div class="max-w-md">
      <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
      <p class="mb-5">
        Welcome to Datagundar Decentralized App (Dapp).
      </p>
      <p class="mb-5">One stop for most of your academic information needs.
      </p>
      <div class="flex space-x-7 justify-center">
        <a href="/dapp" class="btn btn-primary">
          Continue to Dapp <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 ml-2 lg:ml-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg></a
        >
      </div>
    </div>
  </div>
</div>
