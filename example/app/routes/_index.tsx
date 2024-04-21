import { Link } from "@remix-run/react";
import { Is } from "~/is";
import Greeting from "~/components/Greeting";

export default function Index() {
  return (
    <>
      <Is authenticated fallback="Hello! Please log in.">
        <Greeting />
      </Is>
      <Is role="admin">
        <div>
          <Link to="/admin">Admin Panel</Link>
        </div>
      </Is>
    </>
  );
}
