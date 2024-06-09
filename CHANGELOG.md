# @arnosaine/is

## 0.2.0

### Minor Changes

- ebdd4bd: Change the default method to match array type values and conditions from "every" to "some".

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
