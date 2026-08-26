# CLAUDE.md

Next.js 16 portfolio site with MDX content, StyleX, and Base UI primitives from shadcn-cssinjs.

## Commands

```bash
bun dev          # Development server (webpack, port 3020)
bun run build    # Production build (webpack — required for StyleX CSS)
bun lint         # ESLint (includes @stylexjs/valid-styles)
```

No test framework configured.

## Critical: StyleX (Not Tailwind)

This site migrated from Tailwind to StyleX in Aug 2026. Do not use utility classes, `cva()`, or `cn()`.

```tsx
// Correct
import * as stylex from '@stylexjs/stylex'
import { colors } from '@/lib/tokens.stylex'

const styles = stylex.create({
  card: { backgroundColor: colors.card, color: colors.cardForeground },
})

<div {...stylex.props(styles.card)} />
```

See [Styling with StyleX](.claude/docs/styling.md) for the full pattern guide.

## Critical: Base UI (Not Radix)

This project uses Base UI. Use `render` prop, not `asChild`:

```tsx
// Correct
<Tooltip.Trigger render={<Button />} />

// Wrong - this is Radix pattern
<Tooltip.Trigger asChild><Button /></Tooltip.Trigger>
```

See [Base UI patterns](.claude/docs/base-ui-patterns.md) for full details.

## Documentation

- [Styling with StyleX](.claude/docs/styling.md) — **start here for any UI work**
- [Base UI Patterns](.claude/docs/base-ui-patterns.md) — Component composition, accordion API, z-index
- [Project Architecture](.claude/docs/project-architecture.md) — Directory structure, MDX system, layout
- [Coding Conventions](.claude/docs/coding-conventions.md) — TypeScript, naming, formatting, React patterns
- `AGENTS.md` — workspace rules for coding agents
- `.cursor/skills/tailwind-to-stylex/` — migration skill (historical Tailwind → StyleX conversions)
