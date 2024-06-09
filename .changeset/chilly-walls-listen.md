---
"@arnosaine/is": patch
---

Improve typings & add test:

- Allow read-only array conditions
- Disallow `children` & `fallback` as condition names

Add option to specify how to match array type values and conditions:

- Use `"every"` (default) to require all conditions to match the values, or `"some"` to require only some conditions to match.
- The default will be switched to `"some"` in version `0.2`.
