# Code Quality Review Report

**Project:** Portfolio Website (Next.js 16)  
**Date:** January 11, 2026  
**Scope:** Full repository audit (app routes, components, hooks, lib, config)

---

## Executive Summary

This Next.js portfolio is well-structured with modern patterns (App Router, RSC, Base UI). The codebase follows TypeScript strict mode, uses Prettier/ESLint, and demonstrates good separation of concerns. However, there are critical issues with dynamic route typing, a broken sitemap config import, and several medium-priority DX/UX improvements needed.

**Overall Grade:** B+ (Good foundation with 5 actionable fixes)

---

## Critical Issues (Fix Immediately)

### 1. Broken Sitemap Build Configuration

**Severity:** High  
**Files:** [`next-sitemap.config.js:1-2`](next-sitemap.config.js)

**Issue:**  
The sitemap config directly imports a TypeScript file, which will fail at build time since `next-sitemap` runs in Node.js without TS transpilation:

```javascript
import { generateSitemapUrls, CONTENT_CONFIG } from './lib/content.ts'
```

**Impact:**  
- `npm run build` will fail during the `postbuild` sitemap generation step
- No sitemap will be generated for SEO

**Fix:**
```javascript
// Option 1: Remove .ts extension (Node ESM will resolve .js from built output)
import { generateSitemapUrls, CONTENT_CONFIG } from './lib/content.js'

// Option 2: Convert to .mjs and use dynamic import
const { generateSitemapUrls, CONTENT_CONFIG } = await import('./lib/content.js')
```

---

### 2. Incorrect Dynamic Route Params Typing

**Severity:** High  
**Files:** [`app/notes/[slug]/page.tsx:5-9`](app/notes/[slug]/page.tsx), [`app/works/[slug]/page.tsx:6-9`](app/works/[slug]/page.tsx)

**Issue:**  
Dynamic route params are typed as `Promise<{ slug: string }>` but Next.js 16 App Router provides them synchronously as plain objects:

```typescript
interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params  // ❌ Unnecessary await
```

**Impact:**  
- Runtime type mismatch (though it may work accidentally)
- Breaks Next.js static optimization assumptions
- Confuses future maintainers

**Fix:**
```typescript
interface Props {
  params: {
    slug: string
  }
}

export default async function NotePage({ params }: Props) {
  const { slug } = params  // ✅ Direct access
```

---

## Medium Priority Issues

### 3. Placeholder OG Image Returns 404

**Severity:** Medium  
**Files:** [`app/notes/[slug]/page.tsx:21-36`](app/notes/[slug]/page.tsx)

**Issue:**  
Notes use a hardcoded placeholder URL for OpenGraph images:

```typescript
// TODO: Replace with your actual default OG image
const defaultOGImage = 'https://your-default-og-image.jpg'
```

**Impact:**  
- Social media cards show broken images when notes lack cover images
- Poor link preview experience on Twitter/LinkedIn/Slack

**Fix:**
```typescript
// Use a real asset from public/
const defaultOGImage = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rezailmi.com'}/img/default-og.jpg`

// Or create a Next.js dynamic OG image route
const defaultOGImage = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`
```

---

### 4. Mobile Hook Causes Layout Shift

**Severity:** Medium  
**Files:** [`hooks/use-mobile.tsx:5-18`](hooks/use-mobile.tsx)

**Issue:**  
`useIsMobile` initializes state as `undefined`, then returns `!!isMobile` which coerces to `false` on first render:

```typescript
const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
// ...
return !!isMobile  // undefined becomes false initially
```

**Impact:**  
- Mobile users see desktop sidebar layout flash before correcting
- Potential hydration mismatch if server/client disagree
- Sidebar flickers on page load

**Fix:**
```typescript
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => {
    // Initialize from matchMedia if available (SSR-safe)
    if (typeof window === 'undefined') return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener("change", onChange)
    setIsMobile(mql.matches)  // Sync immediately
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
```

---

### 5. Progress Bar UX Inconsistency

**Severity:** Low  
**Files:** [`components/progress-bar.tsx:6-40`](components/progress-bar.tsx)

**Issue:**  
Progress bar uses fake timer-based progress and suppresses itself after first visit to each path:

```typescript
const visitedPaths = useRef(new Set<string>())

if (visitedPaths.current.has(currentPath)) {
  return  // Don't show on repeat visits
}

// Fake progress simulation
const timer1 = setTimeout(() => setProgress(60), 400)
```

**Impact:**  
- Progress bar doesn't reflect actual load time
- Users navigating back/forward see no feedback
- Inconsistent perceived performance

**Recommendation:**  
Use Next.js router events or React Suspense boundaries to show real loading state, or always show the bar (remove visited-path tracking) to maintain consistent feedback.

---

## Code Quality Observations

### ✅ Strengths

1. **TypeScript Strict Mode** – `tsconfig.json` has `"strict": true`, catching type errors early
2. **Consistent Formatting** – Prettier config enforces no-semicolons, single-quotes, Tailwind class sorting
3. **Server Components by Default** – Most pages use RSC; client components properly marked with `'use client'`
4. **Error Boundaries** – Hooks like `useProgress` throw on misuse with clear error messages
5. **Content Management** – `lib/content.ts` provides clean, typed API for MDX with frontmatter
6. **Accessibility** – Sidebar mobile sheet includes `sr-only` labels, keyboard shortcuts (Cmd+B)
7. **Performance** – Dynamic imports for heavy components (e.g., `ScaryNumbers`), `next/image` optimization
8. **Responsive Design** – Mobile-first Tailwind with proper breakpoints (`sm:`, `md:`, `lg:`)

### ⚠️ Areas for Improvement

#### Import Path Consistency
Mixed relative (`../components/...`) and alias (`@/components/...`) imports:

```typescript
// app/page.tsx
import ComputerWrapper from '../components/computer-wrapper'  // ❌ Relative
import { BlurTransition } from '@/components/blur-transition'  // ✅ Alias
```

**Recommendation:** Standardize on `@/` alias throughout per `AGENTS.md` guidelines.

#### z-index Management
`globals.css` has a TODO noting z-index conflicts:

```css
/*
 * TODO: Review z-index hierarchy across all components
 * - z-[99999]: Dropdown menus, Popovers, Tooltips
 * - z-50: Various popup content (legacy)
 */
```

**Recommendation:** Define CSS custom properties for z-index scale:
```css
:root {
  --z-dropdown: 50;
  --z-modal: 100;
  --z-tooltip: 9999;
  --z-overlay: 9998;
}
```

#### Test Coverage
No test framework configured. `AGENTS.md` recommends Vitest or Jest.

**Recommendation:** Add basic smoke tests for:
- MDX parsing (`lib/content.ts` edge cases)
- Metadata generation (`generateMetadata` functions)
- Critical user flows (navigation, theme toggle)

#### About Page Social Links
LinkedIn/Twitter links point to generic domains instead of actual profiles:

```typescript
// app/about/page.tsx:66-78
<Link href="https://linkedin.com" ...>rezailmi</Link>  // ❌ Dead link
<Link href="https://twitter.com" ...>rezailmi</Link>   // ❌ Dead link
```

**Fix:** Update to real URLs or remove if placeholder.

---

## Configuration Review

### TypeScript (`tsconfig.json`)
✅ **Good:**
- Strict mode enabled
- `@/*` path alias configured
- ES6 target with ESNext modules

⚠️ **Note:** `jsx: "react-jsx"` is unusual for Next.js (typically `"preserve"`), but works with Next's plugin.

### ESLint (`.eslintrc.json`)
✅ **Good:**
- Uses `next/core-web-vitals` and `next/typescript` presets
- Minimal config (follows framework defaults)

### Prettier (`.prettierrc`)
✅ **Good:**
- Matches `AGENTS.md` spec (no semicolons, single quotes, 2-space indent)
- Tailwind plugin for class sorting

### Tailwind (`tailwind.config.ts`)
✅ **Good:**
- HSL-based design tokens
- Dark mode via `class` strategy
- Custom animations for accordion/fade-in

---

## Component Architecture Analysis

### App Router Structure
```
app/
  layout.tsx          # Root with ThemeProvider, Sidebar
  page.tsx            # Home (server component)
  about/page.tsx      # Static content (server component)
  notes/
    page.tsx          # List (server, data from lib/content)
    [slug]/page.tsx   # Dynamic detail (server, generateStaticParams)
  works/              # Same pattern as notes
```

✅ Follows Next.js App Router conventions correctly.

### Component Patterns

**Composition:**  
Uses Base UI `render` prop pattern (not Radix `asChild`):
```tsx
<TooltipTrigger render={<span>Reza Ilmi</span>} />
```

**Client Components:**  
Properly scoped (e.g., `progress-bar.tsx`, `computer-wrapper.tsx`) with clear state management.

**Server Components:**  
Pages fetch data directly (no prop drilling) and pass to client wrappers when needed.

---

## Dependency Audit

### Notable Dependencies
- `@base-ui/react` v1.0.0 – Modern headless UI primitives
- `next-mdx-remote` v5.0.0 – MDX rendering with plugins
- `framer-motion` v12.4.4 – Animations (used in `BlurTransition`)
- `sonner` v1.7.1 – Toast notifications (per `AGENTS.md`, legacy toast deprecated)

### Potential Risks
1. **Base UI v1.0** is recent; watch for API stability
2. **React 19.2** is cutting-edge; ensure full Next.js compatibility
3. **No security audit** – run `npm audit` and review vulnerabilities

---

## Performance Considerations

### ✅ Optimizations in Place
- Dynamic imports for `ScaryNumbers` component
- `next/image` with explicit dimensions
- Server components reduce JS bundle
- Static generation for notes/works via `generateStaticParams`

### 🔄 Opportunities
1. **Suspense Boundaries** – Wrap client components in `<Suspense>` with skeleton fallbacks
2. **Image Formats** – Convert PNG assets to WebP (e.g., `public/img/*.png`)
3. **Font Optimization** – Geist Sans is already optimized via `geist/font/sans`
4. **Bundle Analysis** – Add `@next/bundle-analyzer` to identify large chunks

---

## Accessibility Review

### ✅ Good Practices
- Semantic HTML (`<header>`, `<main>`, `<article>`)
- `aria-label` on icon-only buttons
- `sr-only` class for screen reader text
- Keyboard shortcut (Cmd+B) for sidebar toggle
- Focus management in dropdowns (Base UI handles)

### ⚠️ Improvements
1. **Skip Link** – Add skip-to-content link for keyboard users
2. **Landmark Roles** – Ensure sidebar has `role="navigation"`
3. **Color Contrast** – Verify muted text meets WCAG AA (current: `--muted-foreground: 0 0% 45.1%`)

---

## Security Considerations

1. **External Links** – All use `target="_blank" rel="noopener noreferrer"` ✅
2. **User Input** – No forms except static content (low risk)
3. **Environment Variables** – Uses `process.env.NEXT_PUBLIC_SITE_URL` correctly
4. **Dependencies** – Run `npm audit` to check for CVEs

---

## Action Plan (Priority Order)

### Sprint 1: Critical Fixes
1. ✅ Fix `next-sitemap.config.js` import (change `.ts` to `.js`)
2. ✅ Update dynamic route params typing (remove `Promise` wrapper)
3. ✅ Replace placeholder OG image URL with real asset

### Sprint 2: DX/UX Improvements
4. ✅ Fix `useIsMobile` hydration issue (proper initial state)
5. ✅ Standardize import paths (always use `@/` alias)
6. ✅ Resolve z-index TODO (add CSS custom properties)

### Sprint 3: Enhancement
7. ⚙️ Add test framework (Vitest + React Testing Library)
8. ⚙️ Update About page social links to real URLs
9. ⚙️ Consider removing progress bar visited-path suppression

---

## Conclusion

This is a **high-quality modern Next.js codebase** with strong fundamentals. The critical issues are straightforward to fix and mostly stem from outdated patterns or placeholder code. Once the 5 high/medium priority items are addressed, the project will be production-ready with excellent maintainability.

**Estimated Fix Time:** 2-3 hours for all critical + medium issues.

---

## Appendix: File-by-File Quality Scores

| File | Score | Notes |
|------|-------|-------|
| `app/layout.tsx` | A | Clean RSC pattern, proper cookie handling |
| `app/page.tsx` | A- | Minor: uses relative import for ComputerWrapper |
| `app/notes/[slug]/page.tsx` | B | Needs params type fix, placeholder OG image |
| `app/works/[slug]/page.tsx` | B | Same as notes |
| `components/app-sidebar.tsx` | A | Proper mobile close, pathname detection |
| `components/ui/sidebar.tsx` | A+ | Complex but well-architected, keyboard support |
| `hooks/use-mobile.tsx` | C+ | Hydration issue from undefined initial state |
| `hooks/use-progress.tsx` | A | Good error handling, context pattern |
| `lib/content.ts` | A | Type-safe, DRY, good error handling |
| `next-sitemap.config.js` | F | Broken import will fail build |

**Legend:** A+ (Exemplary) | A (Excellent) | B (Good) | C (Needs Work) | F (Critical Issue)
