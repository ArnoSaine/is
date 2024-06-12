import { useFetcher } from "@remix-run/react";
import { Is, useIs } from "~/is";

export default function LoginAndLogout() {
  const { Form } = useFetcher();
  const action = useIs({ authenticated: true }) ? "/logout" : "/login";

  return (
    <Form action={action} method="POST">
      <Is
        authenticated
        fallback={
          <>
            <p>{'Log in with username "admin" or "demo"'}</p>
            <input name="username" type="text" />
            <input name="password" type="password" />
            <button>Log in</button>
          </>
        }
      >
        <button>Log out</button>
      </Is>
    </Form>
  );
}
