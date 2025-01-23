import React from "react";
import ReactDOM from "react-dom/client";
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router";
import "./index.css";
import { loadIs } from "./is";
import { LoginAndLogout, routes } from "./mockAuth";
import { authorized } from "./utils/response";

const router = createBrowserRouter(
  [
    {
      path: "/",
      loader: async (args) => {
        const is = await loadIs(args);

        return {
          __is: is.__values,
        };
      },
      element: (
        <>
          <LoginAndLogout />
          <Outlet />
        </>
      ),
      errorElement: (
        <>
          <h1>Oops!</h1>
          <Link to="/">Home</Link>
        </>
      ),
      children: [
        {
          path: "/",
          element: (
            <>
              <h1>Hello World</h1>
              <Link to="protected">Protected</Link>
            </>
          ),
        },
        {
          path: "protected",
          loader: async (args) => {
            const is = await loadIs(args);

            authorized(is({ authenticated: true }));

            return null;
          },
          element: (
            <>
              <h1>Protected</h1>
              <Link to="/">Home</Link>
            </>
          ),
        },
      ],
    },
    ...routes,
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
