import { ClientActionFunctionArgs } from "@remix-run/react";

const mockUsers = [
  {
    name: "admin",
    roles: ["admin"],
  },
  {
    name: "demo",
  },
];

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();

  const username = formData.get("username");

  const user = mockUsers.find((user) => user.name === username);

  if (user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  return null;
};
