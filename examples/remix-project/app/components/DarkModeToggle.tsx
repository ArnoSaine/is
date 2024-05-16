import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { clientLoader } from "~/root";

export default function DarkModeToggle() {
  const { colorScheme } = useRouteLoaderData<typeof clientLoader>("root") ?? {};
  const fetcher = useFetcher();

  return (
    <label>
      <input
        type="checkbox"
        defaultChecked={colorScheme === "dark"}
        onChange={(event) => {
          fetcher.submit(
            { colorScheme: event.target.checked ? "dark" : "light" },
            { method: "POST", action: "/preferences" }
          );
        }}
      />{" "}
      Dark mode
    </label>
  );
}
