# @arnosaine/is

## 0.2.7

### Patch Changes

- 021eb32: Upgrade to `react-router@^7.0.0`

## 0.2.6

### Patch Changes

- 0bfb726: Fix interpretation of array condition type, for example: `["foo", "bar"]` when value type is `"foo" | "bar"`

## 0.2.5

### Patch Changes

- 921033b: Update `react-router` version range from `^6.23.1` to `^6.0.0`

## 0.2.4

### Patch Changes

- 435b0e0: Add support for `ClientActionFunctionArgs` & `ClientLoaderFunctionArgs` types

## 0.2.3

### Patch Changes

- d6a965e: Add package.json keywords

## 0.2.2

### Patch Changes

- 0b9bb54: Fix React Router compatibility

  - Change dependency from `@remix-run/react` to `react-router`

## 0.2.1

### Patch Changes

- d666c03: Add `toBooleanValues` utility

## 0.2.0

### Minor Changes

- ebdd4bd: Change the default method to match array type values and conditions from `"every"` to `"some"`.

## 0.1.3

### Patch Changes

- f70b0e2: Improve typings & add test:

  - Allow read-only array conditions
  - Disallow `children` & `fallback` as condition names

  Add option to specify how to match array type values and conditions:

  - Use `"every"` (default) to require all conditions to match the values, or `"some"` to require only some conditions to match.
  - The default will be switched to `"some"` in version `0.2`.

## 0.1.2

### Patch Changes

- Update README.md

## 0.1.1

### Patch Changes

- 75ff4a0: Update logic for comparing values to array-type conditions. Fix README.md.

## 0.1.0

### Minor Changes

- 5175bf2: First release
