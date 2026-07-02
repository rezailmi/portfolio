# Plan 001: Restore static generation for all content routes

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4b1efd5..HEAD -- app/layout.tsx components/progress-bar.tsx components/ui/sidebar.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `4b1efd5`, 2026-07-02

## Why this matters

This is a mostly-static portfolio site, and `app/notes/[slug]/page.tsx` and `app/works/[slug]/page.tsx` both define `generateStaticParams` — the author clearly intends static generation. But `next build` currently marks **every** route ƒ (Dynamic): the root layout calls `await cookies()`, which opts the entire route tree out of static rendering. Every visitor request pays full server rendering — including MDX compilation and Prism syntax highlighting — instead of being served static HTML from Vercel's CDN. Fixing this is the single largest performance win available in this repo.

There is a second, currently-masked blocker: `components/progress-bar.tsx` calls `useSearchParams()` and is rendered in the root layout with no `<Suspense>` boundary. Today the `cookies()` call masks it (everything is dynamic anyway), but the moment `cookies()` is removed, `next build` will fail with "useSearchParams() should be wrapped in a suspense boundary". **Both fixes must land in this one plan.**

## Current state

- `app/layout.tsx` — root layout. Reads the sidebar-collapsed cookie server-side:

```tsx
// app/layout.tsx:13
import { cookies } from 'next/headers'
// app/layout.tsx:141-144
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get('sidebar:state')
  const defaultOpen = sidebarState ? sidebarState.value === 'true' : true
```

  `defaultOpen` is passed to two layout variants (`StickyHeaderLayout` at line 161, `StaticHeaderLayout` at line 163), which each forward it to `<SidebarProvider defaultOpen={defaultOpen}>` (lines 52 and 93).

- `components/progress-bar.tsx` — client component, rendered at `app/layout.tsx:152` as `<ProgressBar />` with no Suspense wrapper:

```tsx
// components/progress-bar.tsx:7-8
const pathname = usePathname()
const searchParams = useSearchParams()
```

- `components/ui/sidebar.tsx` — the cookie is *written* client-side already:

```tsx
// components/ui/sidebar.tsx:18
const SIDEBAR_COOKIE_NAME = 'sidebar:state'
// components/ui/sidebar.tsx:83
document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
```

- Baseline `./node_modules/.bin/next build` route table at commit `4b1efd5` (the thing this plan changes):

```
┌ ƒ /            ├ ƒ /about      ├ ƒ /base       ├ ƒ /edit
├ ƒ /legal/privacy  ├ ƒ /notes   ├ ƒ /notes/[slug]
├ ƒ /works       └ ƒ /works/[slug]
├ ○ /opengraph-image  ├ ○ /twitter-image
```

- Conventions: Base UI (not Radix) — compose with the `render` prop, never `asChild` on Base UI primitives (see `CLAUDE.md`). Prettier + single quotes, no semicolons where existing code omits them.

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Install   | `bun install`                      | exit 0              |
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0, no output   |
| Lint      | `bun lint`                         | exit 0              |
| Build     | `./node_modules/.bin/next build`   | route table printed |
| Dev       | `bun dev` (port 3020)              | serves localhost:3020 |

Do NOT run `bun run build` — its `postbuild` hook regenerates `public/sitemap*.xml`, which is tracked in git and out of scope.

## Scope

**In scope** (the only files you should modify):
- `app/layout.tsx`
- `components/sidebar-cookie.ts` (create — small client helper)
- `app/edit/page.tsx` (add `export const dynamic = 'force-dynamic'` only — see amendment note in Step 3)

**Out of scope** (do NOT touch, even though they look related):
- `components/ui/sidebar.tsx` — the shadcn sidebar; its cookie-write behavior is correct as-is.
- `components/progress-bar.tsx` — the fix is wrapping it at the call site, not editing it.
- `app/notes/**`, `app/works/**` — their `generateStaticParams` already work; no change needed.
- `next.config.*`, `vercel.json`.

## Git workflow

- Branch: `advisor/001-restore-static-rendering`
- Commit style: conventional, e.g. `perf: restore static generation by removing cookies() from root layout` (matches `chore: bump made-refine` style in `git log`)
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Wrap ProgressBar in Suspense (must land before or with step 2)

In `app/layout.tsx`, import `Suspense` from `react` and change line 152 from:

```tsx
<ProgressBar />
```

to:

```tsx
<Suspense fallback={null}>
  <ProgressBar />
</Suspense>
```

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 2: Move the sidebar-cookie read to the client

1. Create `components/sidebar-cookie.ts`:

```ts
export const SIDEBAR_COOKIE_NAME = 'sidebar:state'

export function getSidebarDefaultOpen(): boolean {
  if (typeof document === 'undefined') return true
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
  return match ? match.split('=')[1] === 'true' : true
}
```

2. In `app/layout.tsx`:
   - Remove `import { cookies } from 'next/headers'` (line 13).
   - Make `RootLayout` non-async and delete the three cookie lines (142–144).
   - The two layout components (`StaticHeaderLayout`, `StickyHeaderLayout`) currently take a `defaultOpen: boolean` prop. Since `SidebarProvider` is a client component, create a thin client wrapper that computes the default in a `useState` initializer, and have both layouts use it instead of passing `defaultOpen` from the server. Concretely: add a new client component (in the new file or inline in a separate `'use client'` file — `app/layout.tsx` must stay a server component) like:

```tsx
'use client'
import { useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getSidebarDefaultOpen } from '@/components/sidebar-cookie'

export function ClientSidebarProvider({ children }: { children: React.ReactNode }) {
  const [defaultOpen] = useState(getSidebarDefaultOpen)
  return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
}
```

   Replace `<SidebarProvider defaultOpen={defaultOpen}>` in both `StaticHeaderLayout` (line 52) and `StickyHeaderLayout` (line 93) with `<ClientSidebarProvider>`, and drop the `defaultOpen` prop from both components' signatures.

   Known tradeoff (accepted): during SSG prerender `document` is undefined, so the server HTML always renders sidebar-open; a user who previously collapsed the sidebar may see a brief open→collapsed correction on hydration. Add `suppressHydrationWarning` ONLY if React logs a hydration mismatch in the dev console for this element — do not add it preemptively.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0. `grep -n "next/headers" app/layout.tsx` → no matches.

### Step 3: Build and confirm static output

**Amendment (2026-07-02, after first execution attempt)**: with `cookies()` removed, Next attempts to statically prerender `/edit`, which crashes (`useDirectEditState must be used within a DirectEditProvider` — `DirectEditDemo` from made-refine has no provider anywhere in the tree; this was masked at baseline because every route was dynamic). Add exactly one line to `app/edit/page.tsx`:

```tsx
export const dynamic = 'force-dynamic'
```

This preserves `/edit`'s current production behavior (request-time rendered) and unblocks static generation for everything else. `/edit` remaining ƒ in the route table is expected and correct. The possible upstream made-refine provider bug is deliberately NOT fixed here (out of scope; noted for the maintainer).

**Verify**: `./node_modules/.bin/next build` → build succeeds, and the route table now shows `/`, `/about`, `/notes`, `/works`, `/legal/privacy` as `○ (Static)` and `/notes/[slug]`, `/works/[slug]` as `● (SSG)` (prerendered with generateStaticParams). Zero routes may remain ƒ except `/_not-found` if Next keeps it dynamic. If `/notes/[slug]` is still ƒ, a dynamic API is still being hit — STOP and report which one (check build warnings).

### Step 4: Manual smoke test

Run `bun dev`, open http://localhost:3020, and confirm: sidebar toggles and its state survives a reload (cookie still works); navigating Home → Notes → a note shows the progress bar; theme toggle works.

**Verify**: no hydration-mismatch errors in the browser console on `/` and `/notes`.

## Test plan

No test framework exists in this repo (do not add one in this plan). The build-output route table in step 3 is the regression test: record it in your final report.

## Done criteria

- [ ] `./node_modules/.bin/tsc --noEmit` exits 0
- [ ] `bun lint` exits 0
- [ ] `grep -rn "next/headers" app/ components/` returns no matches
- [ ] `./node_modules/.bin/next build` route table shows ○/● for all content routes (no ƒ except possibly `/_not-found`)
- [ ] `git status` shows only in-scope files modified
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The excerpts in "Current state" don't match the live code.
- After step 2 the build still marks content routes ƒ and the cause isn't identifiable from build warnings within one fix attempt. (Likely culprit: another dynamic API somewhere in the layout tree — report the file.)
- The build fails with a `useSearchParams` Suspense error even after step 1.
- Fixing the sidebar flash appears to require modifying `components/ui/sidebar.tsx`.

## Maintenance notes

- Any future use of `cookies()`, `headers()`, or un-Suspended `useSearchParams()` in `app/layout.tsx` (or anything it renders) will silently re-dynamize the whole site. Reviewers should check the build route table on layout PRs.
- Plan 002 (DirectEdit gating) compounds this win; plan 004 adds `cache()` so build-time MDX parsing isn't duplicated.
- Deferred: eliminating the sidebar open→collapsed hydration flash entirely (would need a cookie-reading inline script or CSS approach; not worth it now).
