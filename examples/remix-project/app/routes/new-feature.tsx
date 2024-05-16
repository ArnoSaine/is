import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { found } from "utils/response";
import { loadIs } from "~/is";

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  const is = await loadIs(args);

  await found(is({ feature: "new" }));

  return null;
};

export default function NewFeature() {
  return (
    <>
      <h2>New feature goes here...</h2>
    </>
  );
}
