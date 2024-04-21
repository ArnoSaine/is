import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
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
import { Is, loadValues } from "~/is";
import { loadColorScheme } from "~/loaders/colorScheme";
import { loadUser } from "~/loaders/user";
import { version } from "../../package.json";
import { IsPreview } from "./isPreview";

export const meta: MetaFunction = () => {
  return [{ title: "<Is>" }, { name: "description", content: "<Is>" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  return {
    user: await loadUser(args),
    colorScheme: await loadColorScheme(args),
    is: await loadValues(args),
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useLoaderData<typeof loader>() ?? {};

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
          <small style={{ color: "gray" }}>GitHub: ArnoSaine/is</small>
        </h1>
        <Is preview>
          <PreviewBanner />
        </Is>
        <LoginAndLogout />
        <Is feature="dark-mode">
          <DarkModeToggle />
        </Is>
        <ul>
          <li>
            <a href="//localhost:5173">localhost</a>,{" "}
            <a href="//preview.localhost:5173">Preview</a>,{" "}
            <a href="//example.com.localhost:5173">example.com</a>,{" "}
            <a href="//acme.com.localhost:5173">acme.com</a>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/protected">Protected</Link>
          </li>
          <li>
            <Link to="/admin">Admin Panel</Link>
          </li>
          <li>
            <Link to="/new-feature">New Feature</Link>
          </li>
        </ul>
        {children}
        <IsPreview>
          <small style={{ display: "block" }}>v.{version}</small>
        </IsPreview>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
