import { create } from "@arnosaine/is";
import { useContext } from "react";
import UserContext from "./UserContext";

const [HasPermission, useHasPermission] = create(function useValues() {
  const [user] = useContext(UserContext) ?? [];

  // Create object { [permission: string]: true }
  return Object.fromEntries(
    (user?.permissions ?? []).map((permission) => [permission, true])
  );
});

export { HasPermission, useHasPermission };
