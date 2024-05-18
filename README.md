# @arnosaine/is

Feature flags, roles and permissions-based rendering, A/B testing, and more in React.

Create a custom `<Is>` component and `useIs` hook for any conditional rendering use cases.

Or create shorthand components like `<IsAuthenticated>` and `<HasRole>`, and hooks like `useIsAuthenticated` and `useHasRole`, for the most common use cases.

If you are using React Router or Remix, use `createFromLoader` to also create `loadIs` loader and utility functions like `authenticated`.

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
    - [A/B Testing](#ab-testing)
    - [Enable All Features in Preview Mode](#enable-all-features-in-preview-mode)
    - [Usage](#usage)
  - [Application Variants by the Domain](#application-variants-by-the-domain)
    - [Usage](#usage-1)
  - [User Roles and Permissions](#user-roles-and-permissions)
    - [Usage](#usage-2)
  - [Is a Specific Day](#is-a-specific-day)
    - [Usage](#usage-3)
  - [Shorthand Components and Hooks](#shorthand-components-and-hooks)
    - [Usage](#usage-4)
- [Loader (React Router / Remix)](#loader-react-router-remix)
  - [Setup](#setup)
  - [Using `loadIs`](#using-loadis)
  - [Helpers](#helpers)
- [API](#api)
  - [`create`](#create)
  - [`createFromLoader`](#createfromloader)
  - [`<Is>`](#is)
  - [`useIs`](#useis)
  - [`loadIs`](#loadis)
  - [`Values`](#values)
  - [`Conditions`](#conditions)
  - [`Defaults`](#defaults)

## Demos

- [Remix](https://arnosaine.github.io/is/remix-project/)
- [Vite](https://arnosaine.github.io/is/vite-project/)

## Getting Started

Here we create a component and a hook to check if the user is authenticated or if experimental features are enabled. We get the user from `UserContext`. Experimental features are enabled on `preview.*` hosts, e.g. http://preview.localhost:5173.

### Create `<Is>` & `useIs`

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";
import { use } from "react";
import UserContext from "./UserContext";

const [Is, useIs] = create(function useValues() {
  const user = use(UserContext);

  const isExperimental = location.hostname.startsWith("preview.");

  // Or, get the value from user context, hook call or somewhere else.
  // const isExperimental = user?.roles?.include("developer") ?? false;

  return {
    // Any boolean | string | string[] values can be returned.
    // These will become the prop and hook param names.
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
  Hello!
</Is>;

<Is experimental>
  <SomeExperimentalFeature />
</Is>;

// Hook

const isAuthenticated = useIs({ authenticated: true }); // boolean
const isExperimental = useIs({ experimental: true }); // boolean
```

## Ideas

### Feature Flags

#### Hardcoded Features

A list of hardcoded features is perhaps the simplest method and could improve the project workflow – for example, in the `release` branch some features may be enabled, and in `development` or `feature` branches, something else.

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";

const [Is, useIs] = create(function useValues() {
  return {
    // Hardcoded features
    feature: ["feature-abc", "feature-xyz"],
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
    // Read the enabled features from an environment variable at build time
    feature: JSON.parse(import.meta.env.FEATURES ?? "[]"),
    // ...
  };
});

export { Is, useIs };
```

#### Runtime Features

Read the enabled features from a config file, or an API at runtime:

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

#### A/B Testing

Enable some features based on other values:

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";

const [Is, useIs] = create(function useValues() {
  const features = [
    /*...*/
  ];

  // Enable some features just in development mode:
  if (import.meta.env.MODE === "development") {
    features.push("new-login-form");
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

const newLoginFormIsEnabled = useIs({ feature: "new-login-form" });
```

### Application Variants by the Domain

> ⚠️ The code for other variants is included in the bundle, even if it's not rendered. Consider lazy loading if the code for the variant gets large.

> ℹ️ In the browser, `location.hostname` is a constant, and `location.hostname === "example.com" && <p>This appears only on example.com</p>` could be everything we need. We might still use the `is` pattern for consistency and for server-side actions and loaders.

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
    role: user?.roles,
    permission: user?.permissions,
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
  Hello!
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

### Shorthand Components and Hooks

`./is.ts`:

```tsx
import { create } from "@arnosaine/is";
import { use } from "react";
import UserContext from "./UserContext";

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
  return Object.fromEntries((user?.roles ?? []).map((role) => [role, true]));
});

export { HasRole, useHasRole };

const [HasPermission, useHasPermission] = create(function useValues() {
  const user = use(UserContext);

  // Create object { [permission: string]: true }
  return Object.fromEntries(
    (user?.permissions ?? []).map((permission) => [permission, true])
  );
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

<IsAuthenticated fallback="Please log in">Hello!</IsAuthenticated>;

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

Create `<Is>`, `useIs` & `loadIs` using `createFromLoader`.

`./app/is.ts`:

```tsx
import { createFromLoader } from "@arnosaine/is";
import { LoaderFunctionArgs } from "@remix-run/node";
import { loadConfig, loadUser } from "./loaders";

const [Is, useIs, loadIs] = createFromLoader(async (args) => {
  const user = await loadUser(args);
  const config = await loadConfig(args);

  return {
    authenticated: Boolean(user),
    feature: config?.features,
    role: user?.roles,
  };
});

export { loadIs };
```

`./app/root.tsx`:

Return `is.values` as `is` from the root loader.

```tsx
import { loadIs } from "./is";

// Or clientLoader
export const loader = (args: LoaderFunctionArgs) => {
  const is = await loadIs(args);

  return {
    is: is.values,
    // ...
  };
};
```

### Using `loadIs`

```tsx
import { loadIs } from "./is";

// Or clientLoader
export const loader = (args: LoaderFunctionArgs) => {
  const is = await loadIs(args);

  const isAuthenticated = is({ authenticated: true });
  const hasFeatureABC = is({ feature: "feature-abc" });
  const isAdmin = is({ role: "admin" });

  // ...
};
```

### Helpers

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

  // If the optional role parameter is available, ensure the user has the
  // required roles
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

### `createFromLoader`

### `<Is>`

### `useIs`

### `loadIs`

### `Values`

### `Conditions`

### `Defaults`
