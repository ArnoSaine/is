import { createFromLoader } from "@arnosaine/is";
import configs from "../configs.json";
import { loadUser } from "./loaders/user";

const availableFeatures = ["dark-mode-switch", "new-feature"] as const;

type Domain = keyof typeof configs;
type Feature = (typeof availableFeatures)[number];

const [Is, useIs, loadIs] = createFromLoader(async (args) => {
  const { hostname, pathname } = new URL(args.request.url);
  const hostnameParts = hostname.split(".");

  const domain = hostname.endsWith(".localhost")
    ? // On <domain>.localhost, get subdomain.
      hostname.slice(0, -".localhost".length)
    : hostname;

  const basename = "/is/remix-project/";
  const [deployPath] = pathname.slice(basename.length).split("/");
  const isLocal = hostnameParts.at(-1) === "localhost";
  const isPreview = (isLocal ? hostnameParts.at(0) : deployPath) === "preview";

  const configSource = isLocal ? domain : deployPath;

  const user = await loadUser();
  const config =
    configSource in configs ? configs[configSource as Domain] : undefined;

  return {
    authenticated: Boolean(user),
    feature: (isPreview
      ? true // In preview mode, all features are enabled
      : config?.features) as Feature[],
    local: isLocal,
    preview: isPreview,
    role: user?.roles,
  };
});

export { Is, loadIs, useIs };
