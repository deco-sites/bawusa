import { defineConfig } from "$fresh/server.ts";
import plugins from "https://denopkg.com/deco-sites/std@1.22.0/plugins/mod.ts";
import manifest from "./manifest.gen.ts";

export default defineConfig({
  build: { target: ["chrome99", "firefox99", "safari12"] },
  plugins: plugins({ manifest }),
});
