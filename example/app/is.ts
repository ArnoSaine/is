import { createFromLoader } from "@arnosaine/is";
import { LoaderFunctionArgs } from "@remix-run/node";
import configs from "configs.json";
import { serverOnly$ } from "vite-env-only";
import { loadUser } from "~/loaders/user";

const features = ["dark-mode", "new"];

export const loadValues = serverOnly$(async (args: LoaderFunctionArgs) => {
  const { hostname } = new URL(args.request.url);

  const domain = (
    hostname.endsWith(".localhost")
      ? hostname.slice(0, -".localhost".length)
      : hostname
  ) as keyof typeof configs;

  const config = configs[domain];

  const hostnameParts = hostname.split(".");

  const user = await loadUser(args);

  const isPreview = hostnameParts.at(0) === "preview";

  return {
    authenticated: Boolean(user),
    role: user?.roles,
    preview: isPreview,
    feature: isPreview ? features : config?.features,

    test: hostnameParts.at(0) === "test",
    local: hostnameParts.at(-1) === "localhost",
  };
})!;

const [Is, useIs, loadIs] = createFromLoader(loadValues);

export { Is, loadIs, useIs };
