import { useRouteLoaderData } from "@remix-run/react";
import { clientLoader } from "~/root";

export default function PreviewBanner() {
  const { colorScheme } = useRouteLoaderData<typeof clientLoader>("root") ?? {};

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
      Preview mode (all features are enabled)
    </div>
  );
}
