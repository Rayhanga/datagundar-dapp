<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "$lib/initGun";

  let newUser = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const handleRegister = () => {
    const { username, password, confirmPassword } = newUser;

    if (password !== confirmPassword) {
      console.log("ERROR: Password is not the same with Confirm Password");
      return;
    }

    user.create(username, password, (ack) => {
      if ("err" in ack) {
        console.log(ack.err);
      } else {
        console.log(`A User with username of ${username} has been created`);
        goto("/login");
      }
    });

    newUser = {
      username: "",
      password: "",
      confirmPassword: "",
    };
  };
</script>

<svelte:head>
  <title>DataGundar | Register</title>
</svelte:head>

<div
  class="flex flex-col items-center justify-center drawer-content min-h-screen"
>
  <div class="card bordered">
    <div class="card-body space-y-2">
      <h1 class="text-4xl mb-4">Register</h1>
      <form
        class="flex flex-col space-y-4"
        on:submit|preventDefault={handleRegister}
      >
        <div class="form-control">
          <label for="username" class="label">
            <span class="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="username"
            class="input"
            bind:value={newUser.username}
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
            bind:value={newUser.password}
          />
        </div>
        <div class="form-control">
          <label for="confirmPassword" class="label">
            <span class="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="******"
            class="input"
            bind:value={newUser.confirmPassword}
          />
        </div>
        <button type="submit" class="btn btn-primary w-full">Register</button>
      </form>
      <p>Already have an account? <a href="/login"><u>Login here!</u> </a></p>
    </div>
  </div>
</div>
