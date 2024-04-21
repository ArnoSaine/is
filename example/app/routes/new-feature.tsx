import { LoaderFunctionArgs } from "@remix-run/node";
import { found } from "utils/response";
import { loadIs } from "~/is";

export const loader = async (args: LoaderFunctionArgs) => {
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
