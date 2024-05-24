import { ClientActionFunctionArgs } from "@remix-run/react";
import { allowed } from "utils/response";
import { loadIs } from "~/is";

export const clientAction = async (args: ClientActionFunctionArgs) => {
  const is = await loadIs(args);

  const formData = await args.request.formData();

  if (formData.has("colorScheme")) {
    // Throws 403 Forbidden if the feature is not enabled
    await allowed(is({ feature: "dark-mode-switch" }));

    const colorScheme = formData.get("colorScheme");
    if (colorScheme) {
      sessionStorage.setItem("colorScheme", colorScheme as string);
    } else {
      sessionStorage.removeItem("colorScheme");
    }
  }

  return null;
};
