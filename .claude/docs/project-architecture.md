# Project architecture

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

See [How to style with StyleX](styling.md). Theme tokens wrap CSS variables in `globals.css`. Dark mode is the `.dark` class from next-themes. UI primitives come from [shadcn-cssinjs](https://www.shadcn-cssinjs.com/).
