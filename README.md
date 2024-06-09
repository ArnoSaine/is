# @arnosaine/is

[Feature Flags](#feature-flags), [Roles and Permissions-based rendering](#user-roles-and-permissions), [A/B Testing, Experimental Features](#ab-testing-experimental-features), and [more](#application-variants-by-the-domain) in React.

## Key Features

- Declarative syntax for conditionally rendering components
- Support for various data sources, including context, hooks, and API responses
- Customizable with default conditions and dynamic values

[Create](#create-is--useis) a custom [`<Is>`](#is) component and [`useIs`](#useis) hook for any conditional rendering use cases.

Or create [shortcut components](#shortcut-components-and-hooks) like `<IsAuthenticated>` and `<HasRole>`, and hooks like `useIsAuthenticated` and `useHasRole`, for the most common use cases.

If you are using React Router or Remix, use [`createFromLoader`](#setup) to also create [`loadIs`](#loadis) loader and utility functions like [`authenticated`](#utilities).

## Contents

- [Demos](#demos)
- [Getting Started](#getting-started)
  - [Create `<Is>` & `useIs`](#create-is--useis)
  - [Use `<Is>` & `useIs`](#use-is--useis)
- [Ideas](#ideas)
  - [Feature Flags](#feature-flags)
    - [Hardcoded Features](#hardcoded-features)
    - [Build Time Features](#build-time-features)
    - [Runtime Features](#runtime-features)
    - [A/B Testing, Experimental Features](#ab-testing-experimental-features)
    - [Enable All Features in Preview Mode](#enable-all-features-in-preview-mode)
    - [Usage](#usage)
  - [Application Variants by the Domain](#application-variants-by-the-domain)
    - [Usage](#usage-1)
  - [User Roles and Permissions](#user-roles-and-permissions)
    - [Usage](#usage-2)
  - [Is a Specific Day](#is-a-specific-day)
    - [Usage](#usage-3)
  - [Shortcut Components and Hooks](#shortcut-components-and-hooks)
    - [Usage](#usage-4)
- [Loader (React Router / Remix)](#loader-react-router--remix)
  - [Setup](#setup)
  - [Using `loadIs`](#using-loadis)
  - [Utilities](#utilities)
- [API](#api)
  - [`create`](#create)
  - [`createFromLoader`](#createfromloader)
  - [`<Is>`](#is)
  - [`useIs`](#useis)
  - [`loadIs`](#loadis)
  - [`is`](#is-1)
- [Types](#types)
  - [`Value`](#value)
  - [`Values`](#values)
  - [`Conditions`](#conditions)

## Demos

- [Remix](https://arnosaine.github.io/is/remix-project/)
- [Vite](https://arnosaine.github.io/is/vite-project/)

## Getting Started

Here, we create a component and a hook to check if the user is authenticated or if experimental features are enabled. We get the user from `UserContext`. Experimental features are enabled on `preview.*` domains, for example, at http://preview.localhost:5173.

### Create `<Is>` & `useIs`

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";
import { use } from "react";
import UserContext from "./UserContext";

const [Is, useIs] = create(function useValues() {
  const user = use(UserContext);

  const isExperimental = location.hostname.startsWith("preview.");

  // Or, get the value from the user context, a hook call, or another
  // source.
  // const isExperimental = user?.roles?.includes("developer") ?? false;

  return {
    // The property names become the prop and hook param names.
    // Allowed types: boolean | number | string | boolean[] | number[] |
    // string[].
    authenticated: Boolean(user),
    experimental: isExperimental,
    // ...
  };
});

export { Is, useIs };
```

### Use `<Is>` & `useIs`

```tsx
import { Is, useIs } from "./is";

// Component

<Is authenticated fallback="Please log in">
  Welcome back!
</Is>;

<Is experimental>
  <SomeExperimentalFeature />
</Is>;

// Hook

const isAuthenticated = useIs({ authenticated: true }); // boolean
const isExperimental = useIs({ experimental: true }); // boolean
```

> ℹ️ Consider lazy loading if the conditional code becomes large. Otherwise, the conditional code is included in the bundle, even if it's not rendered. Additionally, do not use this method if the non-rendered code should remain secret.

## Ideas

### Feature Flags

#### Hardcoded Features

A list of hardcoded features is perhaps the simplest method and can still improve the project workflow. For example, some features can be enabled in the `release` branch, while different features can be enabled in the `main` or `feature` branches.

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";

const [Is, useIs] = create(function useValues() {
  return {
    // Hardcoded features
    feature: ["feature-abc", "feature-xyz"] as const,
    // ...
  };
});

export { Is, useIs };
```

#### Build Time Features

Read the enabled features from an environment variable at build time:

`.env`:

```sh
FEATURES=["feature-abc","feature-xyz"]
```

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";

const [Is, useIs] = create(function useValues() {
  return {
    // Read the enabled features from an environment variable at build
    // time
    feature: JSON.parse(import.meta.env.FEATURES ?? "[]"),
    // ...
  };
});

export { Is, useIs };
```

#### Runtime Features

Read the enabled features from a config file or an API at runtime:

`public/config.json`:

```json
{
  "features": ["feature-abc", "feature-xyz"]
}
```

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";
import { use } from "react"; // React v19

async function getConfig() {
  const response = await fetch(import.meta.env.BASE_URL + "config.json");
  return response.json();
}

const configPromise = getConfig();

const [Is, useIs] = create(function useValues() {
  const config = use(configPromise);

  return {
    feature: config.features,
    // ...
  };
});

export { Is, useIs };
```

#### A/B Testing, Experimental Features

Enable some features based on other values:

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";

const [Is, useIs] = create(function useValues() {
  const features = [
    /*...*/
  ];

  // Enable some features only in development mode:
  if (import.meta.env.MODE === "development") {
    features.push("new-login-form");
  }

  // Or, enable some features only on `dev.*` domains, for example, at
  // http://dev.localhost:5173:
  if (location.hostname.startsWith("dev.")) {
    features.push("new-landing-page");
  }

  return {
    feature: features,
    // ...
  };
});

export { Is, useIs };
```

#### Enable All Features in Preview Mode

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";

const [Is, useIs] = create(function useValues() {
  const features = [
    /*...*/
  ];

  const isPreview = location.hostname.startsWith("preview.");

  return {
    feature: isPreview
      ? // In preview mode, all features are enabled.
        // Typed as string to accept any string as a feature name.
        (true as unknown as string)
      : features,
    // ...
  };
});

export { Is, useIs };
```

#### Usage

It does not matter how the features are defined; using the `<Is>` and `useIs` is the same:

```tsx
import { Is, useIs } from "./is";

// Component

<Is feature="new-login-form" fallback={<OldLoginForm />}>
  <NewLoginForm />
</Is>;

// Hook

const showNewLoginForm = useIs({ feature: "new-login-form" });
```

### Application Variants by the Domain

> ℹ️ In the browser, `location.hostname` is a constant, and `location.hostname === "example.com" && <p>This appears only on example.com</p>` could be all you need. You might still choose to use the Is pattern for consistency and for server-side actions and loaders.

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";

const [Is, useIs] = create(function useValues() {
  const domain = location.hostname.endsWith(".localhost")
    ? // On <domain>.localhost, get subdomain.
      location.hostname.slice(0, -".localhost".length)
    : location.hostname;

  return {
    variant: domain,
    // ...
  };
});

export { Is, useIs };
```

#### Usage

```tsx
import { Is, useIs } from "./is";

// Component

<Is variant="example.com">
  <p>This appears only on example.com</p>
</Is>;

// Hook

const isExampleDotCom = useIs({ variant: "example.com" });
```

### User Roles and Permissions

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";
import { use } from "react";
import UserContext from "./UserContext";

const [Is, useIs] = create(function useValues() {
  const user = use(UserContext);

  return {
    authenticated: Boolean(user),
    role: user?.roles, // ["admin", ...]
    permission: user?.permissions, // ["create-articles", ...]
    // ...
  };
});

export { Is, useIs };
```

#### Usage

```tsx
import { Is, useIs } from "./is";

// Component

<Is authenticated fallback="Please log in">
  Welcome back!
</Is>;

<Is role="admin">
  <AdminPanel />
</Is>;

<Is permission="update-articles">
  <button>Edit</button>
</Is>;

// Hook

const isAuthenticated = useIs({ authenticated: true });
const isAdmin = useIs({ role: "admin" });
const canUpdateArticles = useIs({ permission: "update-articles" });
```

### Is a Specific Day

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";
import { easter } from "date-easter";
import { isSameDay } from "date-fns";

const [Is, useIs] = create(function useValues() {
  return {
    easter: isSameDay(new Date(easter()), new Date()),
    // ...
  };
});

export { Is, useIs };
```

#### Usage

```tsx
import { Is, useIs } from "./is";

// Component

<Is easter>🐣🐣🐣</Is>;

// Hook

const isEaster = useIs({ easter: true });
```

### Shortcut Components and Hooks

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";
import { use } from "react";
import UserContext, { Permission, Role } from "./UserContext";

const [IsAuthenticated, useIsAuthenticated] = create(
  function useValues() {
    const user = use(UserContext);

    return { authenticated: Boolean(user) };
  },
  { authenticated: true } // Default props / hook params
);

export { IsAuthenticated, useIsAuthenticated };

const [HasRole, useHasRole] = create(function useValues() {
  const user = use(UserContext);

  // Create object { [role: string]: true }
  return Object.fromEntries(
    (user?.roles ?? []).map((role) => [role, true])
  ) as Record<Role, true>;
  // Record<"admin" | ..., true >;
});

export { HasRole, useHasRole };

const [HasPermission, useHasPermission] = create(function useValues() {
  const user = use(UserContext);

  // Create object { [permission: string]: true }
  return Object.fromEntries(
    (user?.permissions ?? []).map((permission) => [permission, true])
  ) as Record<Permission, true>;
  // Record<"create-articles" | "read-articles" | ..., true >
});

export { HasPermission, useHasPermission };

// For a very specific use case
const [CanUpdateArticles, useCanUpdateArticles] = create(
  function useValues() {
    const user = use(UserContext);

    return {
      updateArticles: user?.permissions?.includes("update-articles") ?? false,
    };
  },
  { updateArticles: true } // Default props / hook params
);

export { CanUpdateArticles, useCanUpdateArticles };
```

#### Usage

```tsx
import {
  HasPermission,
  HasRole,
  IsAuthenticated,
  useHasPermission,
  useHasRole,
  useIsAuthenticated,
  // For a very specific use case
  CanUpdateArticles,
  useCanUpdateArticles,
} from "./is";

// Components

<IsAuthenticated fallback="Please log in">Welcome back!</IsAuthenticated>;

<HasRole admin>
  <AdminPanel />
</HasRole>;

<HasPermission update-articles>
  <button>Edit</button>
</HasPermission>;

<CanUpdateArticles>
  <button>Edit</button>
</CanUpdateArticles>;

// Hooks

const isAuthenticated = useIsAuthenticated();
const isAdmin = useHasRole({ admin: true });
const canUpdateArticles = useHasPermission({ "update-articles": true });
const canUpdateArticles = useCanUpdateArticles();
```

## Loader (React Router / Remix)

### Setup

1. Create `<Is>`, `useIs` & `loadIs` using [`createFromLoader`](#createfromloader).

   `./app/is.ts`:

   ```tsx
   import { createFromLoader } from "@arnosaine/is";
   import { LoaderFunctionArgs } from "@remix-run/node";
   import { loadConfig, loadUser } from "./loaders";

   const [Is, useIs, loadIs] = createFromLoader(async (args) => {
     const { hostname } = new URL(args.request.url);
     const isPreview = hostname.startsWith("preview.");
     const user = await loadUser(args);
     const config = await loadConfig(args);

     return {
       authenticated: Boolean(user),
       feature: config?.features,
       preview: isPreview,
       role: user?.roles,
       // ...
     };
   });

   export { Is, useIs, loadIs };
   ```

   `./app/root.tsx`:

2. Return `is.__values` as `__is` from the root `loader` / `clientLoader`. See [options](#parameters-1) to use other route or prop name.

   ```tsx
   import { loadIs } from "./is";

   export const loader = (args: LoaderFunctionArgs) => {
     const is = await loadIs(args);

     return {
       __is: is.__values,
       // ...
     };
   };
   ```

> ℹ️ The root `ErrorBoundary` does not have access to the root `loader` data. Since the root `Layout` export is shared with the root `ErrorBoundary`, if you use `<Is>` or `useIs` in the `Layout` export, consider prefixing all routes with `_.` (pathless route) and using `ErrorBoundary` in [`routes/_.tsx`](examples/remix-project/app/routes/_.tsx) to catch errors before they reach the root `ErrorBoundary`.

### Using `loadIs`

```tsx
import { loadIs } from "./is";

// Or clientLoader
export const loader = (args: LoaderFunctionArgs) => {
  const is = await loadIs(args);

  const isAuthenticated = is({ authenticated: true });
  const hasFeatureABC = is({ feature: "feature-abc" });
  const isPreview = is({ preview: true });
  const isAdmin = is({ role: "admin" });

  // ...
};
```

### Utilities

> ℹ️ See Remix example [utils/auth.ts](examples/remix-project/utils/auth.ts) and [utils/response.ts](examples/remix-project/utils/response.ts) for more examples.

`./app/utils/auth.tsx`:

```tsx
import { loaderFunctionArgs } from "@remix-run/node";
import { allowed, authorized } from "utils/response";
import { loadIs } from "./is";

export const authenticated = async (
  args: LoaderFunctionArgs,
  role?: string | string[]
) => {
  const is = await loadIs(args);

  // Ensure user is authenticated
  if (!is({ authenticated: true })) {
    throw new Response("Unauthorized", {
      status: 401,
    });
  }

  // If the optional role parameter is available, ensure the user has
  // the required roles
  if (!is({ role })) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }
};
```

```tsx
import { authenticated } from "./utils/auth";

export const loader = (args: LoaderFunctionArgs) => {
  await authenticated(args, "admin");

  // User is authenticated and has the role "admin".

  // ...
};
```

## API

### `create`

Call `create` to declare the [`Is`](#is) component and the [`useIs`](#useis) hook.

```ts
const [Is, useIs] = create(useValues, defaultConditions?);
```

The names `Is` and `useIs` are recommended for a multi-purpose component and hook. For single-purpose use, you can name them accordingly. The optional `defaultConditions` parameter is also often useful for single-purpose implementations.

```ts
const [IsAuthenticated, useIsAuthenticated] = create(
  () => {
    // Retrieve the user. Since this is a hook, using other hooks and
    // context is allowed.
    const user = { name: "Example" }; // Example: use(UserContext)
    return { authenticated: Boolean(user) };
  },
  { authenticated: true }
);
```

#### Parameters

- `useValues`: A React hook that acquires and computes the current [`values`](#values) for the comparison logic.
- **optional** `defaultConditions`: The default props/params for [`Is`](#is) and [`useIs`](#useis).
- **optional** `options`: An options object for configuring the behavior.
  - **optional** `method` (`"every" | "some"`): Default: `"every"`. Specifies how to match array type values and conditions. Use `"every"` to require all conditions to match the values, or `"some"` to require only some conditions to match.

#### Returns

`create` returns an array containing the [`Is`](#is) component and the [`useIs`](#useis) hook.

### `createFromLoader`

Call `createFromLoader` to declare the [`Is`](#is) component the [`useIs`](#useis) hook and the [`loadIs`](#loadis) loader.

```ts
const [Is, useIs, loadIs] = createFromLoader(loadValues, defaultConditions?, options?);
```

The names `Is`, `useIs` and `loadIs` are recommended for a multi-purpose component, hook, and loader. For single-purpose use, you can name them accordingly. The optional `defaultConditions` parameter is also often useful for single-purpose implementations.

```ts
const [IsAuthenticated, useIsAuthenticated, loadIsAuthenticated] =
  createFromLoader(
    async (args) => {
      // Retrieve the user. Since this is a loader, using await and
      // other loaders is allowed.
      const user = await loadUser(args);
      return { authenticated: Boolean(user) };
    },
    { authenticated: true }
  );
```

#### Parameters

- `loadValues`: A React Router / Remix loader function that acquires and computes the current `values` for the comparison logic.
- **optional** `defaultConditions`: The default props/params for [`Is`](#is), [`useIs`](#useis) and [`is`](#is-1).
- **optional** `options`: An options object for configuring the behavior.
  - **optional** `method` (`"every" | "some"`): Default: `"some"`. Specifies how to match array type values and conditions. Use `"some"` to require only some conditions to match the values, or `"every"` to require all conditions to match.
  - **optional** `prop`: Default: `"__is"`. The property name in the loader's return value that provides `is.__values`.
  - **optional** `routeId`: Default: `"root"`. The route that provides the `is.__values` from its loader. Example: `"routes/admin"`.

#### Returns

`createFromLoader` returns an array containing the [`Is`](#is) component, the [`useIs`](#useis) hook and the [`loadIs`](#loadis) loader.

### `<Is>`

#### Props

- `...conditions`: Conditions are merged with the `defaultConditions` and then compared to the [`useValues`](#parameters) / [`loadValues`](#parameters-1) return value. If multiple conditions are given, all must match their corresponding values. For any array-type condition:
  - If the corresponding value is also an array and `options.method` is `"some"` (default), the value array must include at least one of the condition entries. If `options.method` is `"every"`, the value array must include all condition entries.
  - If the corresponding value is not an array, the value must be one of the condition entries.
- **optional** `children`: The UI you intend to render if all conditions match.
- **optional** `fallback`: The UI you intend to render if some condition does not match.

#### Usage

```tsx
<Is authenticated fallback="Please log in">
  Welcome back!
</Is>

<IsAuthenticated fallback="Please log in">Welcome back!</IsAuthenticated>
```

### `useIs`

#### Parameters

- `conditions`: Conditions are merged with the `defaultConditions` and then compared to the [`useValues`](#parameters) / [`loadValues`](#parameters-1) return value. If multiple conditions are given, all must match their corresponding values. For any array-type condition:
  - If the corresponding value is also an array and `options.method` is `"some"` (default), the value array must include at least one of the condition entries. If `options.method` is `"every"`, the value array must include all condition entries.
  - If the corresponding value is not an array, the value must be one of the condition entries.

#### Returns

`useIs` returns `true` if all conditions match, `false` otherwise.

#### Usage

```tsx
const isAuthenticated = useIs({ authenticated: true });
const isAuthenticated = useIsAuthenticated();
```

### `loadIs`

#### Parameters

- `args`: React Router / Remix `LoaderFunctionArgs`, `ActionFunctionArgs`, `ClientLoaderFunctionArgs`, or `ClientActionFunctionArgs`.

#### Returns

`loadIs` returns a `Promise` that resolves to the [`is`](#is-1) function.

#### Usage

```tsx
export const loader = async (args: LoaderFunctionArgs) => {
  const is = await loadIs(args);
  const authenticated = await loadIsAuthenticated(args);

  const isAuthenticated = is({ authenticated: true });
  const isAuthenticated = authenticated();
  // ...
};
```

### `is`

`is` function is the awaited return value of calling [`loadIs`](#loadis).

#### Parameters

- `conditions`: Conditions are merged with the `defaultConditions` and then compared to the [`useValues`](#parameters) / [`loadValues`](#parameters-1) return value. If multiple conditions are given, all must match their corresponding values. For any array-type condition:
  - If the corresponding value is also an array and `options.method` is `"some"` (default), the value array must include at least one of the condition entries. If `options.method` is `"every"`, the value array must include all condition entries.
  - If the corresponding value is not an array, the value must be one of the condition entries.

#### Returns

`is` returns a `true` if all conditions match, `false` otherwise.

#### Usage

In `root.tsx` you must also return `is.__values` as `__is` from the `loader` / `clientLoader`. See [options](#parameters-1) to use other route or prop name.

```tsx
export const loader = (args: LoaderFunctionArgs) => {
  const is = await loadIs(args);

  return {
    __is: is.__values,
    // ...
  };
};
```

## Types

### `Value`

- Type `Value` is `boolean | number | string`.
- It may also be more specific, like a union of `string` values.

#### Example

```ts
const features = ["feature-abc", "feature-xyz"] as const;

// "feature-abc" | "feature-xyz"
type Feature = (typeof features)[number];
```

### `Values`

- Type `Values` is `Record<string, Value | Value[]>`.

#### Example

```json
{
  "authenticated": true,
  "roles": ["admin"],
  "permissions": [
    "create-articles",
    "read-articles",
    "update-articles",
    "delete-articles"
  ]
}
```

### `Conditions`

- Type `Conditions` is `Partial<Values>`.

#### Example

```json
{
  "roles": "admin"
}
```
