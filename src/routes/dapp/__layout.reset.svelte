<script lang="ts">
  import "../../app.css";
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";
  import mainStore from "$lib/stores";
  import { user } from "$lib/initGun";
  import NotificationArea from "$lib/components/notificationArea.svelte";
  import { NotificationType } from "$lib/genericTypes";

  const { notifications, username } = mainStore;

  onMount(() => {
    if (!$username) {
      goto("/login", { replaceState: true });
    }
  });

  const handleLogout = () => {
    user.leave();
    username.set("");
    notifications.notify({
      type: NotificationType.INFO,
      message: "Successfully Logged out",
    });
    goto("/", { replaceState: true });
  };
</script>

<NotificationArea />
<div class="shadow bg-base-200 drawer drawer-mobile min-h-screen">
  <input id="sidebar" type="checkbox" class="drawer-toggle" />
  <div class="flex flex-col drawer-content">
    <div
      class="navbar mb-2 shadow-lg bg-neutral text-neutral-content lg:hidden"
    >
      <div class="flex-1 px-2 mx-2">
        <span class="text-lg font-bold">Data Gundar</span>
      </div>
      <div class="flex-none">
        <label for="sidebar" class="btn btn-ghost drawer-button lg:hidden">
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
      </div>
    </div>
    <div class="p-6 min-h-full">
      <slot />
    </div>
  </div>
  <div class="drawer-side">
    <label for="sidebar" class="drawer-overlay" />
    <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
      <li>
        <span>
          <div class="dropdown dropdown-hover w-full">
            <div tabindex="0" class="btn btn-ghost w-full justify-start">
              <!-- The Avatar is kinda broken since PWA will cache everything -->
              <!-- <div class="avatar">
                <div class="mr-4 rounded-full w-10 h-10 bg-white">
                  <img
                    src={`https://avatars.dicebear.com/api/miniavs/${$username}.svg`}
                    alt={`${$username} Avatar`}
                  />
                </div>
              </div> -->
              <span class="capitalize">
                {#if $username}
                  {$username}
                {:else}
                  <button class="btn btn-sm btn-ghost loading"
                    >Loading...</button
                  >
                {/if}
              </span>
            </div>
            <ul
              tabindex="0"
              class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/dapp/user"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="inline-block w-5 h-5 mr-2 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>Profile</a
                >
              </li>
              <li>
                <a href="/dapp/user/settings"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="inline-block w-5 h-5 mr-2 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>Settings</a
                >
              </li>
              <div class="divider" />
              <li on:click={handleLogout}>
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="inline-block w-5 h-5 mr-2 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>Logout</a
                >
              </li>
            </ul>
          </div></span
        >
      </li>
      <li class="menu-title hidden lg:block">
        <span> Data Gundar </span>
      </li>
      <li>
        <a href="/dapp"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline-block w-5 h-5 mr-2 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>Dashboard</a
        >
      </li>
      <li>
        <a href="/dapp/matakuliah"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline-block w-5 h-5 mr-2 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>Mata Kuliah</a
        >
      </li>
      <li>
        <a href="/dapp/jadwal"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline-block w-5 h-5 mr-2 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Jadwal Perkuliahan</a
        >
      </li>
      <li>
        <a href="/dapp/dosen"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline-block w-5 h-5 mr-2 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>Dosen</a
        >
      </li>
    </ul>
  </div>
</div>
