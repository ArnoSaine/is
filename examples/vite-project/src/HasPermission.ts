import { create, toBooleanValues } from "@arnosaine/is";
import { useContext } from "react";
import UserContext from "./UserContext";

const [HasPermission, useHasPermission] = create(function useValues() {
  const [user] = useContext(UserContext) ?? [];

  return toBooleanValues(user?.permissions);
});

export { HasPermission, useHasPermission };
