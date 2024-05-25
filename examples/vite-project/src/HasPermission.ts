import { create } from "@arnosaine/is";
import { useContext } from "react";
import UserContext, { Permission } from "./UserContext";

const [HasPermission, useHasPermission] = create(function useValues() {
  const [user] = useContext(UserContext) ?? [];

  return Object.fromEntries(
    (user?.permissions ?? []).map((permission) => [permission, true])
  ) as Record<Permission, true>;
});

export { HasPermission, useHasPermission };
