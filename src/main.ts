import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  useRouteLoaderData,
} from "@remix-run/react";
import { curry } from "lodash-es";
import { ReactNode } from "react";

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
  | Unflatten<NonBoolean<Writeable<Value>>>;

type Conditions<Values> = Partial<{
  [P in keyof Values]: Readonly<Condition<Values[P]>>;
}> &
  Never<ElementProps>;

type Values<Value = unknown> = {
  [key: string]: Value;
} & Never<ElementProps>;

type Loader<Values> = (args: Args) => Values | Promise<Values>;

type Args =
  | ClientActionFunctionArgs
  | ActionFunctionArgs
  | ClientLoaderFunctionArgs
  | LoaderFunctionArgs;

interface Options {
  routeId?: string;
  prop?: string;
}

function __create<V extends Values, C extends Conditions<V>>(
  useValues: () => V,
  defaultConditions?: C
) {
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
            return condition.every((condition) => value.includes(condition));
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
  defaultConditions?: Conditions<V>
) {
  const { Is, useIs } = __create(useValues, defaultConditions);

  return [Is, useIs] as const;
}

export function createFromLoader<V extends Values>(
  loadValues: Loader<V>,
  defaultConditions?: Conditions<V>,
  options: Options = {}
) {
  const { routeId = "root", prop = "__is" } = options;

  // The hook and the component get values from the root loader
  const useValues = () => useRouteLoaderData<any>(routeId)?.[prop] ?? {};

  const { Is, useIs, is } = __create(useValues, defaultConditions);

  async function loadIs(args: Args) {
    const __values = await loadValues(args);

    return Object.assign(is(__values), { __values });
  }

  return [Is, useIs, loadIs] as const;
}
