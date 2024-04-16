import { useRouteLoaderData } from "@remix-run/react";
import { loader } from "~/root";

export default function PreviewBanner() {
  const { colorScheme } = useRouteLoaderData<typeof loader>("root") ?? {};

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        padding: "0px 2em",
        background: colorScheme === "dark" ? "#bb9611" : "#eabf23",
      }}
    >
      Preview mode
    </div>
  );
}
