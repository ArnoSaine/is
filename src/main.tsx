import { LoaderFunctionArgs } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { curry } from "lodash-es";
import { ReactNode } from "react";

type PickByType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

type Conditions<Values> = Partial<
  Values | Record<keyof PickByType<Values, string[]>, string>
>;

export function create<
  Values extends {
    [key: string]: boolean | string[];
  }
>(
  useValues: () => Values,
  defaultConditions?: Conditions<Values>,
  loadValues?: (args: LoaderFunctionArgs) => Values | Promise<Values>
) {
  function Is({
    children = null,
    fallback = null,
    ...conditions
  }: {
    children?: ReactNode;
    fallback?: ReactNode;
  } & Partial<Conditions<Values>>) {
    return useIs(conditions as Conditions<Values>) ? children : fallback;
  }

  function useIs(conditions?: Partial<Conditions<Values>>) {
    return is(useValues(), conditions);
  }

  const loadIs =
    loadValues &&
    async function loadIs(args: LoaderFunctionArgs) {
      return is(await loadValues(args));
    };

  const is = curry(
    (values: Values, conditions: Conditions<Values> | undefined) =>
      Object.entries({
        ...defaultConditions,
        ...conditions,
      } as Conditions<Values>)
        .filter(([, condition]) => typeof condition !== "undefined")
        .every(([name, condition]) => {
          const value = values[name];
          if (Array.isArray(value)) {
            if (Array.isArray(condition)) {
              return condition.every((condition) => value.includes(condition));
            }
            return value.includes(condition);
          }

          return value === condition;
        })
  );

  return [Is, useIs, loadIs] as const;
}

export const createFromLoader = <
  Values extends {
    [key: string]: boolean | string[];
  }
>(
  loadValues: (args: LoaderFunctionArgs) => Values | Promise<Values>,
  defaultConditions?: Conditions<Values>,
  routeId = "root",
  prop = "is"
) =>
  create(
    () => useRouteLoaderData<any>(routeId)![prop],
    defaultConditions,
    loadValues
  );
