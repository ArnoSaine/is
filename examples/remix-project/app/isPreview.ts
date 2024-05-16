import { createFromLoader } from "@arnosaine/is";
import { ClientLoaderFunctionArgs } from "@remix-run/react";

const loadValues = (async (args: ClientLoaderFunctionArgs) => {
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
