# Project Architecture

## Directory Structure

```
app/              # Next.js App Router pages
  layout.tsx      # Root layout with sidebar, theme provider, breadcrumb
  globals.css     # Global styles with CSS variables
  [feature]/      # Feature routes (about, notes, works, legal)
    [slug]/       # Dynamic routes for MDX content

components/
  ui/             # Shadcn UI components (Base UI primitives)
  mdx-components.tsx

lib/
  content.ts      # MDX content utilities
  utils.ts        # cn() utility

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

- Theme colors and radius: CSS variables in `globals.css`, exposed as StyleX `colors` / `radius` in `lib/tokens.stylex.ts`
- Dark mode: `.dark` on `<html>` via next-themes
- Unthemed scales: `space`, `shadow`, `zIndex`, `font`, `leading`, `weight`, `tracking`, `mq` in `lib/constants.stylex.ts`
- Page layout: `Box` and `Text`. `stylex.create` for variants, hover, breakpoints, and one-off measures
- UI primitives in `components/ui/` stay on StyleX + Base UI. No `cva`, no `cn()`
