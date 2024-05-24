import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { authenticated } from "utils/auth";

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  await authenticated(args, "admin");

  return null;
};

export default function Admin() {
  return <h2>Admin Panel</h2>;
}
