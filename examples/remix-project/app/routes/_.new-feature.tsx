import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { found } from "assert-response";
import { loadIs } from "~/is";

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  const is = await loadIs(args);

  // Throws 404 Not Found if the feature is not enabled
  await found(is({ feature: "new-feature" }));

  return null;
};

export default function NewFeature() {
  return (
    <>
      <h2>New feature goes here...</h2>
    </>
  );
}
