# AGENTS.md - Coding Agent Guidelines

This document provides guidelines for AI coding agents working in this Next.js portfolio repository.

## Build/Lint/Test Commands

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
  layout.tsx      # Root layout
  page.tsx        # Home page
  globals.css     # Global styles with CSS variables
  [feature]/      # Feature routes (about, notes, works, legal)
    page.tsx
    [slug]/       # Dynamic routes
      page.tsx

components/       # React components
  ui/             # Shadcn UI components (do not modify directly)
  *.tsx           # Custom components

hooks/            # Custom React hooks
lib/              # Utilities and helpers
_content/         # MDX content (notes/, works/)
public/           # Static assets
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all code; strict mode is enabled
- Prefer `interface` over `type` for object shapes
- Avoid enums; use maps/objects instead
- Use functional components with TypeScript interfaces
- Path alias: `@/*` maps to project root

```typescript
// Preferred
interface Props {
  title: string
  isActive?: boolean
}

// Avoid enums, use this instead
const Status = {
  Active: 'active',
  Inactive: 'inactive',
} as const
```

### Naming Conventions

- **Directories:** lowercase with dashes (`components/auth-wizard`)
- **Components:** PascalCase (`AuthWizard.tsx`)
- **Variables:** camelCase with auxiliary verbs (`isLoading`, `hasError`, `canSubmit`)
- **Functions:** camelCase, use `function` keyword for pure functions
- Favor named exports for components

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

### Component Patterns

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

### Styling with Tailwind

- Use `cn()` utility from `@/lib/utils` for conditional classes
- Mobile-first responsive design (`sm:`, `md:`, `lg:` prefixes)
- Dark mode via `dark:` prefix (class-based)
- CSS variables use HSL format: `hsl(var(--background))`

```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-classes', isActive && 'active-classes')} />
```

### Shadcn UI Components

- Located in `components/ui/`
- Use `cva` (class-variance-authority) for component variants
- Do not modify Shadcn components directly; extend them instead

```typescript
import { Button } from '@/components/ui/button'

<Button variant="destructive" size="sm">Delete</Button>
```

## React/Next.js Conventions

### Performance

- Minimize `'use client'` directives; favor React Server Components
- Wrap client components in `Suspense` with fallback
- Use dynamic imports for non-critical components
- Optimize images: WebP format, explicit dimensions, lazy loading

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
})
```

### State Management

- Use `nuqs` for URL search parameter state management
- Minimize `useEffect` and `useState`; prefer server-side data fetching
- Context providers for shared client state when necessary

### Error Handling

- Use try/catch for async operations
- Provide meaningful error messages
- Use error boundaries for component-level errors

```typescript
export function useCustomHook() {
  const context = useContext(CustomContext)
  if (!context) {
    throw new Error('useCustomHook must be used within CustomProvider')
  }
  return context
}
```

## MDX Content

Content files are in `_content/` with frontmatter:

```mdx
---
title: 'Article Title'
description: 'Brief description'
date: '2024-01-01'
---

Content here...
```

## Configuration Files

| File                     | Purpose                         |
| ------------------------ | ------------------------------- |
| `tsconfig.json`          | TypeScript config (strict mode) |
| `tailwind.config.ts`     | Tailwind with custom theme      |
| `.eslintrc.json`         | ESLint (next/core-web-vitals)   |
| `.prettierrc`            | Prettier formatting rules       |
| `components.json`        | Shadcn UI configuration         |
| `next-sitemap.config.js` | Sitemap generation              |

## Key Principles

1. Write concise, technical TypeScript code
2. Use functional and declarative programming; avoid classes
3. Prefer iteration and modularization over duplication
4. Structure files: exported component, subcomponents, helpers, static content, types
5. Optimize Web Vitals (LCP, CLS, FID)
6. Follow Next.js docs for Data Fetching, Rendering, and Routing

## Component Library Details

### UI Primitives: Base UI

This project uses **Base UI** as the headless UI primitive library, integrated with Shadcn UI component patterns.

**Base UI vs Radix UI composition patterns:**
- Base UI uses `render` prop: `<Tooltip.Trigger render={<Button />} />`
- Radix used `asChild`: `<Tooltip.Trigger asChild><Button /></Tooltip.Trigger>`

**Components using Base UI:**
Dialog, Dropdown Menu (Menu), Popover, Hover Card (Preview Card), Accordion, Checkbox, Collapsible, Label, Progress, Radio Group, Separator, Slider, Switch, Tabs, Toggle, Toggle Group, Alert Dialog, Scroll Area, Avatar, Tooltip, Sheet

**Retained Radix Slot pattern:**
Some components retain `@radix-ui/react-slot` for the `asChild` composition pattern:
- Button, Sidebar, Form, Breadcrumb - These components use Slot for flexible component composition
- This is intentional and provides essential flexibility for custom component rendering

### Toast Notifications: Sonner

Use the **Sonner** library for toast notifications:

```typescript
import { toast } from "sonner"

// Usage
toast.success("Operation successful")
toast.error("Something went wrong")
toast.info("Info message")
```

The `<Toaster />` component from `@/components/ui/sonner` should be added to your root layout when needed. It's already configured with theme support.

**Note:** The legacy Radix toast components (`components/ui/toast.tsx`, `components/ui/toaster.tsx`) are deprecated. Use Sonner instead.
