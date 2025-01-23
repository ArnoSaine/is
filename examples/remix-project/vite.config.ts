import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { defineConfig, Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const require = createRequire(import.meta.url);

installGlobals();

const base = (process.env.BASENAME ?? "") + "/";

// Current npm workspace has both React Router v6 and v7 installed. Use v6 with Remix.
const workspaceReactRouterV6Patch: Plugin = {
  name: "workspaceReactRouterV6Patch",
  config() {
    return {
      ssr: {
        noExternal: ["@remix-run/react", "react-router-dom"],
      },
      resolve: {
        alias: {
          "react-router": `${dirname(
            require.resolve(
              "../../node_modules/@remix-run/react/node_modules/react-router"
            )
          )}/index.js`,
        },
      },
    };
  },
};

export default defineConfig({
  base,
  plugins: [
    remix({
      basename: base,
      ssr: false,
    }),
    tsconfigPaths(),
    workspaceReactRouterV6Patch,
  ],
});
