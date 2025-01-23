export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
export type Unflatten<Type> = Type extends Array<infer Item> ? Item[] : Type[];
export type Boolean<T> = T extends boolean ? T : never;
export type NonBoolean<T> = T extends boolean ? never : T;
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type Never<T> = {
  [P in keyof T]: never;
};

export type HasUnknownKeys<T> = string extends keyof T
  ? true // If `string` is assignable to `keyof T`, it has unknown keys.
  : number extends keyof T
  ? true // If `number` is assignable to `keyof T`, it has unknown keys.
  : false; // Otherwise, it only has known keys.

export type Merge<A, B> = {
  [K in keyof A | keyof B]:
    | (K extends keyof A ? A[K] : never)
    | (K extends keyof B ? B[K] : never);
};

// Convert an array of strings to an object with true values
export function toBooleanValues<K extends string>(strings?: readonly K[]) {
  return (strings ?? []).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {} as { [x: string]: true }) as Record<K, true>;
}
