import { ActionFunctionArgs } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  return new Response(null, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
