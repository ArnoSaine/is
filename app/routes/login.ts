import { ActionFunctionArgs } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";

const mockUsers = [
  {
    name: "Austin",
    roles: ["admin"],
  },
  {
    name: "demo",
  },
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();

  const username = formData.get("username");

  session.set(
    "user",
    mockUsers.find((user) => user.name === username)
  );

  return new Response(null, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
