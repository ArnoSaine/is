import { useRouteLoaderData } from "@remix-run/react";
import { loader } from "~/root";

export default function Greeting() {
  const { user } = useRouteLoaderData<typeof loader>("root")!;

  return (
    <>
      Hello, <strong>{user.name}</strong>!
    </>
  );
}
