import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  useRouteLoaderData,
} from "@remix-run/react";
import { curry } from "lodash-es";
import { ReactNode } from "react";

type Args =
  | ClientActionFunctionArgs
  | ActionFunctionArgs
  | ClientLoaderFunctionArgs
  | LoaderFunctionArgs;

type PickByType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

type Conditions<Values> = Partial<
  Values | Record<keyof PickByType<Values, string[]>, string>
>;

type Values<Value = unknown> = {
  [key: string]: Value | Value[];
};

export function create<Values_ = Values>(
  useValues: () => Values_,
  defaultConditions?: Conditions<Values_>,
  loadValues?: (args: Args) => Values_ | Promise<Values_>
) {
  function Is({
    children = null,
    fallback = null,
    ...conditions
  }: {
    children?: ReactNode;
    fallback?: ReactNode;
  } & Partial<Conditions<Values_>>) {
    return useIs(conditions as Conditions<Values_>) ? children : fallback;
  }

  function useIs(conditions?: Partial<Conditions<Values_>>) {
    return is(useValues(), conditions);
  }

  const loadIs =
    loadValues &&
    async function loadIs(args: Args) {
      const values = await loadValues(args);
      const _is = is(values) as any;
      _is.values = values;
      return _is;
    };

  const is = curry(
    (values: Values_, conditions: Conditions<Values_> | undefined) =>
      Object.entries({
        ...defaultConditions,
        ...conditions,
      } as Conditions<Values_>)
        .filter(([, condition]) => typeof condition !== "undefined")
        .every(([name, condition]) => {
          const value = values[name as keyof typeof values];

          if (Array.isArray(value)) {
            if (Array.isArray(condition)) {
              return condition.every((condition) => value.includes(condition));
            }
            return value.includes(condition);
          }

          if (typeof value === "boolean") {
            return value === Boolean(condition);
          } else {
            return value === condition;
          }
        })
  );

  return [Is, useIs, loadIs] as const;
}

interface Options {
  routeId?: string;
  prop?: string;
}

export const createFromLoader = <
  Values extends {
    [key: string]: undefined | boolean | string[];
  }
>(
  loadValues: (args: Args) => Values | Promise<Values>,
  defaultConditions?: Conditions<Values>,
  options: Options = {}
) => {
  let { routeId, prop } = options;
  routeId ??= "root";
  prop ??= "is";

  const [Is, useIs, loadIs] = create(
    () => useRouteLoaderData<any>(routeId)?.[prop] ?? {},
    defaultConditions,
    loadValues
  );

  return [Is, useIs, loadIs!] as const;
};
