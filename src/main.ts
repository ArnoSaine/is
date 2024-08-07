import type * as RemixNode from "@remix-run/node";
import type * as RemixReact from "@remix-run/react";
import { curry } from "lodash-es";
import { ReactNode } from "react";
import type * as ReactRouter from "react-router";
import { useMatches, useRouteLoaderData } from "react-router";

export * from "./utils.js";

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
type Unflatten<Type> = Type extends Array<infer Item> ? Item[] : Type[];
type Boolean<T> = T extends boolean ? T : never;
type NonBoolean<T> = T extends boolean ? never : T;
type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type Merge<A, B> = {
  [K in keyof A | keyof B]:
    | (K extends keyof A ? A[K] : never)
    | (K extends keyof B ? B[K] : never);
};
type Never<T> = {
  [P in keyof T]: never;
};

interface ElementProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

type Condition<Value> =
  | Flatten<Boolean<Value> | NonBoolean<Writeable<Value>>>
  | NonBoolean<Flatten<Value>>[]
  | Unflatten<NonBoolean<Writeable<Value>>>;

type Conditions<Values> = Partial<{
  [P in keyof Values]: Readonly<Condition<Values[P]>>;
}> &
  Never<ElementProps>;

type Values<Value = unknown> = {
  [key: string]: Value;
} & Never<ElementProps>;

type Loader<Values> = (args: ExtendedArgs) => Values | Promise<Values>;

type Args =
  | ReactRouter.ActionFunctionArgs
  | ReactRouter.LoaderFunctionArgs
  | RemixNode.ActionFunctionArgs
  | RemixNode.LoaderFunctionArgs
  | RemixReact.ClientActionFunctionArgs
  | RemixReact.ClientLoaderFunctionArgs;

type ExtendedArgs = Args & {
  serverAction: <T = unknown>() => Promise<RemixNode.SerializeFrom<T>>;
  serverLoader: <T = unknown>() => Promise<RemixNode.SerializeFrom<T>>;
  context: any;
};

interface Options {
  method?: "every" | "some";
}

interface LoaderOptions extends Options {
  routeId?: string;
  prop?: string;
}

function __create<V extends Values, C extends Conditions<V>>(
  useValues: () => V,
  defaultConditions?: C,
  options: Options = {}
) {
  const { method = "some" } = options;

  // Curried comparison function
  const is = curry((values: V, conditions: C | undefined) =>
    Object.entries({
      ...defaultConditions,
      ...conditions,
    })
      .filter(([, condition]) => typeof condition !== "undefined")
      .every(([name, condition]) => {
        const value = values[name as keyof typeof values];

        if (Array.isArray(value)) {
          if (Array.isArray(condition)) {
            return condition[method]((cond) => value.includes(cond));
          }
          return value.includes(condition);
        }

        if (Array.isArray(condition)) {
          return condition.includes(value);
        }

        if (typeof value === "boolean") {
          return value === Boolean(condition);
        } else {
          return value === condition;
        }
      })
  );

  // Hook
  const useIs = (conditions?: C) => is(useValues(), conditions);

  // Component
  const Is = ({
    children = null,
    fallback = null,
    ...conditions
  }: Partial<Merge<ElementProps, C>>) =>
    useIs(conditions as C) ? children : fallback;

  return { Is, useIs, is };
}

export function create<V extends Values>(
  useValues: () => V,
  defaultConditions?: Conditions<V>,
  options: Options = {}
) {
  const { Is, useIs } = __create(useValues, defaultConditions, options);

  return [Is, useIs] as const;
}

export function createFromLoader<V extends Values>(
  loadValues: Loader<V>,
  defaultConditions?: Conditions<V>,
  options: LoaderOptions = {}
) {
  const { prop = "__is" } = options;

  // The hook and the component get values from the root loader
  const useValues = () => {
    const root = useMatches()[0];
    const { routeId = root?.id ?? "root" } = options;

    return (useRouteLoaderData(routeId) as any)?.[prop] ?? {};
  };

  const { Is, useIs, is } = __create(useValues, defaultConditions, options);

  async function loadIs(args: Args) {
    const __values = await loadValues(args as any);

    return Object.assign(is(__values), { __values });
  }

  return [Is, useIs, loadIs] as const;
}
