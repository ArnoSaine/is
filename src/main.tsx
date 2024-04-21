import { LoaderFunctionArgs } from "@remix-run/node";
import { curry } from "lodash-es";
import { ReactNode } from "react";

type PickByType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

export default function create<
  Values extends {
    [key: string]: boolean | string[];
  }
>({
  useValues,
  loadValues,
}: {
  useValues: () => Values;
  loadValues: (args: LoaderFunctionArgs) => Values | Promise<Values>;
}) {
  type Conditions = Partial<
    Values | Record<keyof PickByType<Values, string[]>, string>
  >;

  function Is({
    children = null,
    fallback = null,
    ...conditions
  }: {
    children?: ReactNode;
    fallback?: ReactNode;
  } & Conditions) {
    return useIs(conditions as Values) ? children : fallback;
  }

  function useIs(conditions: Conditions) {
    return is(useValues(), conditions);
  }

  async function loadIs(args: LoaderFunctionArgs) {
    return is(await loadValues(args));
  }

  const is = curry((values: Values, conditions: Conditions) =>
    Object.entries(conditions)
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

  return { Is, useIs, loadIs };
}
