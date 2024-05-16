import { create } from "@arnosaine/is";
import * as React from "react";
import { useUser } from "./UserContext";

const { use } = React as unknown as {
  use: <Value>(promise: Promise<Value>) => Value;
};

const { hostname, pathname } = location;
const hostnameParts = hostname.split(".");

const domain = hostname.endsWith(".localhost")
  ? // If used as <domain>.localhost, get subdomain.
    hostname.slice(0, -".localhost".length)
  : hostname;

const basename = "/is/vite-project/";
const [deployPath] = pathname.slice(basename.length).split("/");
const isLocal = hostnameParts.at(-1) === "localhost";
export const isPreview =
  (isLocal ? hostnameParts.at(0) : deployPath) === "preview";

const availableConfigs = ["acme.com", "example.com"];
const configSource = isLocal ? domain : deployPath;

const configPromise = getConfig(
  availableConfigs.includes(configSource) ? configSource : "default"
);

const useValues = () => {
  const [user] = useUser()!;

  const config = use(configPromise);

  return {
    authenticated: Boolean(user),
    feature: isPreview
      ? // In preview mode all features are enabled.
        // Typed as string, to accept any string as feature name.
        (true as unknown as string)
      : config.features,
    local: isLocal,
    preview: isPreview,
    role: user?.roles,
  };
};

const [Is, useIs] = create(useValues);

export { Is, useIs };

// Read feature flags at runtime from /public.
async function getConfig(
  config: string
): Promise<typeof import("../public/configs/default.json")> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}configs/${config}.json`
  );

  return response.json();
}
