import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticated } from "utils/auth";

export const loader = async (args: LoaderFunctionArgs) => {
  await authenticated(args);

  return null;
};

export default function Protected() {
  return <h2>Protected</h2>;
}
