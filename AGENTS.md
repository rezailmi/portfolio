# AGENTS.md

Next.js 16 portfolio. StyleX styling, Base UI primitives, MDX content. Read this first.

## Commands

```bash
npm run dev               # next dev -p 3020 --webpack
npm run build             # next build --webpack + sitemap
npm run lint              # ESLint + scripts/check-agent-docs.mjs
npm run start             # production server
```

No test framework. Do not add one unless asked.

Rigorous multi-step work uses `.cursor/skills/poteto-mode/SKILL.md`.

## Boundaries

### Never

- Tailwind utility classes, `cva()`, `cn()`, `clsx`, or `tailwind-merge`
- Top-level media queries or pseudo-classes in `stylex.create`. Nest them inside property values with `default`
- Multi-value shorthands such as `padding: '1rem 2rem'`. Use longhands
- Empty `turbopack: {}` in Next config. StyleX CSS will not extract
- Bare `next build` without `--webpack` on Vercel. Use `bun run build`
- Radix `asChild` on Base UI. Use the `render` prop
- Hand edits to generated `public/sitemap*.xml`

### Always

- Style with `stylex.create()` and `stylex.props()`. How-to: `.claude/docs/styling.md`
- Import theme from `@/lib/tokens.stylex`. Import breakpoints and type scale from `@/lib/constants.stylex`
- Pair `font.*` with matching `leading.*`
- Prefer Server Components. Add `'use client'` only when needed
- Install UI from shadcn-cssinjs via `scripts/install-shadcn-cssinjs.mjs`

`scripts/check-agent-docs.mjs` encodes these file-level rules. Fix what it prints.

## Tech stack

| Category | Technology |
| -------- | ---------- |
| Framework | Next.js 16 App Router |
| Language | TypeScript strict |
| Styling | StyleX + `@stylexswc` on webpack |
| UI | shadcn-cssinjs + Base UI |
| Content | MDX + gray-matter |
| Theming | CSS variables + next-themes `.dark` |

## Code style

- `interface` over `type` for objects. No enums. Use `as const` maps
- Named exports. camelCase functions and vars. PascalCase components. kebab-case dirs
- Prettier: no semicolons, single quotes, 2-space indent, 100 char width
- Path alias `@/*` maps to the project root
- Fix what ESLint reports, including `@stylexjs/valid-styles`

## Read when relevant

| File | When |
| ---- | ---- |
| `.claude/docs/styling.md` | Any UI or styling work |
| `.claude/docs/base-ui-patterns.md` | Dialogs, menus, tooltips, accordion |
| `.claude/docs/project-architecture.md` | MDX system and layout |
| `.claude/docs/coding-conventions.md` | TypeScript and React conventions |
| `components/ui/AGENTS.md` | Editing `components/ui/*` |
| `.cursor/skills/tailwind-to-stylex/` | Legacy Tailwind to StyleX conversion only |
| `plans/README.md` | Historical plans. Pre-StyleX snippets are stale |

## Config

| File | Purpose |
| ---- | ------- |
| `eslint.config.mjs` | ESLint + `@stylexjs/valid-styles` |
| `next.config.ts` | StyleX webpack and turbopack plugin |
| `lib/tokens.stylex.ts` | Themed colors and radius |
| `lib/constants.stylex.ts` | `mq`, `font`, `leading` |
| `components.json` | shadcn-cssinjs registry |
