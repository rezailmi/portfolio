# Code Review: TODOs and Improvement Opportunities

## Summary

Found **2 explicit TODOs**, **15+ code quality issues**, and **10+ architectural improvements** across the portfolio codebase.

---

## 1. Explicit TODOs Found

### TODO #1: Z-Index Hierarchy (High Priority)
- **File:** `app/globals.css:6-22`
- **Issue:** Z-index values are scattered across components without a standard system
- **Action:** Standardize z-index using CSS custom properties (e.g., `--z-dropdown`, `--z-modal`)

### TODO #2: Default OG Image Placeholder
- **File:** `app/notes/[slug]/page.tsx:21-24`
- **Issue:** Placeholder URL `'https://your-default-og-image.jpg'` needs replacement
- **Action:** Add actual default OG image to `/public` and update the reference

---

## 2. Code Quality Issues

### 2.1 Commented-Out Code
- **File:** `app/about/page.tsx:29-32`
- **Issue:** Commented Button component with unused Download icon
- **Action:** Remove or implement the resume button

### 2.2 Hardcoded Social Links
- **File:** `app/about/page.tsx:42-85`
- **Issue:** Placeholder URLs (`https://linkedin.com`, `https://twitter.com`)
- **Action:** Update with actual profile URLs or move to constants/env vars

### 2.3 Inconsistent Environment Variables
- **Files:** `app/layout.tsx:19`, `lib/content.ts:30`
- **Issue:** Uses both `NEXT_PUBLIC_SITE_URL` and `SITE_URL`
- **Action:** Standardize to single variable name

### 2.4 Missing Keyboard Event Filter
- **File:** `components/congratulations-message.tsx:11-14`
- **Issue:** `handleKeyPress` fires on ANY key, not just Enter
- **Action:** Add `if (event.key === 'Enter')` check

### 2.5 Missing Accessibility Label
- **File:** `components/lettermark.tsx:76-89`
- **Issue:** SVG lacks `aria-label` or `role="img"`
- **Action:** Add `aria-label="Logo"` to SVG element

### 2.6 Unused Import
- **File:** `app/page.tsx:4`
- **Issue:** `Image` imported but not used
- **Action:** Remove unused import

### 2.7 Console.error in Production
- **File:** `lib/content.ts:49,63`
- **Issue:** Console.error statements should use proper error tracking
- **Action:** Consider removing or replacing with error monitoring

### 2.8 Hardcoded Z-Index Values
- **Files:** `components/computer-wrapper.tsx`, `components/scary-numbers.tsx`
- **Issue:** Scattered values: `z-[1000]`, `z-[999]`, `z-[9999]`, `z-[100]`
- **Action:** Create centralized z-index constants

### 2.9 Inline Base64 SVG
- **File:** `components/computer-wrapper.tsx:84`
- **Issue:** Long base64-encoded SVG hardcoded inline
- **Action:** Extract to constant or imported asset

### 2.10 Type Assertion Workaround
- **File:** `components/lettermark.tsx:66,70`
- **Issue:** Event listeners cast to `unknown as EventListener`
- **Action:** Improve typing to avoid double cast

---

## 3. Architecture Improvements

### 3.1 Large Component: ScaryNumbers (724 lines)
- **File:** `components/scary-numbers.tsx`
- **Issue:** Single file with drag/drop logic, grid rendering, animations, and state
- **Action:** Extract into:
  - Custom hook: `useDragDropGrid`
  - Cell renderer component
  - Animation utilities

### 3.2 Duplicate Works/Notes List Code
- **Files:** `app/works/page.tsx:25-63`, `app/notes/page.tsx:24-50`
- **Issue:** Nearly identical card layout and date formatting
- **Action:** Create shared `<ContentList>` component

### 3.3 Duplicate Metadata Generation
- **Files:** `app/works/[slug]/page.tsx:17-52`, `app/notes/[slug]/page.tsx:16-53`
- **Issue:** Identical OG image and metadata logic
- **Action:** Extract to `lib/metadata-utils.ts`

### 3.4 Missing Error Boundary
- **Files:** `app/layout.tsx`, dynamic routes
- **Issue:** No error boundary for unexpected failures
- **Action:** Add `<ErrorBoundary>` component wrapping root layout

### 3.5 Missing Homepage Metadata
- **File:** `app/page.tsx`
- **Issue:** No specific metadata export (falls back to root layout)
- **Action:** Add explicit metadata for homepage

### 3.6 Missing Suspense Boundaries
- **File:** `components/layout-content.tsx:12-36`
- **Issue:** MDXRemote not wrapped in Suspense
- **Action:** Add `<Suspense fallback={<ContentSkeleton />}>`

### 3.7 Content System Validation
- **File:** `lib/content.ts`
- **Issue:** Frontmatter schema not validated at build time
- **Action:** Add Zod schema for frontmatter validation

### 3.8 Potentially Unused Dependencies
- **File:** `package.json`
- **Issue:** `recharts` and `cmdk` may be unused
- **Action:** Verify and remove if not needed

### 3.9 Missing Structured Data
- **Issue:** No JSON-LD markup for Person, Article, or BreadcrumbList schemas
- **Action:** Add structured data generation utility for SEO

### 3.10 Breadcrumb Optimization
- **File:** `components/breadcrumb.tsx`
- **Issue:** Marked 'use client' only for pathname detection
- **Action:** Split server/client parts for better RSC usage

---

## Priority Matrix

| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Default OG Image placeholder | High | Low | **P0** |
| Hardcoded social links | High | Low | **P0** |
| Commented-out code | Medium | Low | **P1** |
| Unused import | Low | Low | **P1** |
| Z-index standardization | Medium | Medium | **P2** |
| Error boundary | High | Medium | **P2** |
| Content list deduplication | Medium | Low | **P2** |
| ScaryNumbers refactor | Medium | High | **P3** |
| Structured data | Medium | Medium | **P3** |
| Frontmatter validation | Medium | Medium | **P3** |

---

## Verification

After addressing improvements:
1. Run `npm run lint` to catch any new issues
2. Run `npm run build` to verify no build errors
3. Manually test affected pages in browser
4. Check OG images using social media debuggers
