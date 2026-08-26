# Project Architecture

## Directory Structure

```
app/              # Next.js App Router pages
  layout.tsx      # Root layout with sidebar, theme provider, breadcrumb
  globals.css     # CSS variables, preflight, MDX/prism tokens
  [feature]/      # Feature routes (about, notes, works, legal)
    [slug]/       # Dynamic routes for MDX content

components/
  ui/             # shadcn-cssinjs components (StyleX + Base UI)
  mdx-components.tsx

lib/
  content.ts           # MDX content utilities
  tokens.stylex.ts     # Themed colors and radius (defineVars)
  constants.stylex.ts  # Breakpoints and type scale (defineConsts)
  utils.stylex.ts      # customClassName helper

_content/         # MDX content files
  works/
  notes/
```

## MDX Content System

Content lives in `_content/` as MDX files. Access via `lib/content.ts`:

- `getWorkBySlug()`, `getAllNotes()`, etc.
- Required frontmatter: `title`, `description`, `date`
- OG images auto-extracted from first image or `OGImage` component

Custom MDX components: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`, `OGImage`

## Layout System

Root layout (`app/layout.tsx`):
- Persistent sidebar with collapsible state (cookie-stored)
- Theme provider (system/light/dark)
- Breadcrumb from route segments
- Scroll area with backdrop-blur header

## Styling

This site uses **StyleX**, not Tailwind. See [Styling with StyleX](styling.md) for patterns.

- Theme colors: HSL CSS variables in `globals.css`, wrapped by `lib/tokens.stylex.ts`
- Dark mode: `.dark` class on `<html>` via next-themes (no `dark:` utility prefix)
- Components: `stylex.create()` + `stylex.props()` with token imports
- UI primitives: [shadcn-cssinjs](https://www.shadcn-cssinjs.com/) registry — extend via variants, prefer not to edit `ui/` directly unless syncing from registry
