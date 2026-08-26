# AGENTS.md

Next.js 16 portfolio. StyleX styling, Base UI primitives, MDX content. Read this first.

## Commands

```bash
npm run dev      # next dev -p 3020 --webpack (webpack required for StyleX CSS)
npm run build    # next build --webpack + sitemap
npm run lint     # ESLint incl. @stylexjs/valid-styles
npm run start    # production server
```

No test framework. Do not add one unless asked.

## Boundaries

### Never

- Tailwind utility classes, `cva()`, `cn()`, `clsx`, `tailwind-merge`
- Top-level media queries or pseudo-classes in `stylex.create` — nest inside property values with `default`
- Multi-value shorthands (`padding: '1rem 2rem'`) — use longhands
- Empty `turbopack: {}` in Next config — StyleX CSS will not extract
- Bare `next build` without `--webpack` on Vercel — use `bun run build`
- Radix `asChild` on Base UI — use `render` prop
- Edit generated `public/sitemap*.xml` by hand — postbuild regenerates them

### Always

- Style with `stylex.create()` + `stylex.props()` — see `.claude/docs/styling.md`
- Import theme from `@/lib/tokens.stylex`, breakpoints/type scale from `@/lib/constants.stylex`
- Pair `font.*` with matching `leading.*` for text sizes
- Prefer Server Components; add `'use client'` only when needed
- Install UI from shadcn-cssinjs via `scripts/install-shadcn-cssinjs.mjs`

## Tech stack

| Category | Technology |
| -------- | ---------- |
| Framework | Next.js 16 App Router |
| Language | TypeScript strict |
| Styling | StyleX + `@stylexswc` (webpack) |
| UI | shadcn-cssinjs + Base UI |
| Content | MDX + gray-matter |
| Theming | CSS variables + next-themes `.dark` |

## Code style

- `interface` over `type` for objects; no enums — use `as const` maps
- Named exports; camelCase functions/vars; PascalCase components; kebab-case dirs
- Prettier: no semicolons, single quotes, 2-space indent, 100 char width
- Path alias: `@/*` → project root
- Style enforced by ESLint — fix what it reports

```typescript
interface Props {
  title: string
  isActive?: boolean
}
```

## Styling (StyleX)

Full guide: **`.claude/docs/styling.md`**. Official StyleX LLM reference: https://stylexjs.com/docs/llm-resources

```typescript
import * as stylex from '@stylexjs/stylex'
import { font, leading, mq } from '@/lib/constants.stylex'
import { colors } from '@/lib/tokens.stylex'

const styles = stylex.create({
  base: {
    fontSize: font.sm,
    lineHeight: leading.sm,
    padding: { default: '1rem', [mq.md]: '1.5rem' },
    backgroundColor: { ':hover': colors.accent, default: colors.background },
  },
})

<div {...stylex.props(styles.base)} />
```

Variants: `Record<Variant, StyleXStyles>` maps — not `cva()`. Caller overrides: `customClassName()` from `@/lib/utils.stylex`.

## Base UI

Full guide: **`.claude/docs/base-ui-patterns.md`**

```tsx
// Correct
<Tooltip.Trigger render={<Button />} />

// Wrong — Radix pattern
<Tooltip.Trigger asChild><Button /></Tooltip.Trigger>
```

UI primitives in `components/ui/` — see **`components/ui/AGENTS.md`** when editing them.

## Project layout

```
app/           pages, layout, globals.css (CSS variables)
components/ui/ shadcn-cssinjs StyleX components
lib/           tokens.stylex.ts, constants.stylex.ts, content.ts
_content/      MDX (notes/, works/)
```

## Nested docs (read when relevant)

| File | When |
| ---- | ---- |
| `.claude/docs/styling.md` | Any UI/styling work |
| `.claude/docs/base-ui-patterns.md` | Dialogs, menus, tooltips, accordion |
| `.claude/docs/project-architecture.md` | MDX system, layout |
| `.claude/docs/coding-conventions.md` | TS/React conventions |
| `components/ui/AGENTS.md` | Editing `components/ui/*` |
| `.cursor/skills/tailwind-to-stylex/` | Legacy Tailwind → StyleX conversion only |
| `plans/README.md` | Historical plans — pre-StyleX snippets are stale |

## Config

| File | Purpose |
| ---- | ------- |
| `eslint.config.mjs` | ESLint + `@stylexjs/valid-styles` |
| `next.config.ts` | StyleX webpack/turbopack plugin |
| `lib/tokens.stylex.ts` | Themed colors, radius |
| `lib/constants.stylex.ts` | `mq`, `font`, `leading` |
| `components.json` | shadcn-cssinjs registry |
