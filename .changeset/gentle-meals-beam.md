---
"@arnosaine/is": patch
---

- Cleaner syntax to provide values from the root loader:
  - ~~`return {__is: is.__values /* other loader data */ };`~~
  - New: `return { ...is /* other loader data */ };`
- **Deprecation**: `is.__values` and `__is` property in the root loader data. Use `...is` or `__is_values: is.__is_values` instead.
