import type * as RemixNode from "@remix-run/node";
import type * as RemixReact from "@remix-run/react";
import { curry } from "lodash-es";
import { ReactNode } from "react";
import type * as ReactRouter from "react-router";
import { useMatches, useRouteLoaderData } from "react-router";
import {
  Boolean,
  Flatten,
  HasUnknownKeys,
  Never,
  NonBoolean,
  Unflatten,
  Writeable,
} from "./utils.js";

export * from "./utils.js";

type Merge<A, B> = {
  [K in keyof A | keyof B]:
    | (K extends keyof A ? A[K] : never)
    | (K extends keyof B ? B[K] : never);
};

// Workaround for typing unknown property (condition) names, e.g.
// role names as boolean props.
type HandleUnknownKeys<Conditions> = HasUnknownKeys<Conditions> extends true
  ? any // Has unknown properties
  : Conditions; // Only known properties

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

type Loader<Values> = (
  args: ExtendedDataFunctionArgs
) => Values | Promise<Values>;

type DataFunctionArgs =
  | ReactRouter.ActionFunctionArgs
  | ReactRouter.LoaderFunctionArgs
  | ReactRouter.ClientActionFunctionArgs
  | ReactRouter.ClientLoaderFunctionArgs
  | RemixNode.ActionFunctionArgs
  | RemixNode.LoaderFunctionArgs
  | RemixReact.ClientActionFunctionArgs
  | RemixReact.ClientLoaderFunctionArgs;

type ExtendedDataFunctionArgs = DataFunctionArgs & {
  serverAction: any;
  serverLoader: any;
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
  }: Partial<Merge<ElementProps, HandleUnknownKeys<C>>>) =>
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
  const { prop = "__is_values" } = options;

  // The hook and the component get values from the root loader
  const useValues = () => {
    const root = useMatches()[0];
    const { routeId = root?.id ?? "root" } = options;

    const routeLoaderData = useRouteLoaderData(routeId);

    return (
      // Deprecated
      routeLoaderData?.__is ??
      //
      routeLoaderData?.[prop] ??
      {}
    );
  };

  const { Is, useIs, is } = __create(useValues, defaultConditions, options);

  async function loadIs(args: DataFunctionArgs) {
    const values = await loadValues(args as any);

    return Object.assign(is(values), {
      __values: values, // Deprecated
      [prop]: values,
    });
  }

  return [Is, useIs, loadIs] as const;
}
