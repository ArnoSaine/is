import { ActionFunctionArgs } from "@remix-run/node";
import { allowed } from "utils/response";
import { loadIs } from "~/is";
import { commitSession, getSession } from "~/sessions";

export const action = async (args: ActionFunctionArgs) => {
  const is = await loadIs(args);

  const session = await getSession(args.request.headers.get("Cookie"));
  const formData = await args.request.formData();

  if (formData.has("colorScheme")) {
    // Throws 403 Forbidden if the feature is not enabled
    await allowed(is({ feature: "dark-mode" }));

    session.set("colorScheme", formData.get("colorScheme"));
  }

  return new Response(null, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
