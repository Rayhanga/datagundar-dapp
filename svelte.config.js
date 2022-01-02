import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";

const dev = process.env.NODE_ENV === "development";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],

  kit: {
    target: "#svelte",
    adapter: adapter({
      // default options are shown
      pages: "build",
      assets: "build",
      fallback: "200.html",
      paths: {
        base: dev ? "" : "/datagundar-dapp",
      },
      // If you are not using a .nojekyll file, change your appDir to something not starting with an underscore.
      // For example, instead of '_app', use 'app_', 'internal', etc.
      appDir: "internal",
    }),
  },
};

export default config;
