import { LoaderFunctionArgs } from "@remix-run/node";
import { loadIs } from "~/is";
import { allowed, authorized } from "utils/response";

export const authenticated = async (
  args: LoaderFunctionArgs,
  role?: string | string[]
) => {
  const is = await loadIs(args);

  authorized(is({ authenticated: true }));

  allowed(is({ role }));
};
