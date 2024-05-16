import { useRouteLoaderData } from "@remix-run/react";
import { clientLoader } from "~/root";

export default function Greeting() {
  const { user } = useRouteLoaderData<typeof clientLoader>("root")!;

  return (
    <>
      Hello, <strong>{user.name}</strong>!
    </>
  );
}
