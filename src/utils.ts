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
