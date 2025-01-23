import { RouteObject, useFetcher } from "react-router";
import { Is, useIs } from "./is";

interface User {
  name: string;
  roles?: string[];
}

export function LoginAndLogout() {
  const { Form } = useFetcher();
  const action = useIs({ authenticated: true }) ? "/logout" : "/login";

  return (
    <Form action={action} method="POST">
      <Is authenticated fallback={<button>Log in</button>}>
        <button>Log out</button>
      </Is>
    </Form>
  );
}

export const routes: RouteObject[] = [
  {
    path: "/login",
    action: () => {
      sessionStorage.setItem(
        "user",
        JSON.stringify({ name: "demo", roles: ["admin"] } as User)
      );
      return null;
    },
  },
  {
    path: "/logout",
    action: () => {
      sessionStorage.clear();

      return null;
    },
  },
];

export const getUser = () => {
  return JSON.parse(sessionStorage.getItem("user") ?? "null") as User | null;
};
