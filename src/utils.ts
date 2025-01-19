export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
export type Unflatten<Type> = Type extends Array<infer Item> ? Item[] : Type[];
export type Boolean<T> = T extends boolean ? T : never;
export type NonBoolean<T> = T extends boolean ? never : T;
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type Never<T> = {
  [P in keyof T]: never;
};
export type HasUnknownKeys<T> = keyof T extends string
  ? false
  : keyof T extends number
  ? false
  : true;

// Convert an array of strings to an object with true values
export function toBooleanValues<
  T extends readonly string[],
  Item extends T[number]
>(strings?: T) {
  return (strings ?? []).reduce(
    (acc, key) => {
      acc[key as Item] = true;
      return acc;
    },
    {} as {
      [K in Item]: true;
    }
  );
}
