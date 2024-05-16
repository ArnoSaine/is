import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

const basename = (process.env.BASENAME ?? "") + "/";

export default defineConfig({
  base: basename,
  plugins: [
    remix({
      basename,
      ssr: false,
    }),
    tsconfigPaths(),
  ],
});
