import { createFromLoader } from "@arnosaine/is";
import { LoaderFunctionArgs } from "@remix-run/node";
import { serverOnly$ } from "vite-env-only";

const loadValues = serverOnly$(async (args: LoaderFunctionArgs) => {
  const { hostname } = new URL(args.request.url);
  const hostnameParts = hostname.split(".");

  return {
    preview: hostnameParts.at(0) === "preview",
  };
})!;

const [IsPreview, useIsPreview, loadIsPreview] = createFromLoader(loadValues, {
  preview: true,
});

export { IsPreview, loadIsPreview, useIsPreview };
