# Direct Edit Source Injection

This repo adds dev-only source location capture for Direct Edit by injecting a
`data-direct-edit-source` attribute into host JSX elements at compile time.

## Why

React 19 no longer exposes reliable source locations in fiber (`_debugSource`),
so runtime-only approaches often return “file not available.” The compile-time
attribute is reliable and framework-agnostic as long as the JSX compiler runs.

## Next.js (App Router)

This app uses `.babelrc` with a dev-only plugin:

```json
{
  "presets": ["next/babel"],
  "env": {
    "development": {
      "plugins": ["direct-edit/babel"]
    }
  }
}
```

The plugin adds:

```
data-direct-edit-source="/[project]/path/to/file.tsx:line:column"
```

Direct Edit reads this attribute and uses it to populate the `in /path:line:column`
line in export context.

## Vite (React)

Use the same plugin via `@vitejs/plugin-react`:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const directEditSource = require('direct-edit/babel')

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [directEditSource],
      },
    }),
  ],
})
```

## Notes

- Dev-only: the plugin should run only in development.
- Dependencies are not annotated unless you transpile them.
- Production builds do not include source attributes.
