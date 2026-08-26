# Styling with StyleX

This site uses **StyleX** — not Tailwind. Do not add utility class strings (`flex`, `text-sm`, `dark:bg-*`, etc.) or `cva()` / `cn()` patterns.

## Quick reference

| Need | Use |
|------|-----|
| Component styles | `stylex.create()` + `stylex.props()` |
| Theme colors / radius | `colors`, `radius` from `@/lib/tokens.stylex` |
| Breakpoints | `mq` from `@/lib/constants.stylex` |
| Type scale | `font`, `leading` from `@/lib/constants.stylex` |
| Caller override | `customClassName()` from `@/lib/utils.stylex` |
| Animations | `stylex.keyframes()` |
| Dark mode | CSS variables in `app/globals.css`; `.dark` class via next-themes |

## Standard component pattern

```tsx
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { font, leading, mq } from '@/lib/constants.stylex'
import { colors, radius } from '@/lib/tokens.stylex'
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

## Rules agents must follow

1. **Nest conditions inside property values** — always include `default`:
   ```tsx
   // Correct
   padding: { default: '1rem', [mq.sm]: '1.5rem' }

   // Wrong — @stylexswc rejects this
   [mq.sm]: { padding: '1.5rem' }
   ```

2. **No multi-value shorthands** — split `padding: '1rem 2rem'` into `paddingBlock` / `paddingInline`.

3. **Match font size and line height** — `text-sm` is both `font.sm` and `leading.sm`, not size alone.

4. **Define styles at module scope** — never call `stylex.create()` inside render.

5. **Variants are typed maps** — not `cva()`:
   ```tsx
   const variantStyles: Record<'default' | 'outline', StyleXStyles> = {
     default: styles.default,
     outline: styles.outline,
   }
   ```

6. **Install UI from shadcn-cssinjs** — registry in `components.json`; script at `scripts/install-shadcn-cssinjs.mjs`.

## Build requirements

- Dev and production builds use **webpack** (`next dev --webpack`, `next build --webpack`).
- Do not add empty `turbopack: {}` to silence Next 16 — StyleX CSS will not extract.
- Vercel must run `bun run build` (inherits `--webpack` from `package.json`).

## ESLint guardrails

`@stylexjs/valid-styles` (error) and `@stylexjs/valid-shorthands` (warn) catch common mistakes.

## Further reading

- `AGENTS.md` — workspace rules for coding agents
- `.cursor/skills/tailwind-to-stylex/` — migration playbook and Vercel/lockfile pitfalls
- `.audit/stylex-llm.tsv` — verified StyleX authoring decisions

## Historical note

Plans in `plans/010`–`019` and older docs may still show Tailwind/`cn()` examples from before the Aug 2026 StyleX migration. Treat those as historical; follow this file and `AGENTS.md` instead.
