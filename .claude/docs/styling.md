# How to style with StyleX

This site uses StyleX. Do not add Tailwind utility classes, `cva()`, or `cn()`.

## Lookup

| Need | Use |
|------|-----|
| Component styles | `stylex.create()` and `stylex.props()` |
| Theme colors and radius | `colors`, `radius` from `@/lib/tokens.stylex` |
| Breakpoints | `mq` from `@/lib/constants.stylex` |
| Type scale | `font` and `leading` from `@/lib/constants.stylex` |
| Caller override | `customClassName()` from `@/lib/utils.stylex` |
| Animations | `stylex.keyframes()` |
| Dark mode | CSS variables in `app/globals.css` and the `.dark` class from next-themes |

## Pattern

```tsx
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { font, leading, mq } from '@/lib/constants.stylex'
import { colors } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  base: {
    display: 'flex',
    fontSize: font.sm,
    lineHeight: leading.sm,
    padding: { default: '1rem', [mq.md]: '1.5rem' },
    backgroundColor: { ':hover': colors.accent, default: colors.background },
  },
})

export function Card({ className, style }: Props) {
  return (
    <div
      {...stylex.props(styles.base, customClassName(className), style as StyleXStyles)}
    />
  )
}
```

## Rules

1. Nest conditions inside property values and include `default`.
   ```tsx
   // Correct
   padding: { default: '1rem', [mq.sm]: '1.5rem' }

   // Wrong. @stylexswc rejects this
   [mq.sm]: { padding: '1.5rem' }
   ```
2. Split multi-value shorthands into longhands such as `paddingBlock` and `paddingInline`.
3. Set both `font.*` and `leading.*` for a text size. Size alone changes card height.
4. Call `stylex.create()` at module scope, never inside render.
5. Map variants with `Record<Variant, StyleXStyles>`, not `cva()`.
6. Install UI from the shadcn-cssinjs registry. See `scripts/install-shadcn-cssinjs.mjs`.

Official authoring notes live at [StyleX LLM resources](https://stylexjs.com/docs/llm-resources).

## Build

Dev and production use webpack (`next dev --webpack`, `next build --webpack`). Do not add empty `turbopack: {}`. Vercel must run `bun run build`.

## Lint

`@stylexjs/valid-styles` errors on top-level media queries. `@stylexjs/valid-shorthands` warns on multi-value shorthands. `npm run lint` also runs `scripts/check-agent-docs.mjs`.
