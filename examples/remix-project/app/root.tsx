import { MetaFunction } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import DarkModeToggle from "~/components/DarkModeToggle";
import LoginAndLogout from "~/components/LoginAndLogout";
import PreviewBanner from "~/components/PreviewBanner";
import { Is, loadIs } from "~/is";
import { loadColorScheme } from "~/loaders/colorScheme";
import { loadUser } from "~/loaders/user";

export const meta: MetaFunction = () => {
  return [{ title: "<Is>" }, { name: "description", content: "<Is>" }];
};

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  const is = await loadIs(args);

  return {
    user: loadUser(),
    colorScheme: loadColorScheme(),
    is: is.values,
  };
};

const port = import.meta.env.MODE === "production" ? 3000 : 5173;

export function HydrateFallback() {
  return <p>Loading...</p>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useLoaderData<typeof clientLoader>() ?? {};

  return (
    <html lang="en" style={{ colorScheme }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          lineHeight: "1.8",
        }}
      >
        <h1>
          &lt;Is&gt;{" "}
          <small>
            <a href="https://github.com/ArnoSaine/is">GitHub: ArnoSaine/is</a>
          </small>
        </h1>
        <Is preview>
          <PreviewBanner />
        </Is>
        <LoginAndLogout />
        <Is feature="dark-mode">
          <DarkModeToggle />
        </Is>
        <p>
          Try other URLs for different modes and features:{" "}
          <Is
            local
            fallback={
              <>
                <a href="/is/remix-project/">release</a>,{" "}
                <a href="/is/remix-project/preview/">preview</a>,{" "}
                <a href="/is/remix-project/example.com/">example.com</a>,{" "}
                <a href="/is/remix-project/acme.com/">acme.com</a>
              </>
            }
          >
            <a href={`//localhost:${port}`}>release</a>,{" "}
            <a href={`//preview.localhost:${port}`}>preview</a>,{" "}
            <a href={`//example.com.localhost:${port}`}>example.com</a>,{" "}
            <a href={`//acme.com.localhost:${port}`}>acme.com</a>
          </Is>
        </p>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/protected">Protected</Link>
            <Is authenticated fallback=" ⛔️" />
          </li>
          <li>
            <Link to="/admin">Admin Panel</Link>
            <Is role="admin" fallback=" ⛔️" />
          </li>
          <li>
            <Link to="/new-feature">New Feature</Link>
            <Is feature="new" fallback=" ⛔️" />
          </li>
        </ul>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
