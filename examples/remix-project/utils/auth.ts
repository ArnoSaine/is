import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { allowed, authorized } from "assert-response";
import { loadIs } from "~/is";

export const authenticated = async (
  args: ClientLoaderFunctionArgs,
  role?: string | string[]
) => {
  const is = await loadIs(args);

  authorized(is({ authenticated: true }));

  allowed(is({ role }));
};
