import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { authenticated } from "utils/auth";

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  await authenticated(args);

  return null;
};

export default function Protected() {
  return <h2>Protected</h2>;
}
