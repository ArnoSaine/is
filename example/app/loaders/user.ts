import { LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "~/sessions";

export const loadUser = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  return session.get("user");
};
