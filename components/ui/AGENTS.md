# UI components (`components/ui/`)

StyleX + Base UI primitives from [shadcn-cssinjs](https://www.shadcn-cssinjs.com/). Parent guide: `/AGENTS.md`.

## Pattern

Every file follows this shape:

```tsx
'use client' // only when the primitive needs client hooks

import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { font, leading } from '@/lib/constants.stylex'
import { colors, radius } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({ base: { /* ... */ }, variant: { /* ... */ } })

const variantStyles: Record<'default' | 'outline', StyleXStyles> = {
  default: styles.default,
  outline: styles.outline,
}

// Apply: stylex.props(styles.base, variantStyles[v], customClassName(className), style)
```

## Rules

- **Do not** rewrite to Tailwind, `cva()`, or Radix `asChild`
- **Do not** put `[mq.*]` or `:hover` at the top level of a style namespace
- **Do** use `useRender` + `render` prop for composition (Base UI)
- **Do** set `zIndex: 99999` on menu/tooltip/select positioners (backdrop-blur stacking)
- **Do** sync from registry: `node scripts/install-shadcn-cssinjs.mjs <name>`

## When Base UI needs a string className

Some subcomponents accept `className` as a string, not a spread:

```tsx
className={stylex.props(styles.trigger).className ?? undefined}
```

## Variants and sizes

Use typed maps, not switch statements in JSX:

```tsx
const sizeStyles: Record<ButtonSize, StyleXStyles> = {
  default: styles.sizeDefault,
  sm: styles.sizeSm,
}
```

## Installing new components

```bash
node scripts/install-shadcn-cssinjs.mjs dialog
```

Registry config: `components.json` → `@shadcn-cssinjs`. Utils alias: `@/lib/utils.stylex`.
