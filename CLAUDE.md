# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint Commands

```bash
# Development
npm run dev          # Start development server (next dev)

# Production
npm run build        # Build for production (next build + sitemap generation)
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint (next lint)
```

**Note:** No test framework is configured. If tests are added, use Vitest or Jest with React Testing Library.

## Tech Stack

| Category    | Technology                         |
| ----------- | ---------------------------------- |
| Framework   | Next.js 16 (App Router)            |
| Language    | TypeScript (strict mode)           |
| UI Library  | Shadcn UI + Base UI                |
| Styling     | Tailwind CSS                       |
| Content     | MDX with gray-matter               |
| Animation   | Framer Motion, tailwindcss-animate |
| Forms       | React Hook Form + Zod              |
| Module Type | ESM (`"type": "module"`)           |

## Project Structure

```
app/              # Next.js App Router pages
  layout.tsx      # Root layout with sidebar, theme provider, breadcrumb
  page.tsx        # Home page
  globals.css     # Global styles with CSS variables
  [feature]/      # Feature routes (about, notes, works, legal)
    page.tsx
    [slug]/       # Dynamic routes for MDX content
      page.tsx

components/       # React components
  ui/             # Shadcn UI components (Base UI primitives)
  mdx-components.tsx  # MDX component mappings
  app-sidebar.tsx     # Main navigation sidebar
  theme-provider.tsx  # Dark mode provider
  breadcrumb.tsx      # Dynamic breadcrumb navigation

lib/              # Utilities and helpers
  content.ts      # MDX content utilities (getWorkBySlug, getAllNotes, etc.)
  utils.ts        # cn() utility for conditional classes

_content/         # MDX content files
  works/          # Portfolio work items
  notes/          # Blog posts/notes

public/           # Static assets
```

## Architecture & Key Patterns

### MDX Content System

The project uses a centralized content management system in `lib/content.ts`:

- **Content Types**: `works` and `notes` - both stored in `_content/` directory as MDX files
- **Frontmatter**: All MDX files require `title`, `description`, `date` fields
- **OG Images**: Automatically extracted from MDX content (first image or OGImage component)
- **Type-Safe API**: Use `getWorkBySlug()`, `getAllNotes()`, etc. for content access

**MDX Component Mapping** (`components/mdx-components.tsx`):
- Custom components available in MDX: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- `OGImage` component for social media previews (hidden from rendered content)
- All images automatically use Next.js `Image` component with optimization

### UI Component Library: Base UI (Not Radix UI)

**IMPORTANT**: This project uses **Base UI** (`@base-ui/react`), not Radix UI. Key differences:

**Base UI Composition Pattern:**
```tsx
// Base UI uses the `render` prop for composition
<Tooltip.Trigger render={<Button />} />
```

**Radix UI Pattern (DO NOT USE):**
```tsx
// Old Radix pattern - DO NOT use
<Tooltip.Trigger asChild><Button /></Tooltip.Trigger>
```

**Components Using Base UI:**
- Dialog, Dropdown Menu (Menu), Popover, Hover Card (Preview Card)
- Accordion, Checkbox, Collapsible, Label, Progress, Radio Group
- Separator, Slider, Switch, Tabs, Toggle, Toggle Group
- Alert Dialog, Scroll Area, Avatar, Tooltip, Sheet

**Retained Radix Slot Pattern:**
Some components intentionally keep `@radix-ui/react-slot` for the `asChild` composition pattern:
- Button, Sidebar, Form, Breadcrumb
- These use Slot for flexible component composition - this is intentional

**Accordion API (Base UI):**
```tsx
// Single mode (default - only one item open at a time)
<Accordion>
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>

// Multiple mode (multiple items can be open)
<Accordion multiple>
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>
```

**Toast Notifications:**
Use **Sonner** library for toasts, not Radix Toast:
```tsx
import { toast } from "sonner"

toast.success("Operation successful")
toast.error("Something went wrong")
```

Add `<Toaster />` from `@/components/ui/sonner` to root layout when needed.

### Layout System

**Root Layout** (`app/layout.tsx`):
- Persistent sidebar navigation with collapsible state (stored in cookies)
- Theme provider with system/light/dark modes
- Breadcrumb navigation generated from route segments
- Theme toggle positioned in fixed position to avoid z-index conflicts
- Scroll area with custom backdrop-blur header effect

**Z-Index Management:**
- Dropdown menus/popovers use `Menu.Positioner` with `className="fixed z-[99999]"`
- This ensures dropdowns appear above complex backdrop-blur effects
- Portal components render at body level for proper stacking

### Styling Architecture

**Tailwind + CSS Variables:**
- Theme colors defined as HSL CSS variables in `app/globals.css`
- Dark mode via `dark:` prefix (class-based strategy)
- Mobile-first responsive design (`sm:`, `md:`, `lg:`)
- Use `cn()` utility from `@/lib/utils` for conditional classes

**Component Variants:**
- Shadcn components use `cva` (class-variance-authority) for variants
- Do not modify Shadcn components directly in `components/ui/` - extend them instead

### TypeScript Conventions

- **Strict mode enabled** - all code must be type-safe
- Prefer `interface` over `type` for object shapes
- Avoid enums; use maps/objects with `as const` instead
- Use functional components with TypeScript interfaces
- Path alias: `@/*` maps to project root

### Naming Conventions

- **Directories**: lowercase with dashes (`components/auth-wizard`)
- **Components**: PascalCase (`AuthWizard.tsx`)
- **Variables**: camelCase with auxiliary verbs (`isLoading`, `hasError`, `canSubmit`)
- **Functions**: camelCase, use `function` keyword for pure functions
- Favor named exports for components

### Performance Principles

- **Minimize `'use client'`** - prefer React Server Components (RSC)
- Wrap client components in `Suspense` with fallback
- Use dynamic imports for non-critical components
- Optimize images: WebP format, explicit dimensions, lazy loading
- Use `nuqs` for URL search parameter state management

### Import Organization

```typescript
// 1. External/framework imports
import type { Metadata } from 'next'
import * as React from 'react'

// 2. Internal imports with @ alias
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Formatting (Prettier)

- No semicolons
- Single quotes
- 2-space indentation
- Trailing commas (ES5)
- 100 character line width
- Tailwind class sorting via prettier-plugin-tailwindcss

## Key Configuration Files

| File                     | Purpose                         |
| ------------------------ | ------------------------------- |
| `tsconfig.json`          | TypeScript config (strict mode) |
| `tailwind.config.ts`     | Tailwind with custom theme      |
| `.eslintrc.json`         | ESLint (next/core-web-vitals)   |
| `.prettierrc`            | Prettier formatting rules       |
| `components.json`        | Shadcn UI configuration         |
| `next-sitemap.config.js` | Sitemap generation              |

## Component Patterns

**Server Components (default - prefer these):**
```typescript
export default async function Page({ params }: Props) {
  const data = await fetchData()
  return <div>{data}</div>
}
```

**Client Components (only when necessary):**
```typescript
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [state, setState] = useState(false)
  // ...
}
```

## Common Pitfalls

1. **Using Radix UI patterns with Base UI components** - Base UI uses `render` prop, not `asChild`
2. **Modifying Shadcn components directly** - Always extend, never modify `components/ui/` files
3. **Z-index issues with dropdowns** - Use `className="fixed z-[99999]"` on `Menu.Positioner`
4. **Accordion props** - Use `multiple` prop, not `type="multiple"` or `collapsible`
5. **Toast notifications** - Use Sonner, not Radix Toast components
