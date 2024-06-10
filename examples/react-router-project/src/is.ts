import { createFromLoader } from "@arnosaine/is";
import { getUser } from "./mockAuth";

const [Is, useIs, loadIs] = createFromLoader(async () => {
  const user = getUser();

  return {
    authenticated: Boolean(user),
    role: user?.roles,
  };
});

export { Is, loadIs, useIs };
