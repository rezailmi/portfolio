# Plan 009: Stop the breadcrumb from scraping document.title

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4b1efd5..HEAD -- components/breadcrumb.tsx components/layout-content.tsx app/layout.tsx`
> `app/layout.tsx` will have changed if plans 001/002 ran — that's expected;
> only STOP if `components/breadcrumb.tsx` no longer matches the excerpt.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: MED
- **Depends on**: none (coordinate with 001/002 if editing `app/layout.tsx` concurrently)
- **Category**: tech-debt
- **Planned at**: commit `4b1efd5`, 2026-07-02

## Why this matters

The breadcrumb derives the current page's display name by reading `document.title` in a client effect, splitting on `|`, and comparing against the hardcoded string `'Reza Ilmi, Designer + Engineer'`. This has three costs: the last crumb flashes a capitalized URL slug (e.g. "Image-optimization-nextjs") before the effect runs; the component silently breaks if the site title in `app/layout.tsx` metadata is ever reworded; and data the server already knows (the page title) is being re-derived by scraping the DOM. The fix: content pages *push* their title into a small client context, and the breadcrumb consumes it.

## Current state

- `components/breadcrumb.tsx` (client component, rendered in both layout variants in `app/layout.tsx`):

```tsx
// components/breadcrumb.tsx:18-26
const [pageTitle, setPageTitle] = useState<string>()
useEffect(() => {
  // Get the page title from the document title
  const title = document.title.split('|')[0].trim()
  if (title && title !== 'Reza Ilmi, Designer + Engineer') {
    setPageTitle(title)
  }
}, [pathname])
// :39-40 — fallback while pageTitle is unset:
const displayText =
  isLast && pageTitle ? pageTitle : segment.charAt(0).toUpperCase() + segment.slice(1)
```

- The only pages with human titles differing from their slug are the MDX detail pages, both rendered through `components/layout-content.tsx` → `ContentLayout({ title, date, content })` — a single choke point that already receives the title as a prop.
- Static segments (`/notes`, `/works`, `/about`) capitalize fine from the slug and need no title injection.
- The breadcrumb renders in `app/layout.tsx` at lines 64 and 121 (inside `StaticHeaderLayout` / `StickyHeaderLayout`).
- Repo exemplar for the context pattern (provider + guarded consumer hook): `hooks/use-progress.tsx`.

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0              |
| Lint      | `bun lint`                         | exit 0              |
| Build     | `./node_modules/.bin/next build`   | succeeds            |
| Dev       | `bun dev` (port 3020)              | manual verification |

## Scope

**In scope**:
- `components/breadcrumb.tsx`
- `components/layout-content.tsx` (add the title-setter component)
- `hooks/use-page-title.tsx` (create — context + provider + setter)
- `app/layout.tsx` (wrap with the provider only)

**Out of scope**:
- Route structure, metadata generation (`generateMetadata` stays the SEO source of truth — this context is display-only)
- Any breadcrumb visual redesign

## Git workflow

- Branch: `advisor/009-breadcrumb-title`
- Commit style: `refactor: thread page title to breadcrumb via context instead of scraping document.title`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the page-title context

Create `hooks/use-page-title.tsx` modeled on `hooks/use-progress.tsx` (same file style: `'use client'`, context + provider + guarded hook):

- `PageTitleProvider` holding `useState<string | null>(null)`, exposing `{ title, setTitle }` (memoized value).
- `usePageTitle()` guarded hook.
- A `PageTitle` component: `function PageTitle({ title }: { title: string })` that calls `setTitle(title)` in a `useEffect` on mount/title change and `setTitle(null)` in the cleanup — so navigating away from a detail page clears the stale title.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 2: Provide + publish

- In `app/layout.tsx`, wrap the existing layout content (inside `ThemeProvider`, around the `featureFlags.insetHeader` conditional) with `<PageTitleProvider>` — it must enclose both layout variants since both render `<Breadcrumb />`.
- In `components/layout-content.tsx` (`ContentLayout`), render `<PageTitle title={title} />` alongside the article. `ContentLayout` is a server component — `PageTitle` is a client component, which is fine to render from it.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 3: Consume in the breadcrumb

In `components/breadcrumb.tsx`, delete the `useState`/`useEffect`/`document.title` block (lines 18–26) and read `const { title: pageTitle } = usePageTitle()` instead. Keep the existing capitalized-slug fallback exactly as-is for pages that never set a title.

**Verify**: `grep -n "document.title" components/breadcrumb.tsx` → no matches; `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 4: Manual verification

`bun dev`:
- Visit a note detail page directly (hard load): breadcrumb shows the MDX `title` (e.g. the note's human title, not the slug).
- Client-navigate Notes → a note → back to Notes: the "Notes" crumb shows "Notes" (stale title cleared), the note crumb shows the title.
- `/about` and `/` unaffected.

**Verify**: all three behaviors confirmed. Known residual limitation (accept + report): on a hard load there can still be one frame of slug fallback before the `PageTitle` effect runs — same as today's behavior, minus the fragile coupling. Eliminating it entirely would require rendering the breadcrumb within the page tree; deliberately out of scope.

## Test plan

No test framework. Step 4's navigation checklist is the test plan.

## Done criteria

- [ ] `grep -rn "document.title" components/` → no matches
- [ ] `grep -rn "Reza Ilmi, Designer + Engineer" components/` → no matches (the hardcoded comparison string is gone; the metadata title in `app/layout.tsx` stays)
- [ ] `./node_modules/.bin/tsc --noEmit`, `bun lint`, `./node_modules/.bin/next build` all exit 0
- [ ] Step-4 checklist reported
- [ ] `plans/README.md` status row updated

## STOP conditions

- `components/breadcrumb.tsx` no longer matches the excerpt.
- Adding the provider to `app/layout.tsx` conflicts with concurrent plan-001/002 edits — rebase, don't duplicate providers.
- The title flashes or persists incorrectly across navigations in a way the mount/cleanup effect doesn't fix — report rather than adding pathname-keyed workarounds.

## Maintenance notes

- Any future page wanting a human breadcrumb label just renders `<PageTitle title="..." />` — document this in the component's JSDoc.
- If the site ever adopts Next's typed route segments with a breadcrumb-from-metadata library, this context becomes removable; it's deliberately tiny.
