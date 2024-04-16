import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticated } from "utils/auth";

export const loader = async (args: LoaderFunctionArgs) => {
  await authenticated(args, "admin");

  return null;
};

export default function Admin() {
  return <h2>Admin Panel</h2>;
}
