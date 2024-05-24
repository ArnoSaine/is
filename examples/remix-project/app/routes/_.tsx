import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";

export default Outlet;

// The root `ErrorBoundary` does not have access to the root `loader` data.
// Since the root `Layout` export is shared with the root `ErrorBoundary`, and
// we use `<Is>` in the `Layout` export, prefix all routes with `\_.` (pathless
// route) and use `ErrorBoundary` in `_.tsx` to catch errors before they reach
// the root `ErrorBoundary`.
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
