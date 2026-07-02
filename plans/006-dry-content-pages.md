# Plan 006: Deduplicate the notes/works detail and listing pages

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4b1efd5..HEAD -- app/notes app/works lib/content.ts`
> Plans 004/005 are expected to have touched these files — that is fine; the
> structural duplication this plan removes will still be present. If the four
> page files have been merged/refactored already, STOP.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/004-content-pipeline-hardening.md (uses `formatContentDate` and validated types); run after plans/005-react-types-v19.md so refactors typecheck honestly
- **Category**: tech-debt
- **Planned at**: commit `4b1efd5`, 2026-07-02

## Why this matters

`app/notes/[slug]/page.tsx` and `app/works/[slug]/page.tsx` are copy-pastes of each other, as are `app/notes/page.tsx` and `app/works/page.tsx`. They have already drifted: the notes metadata computes its OG image as `post.ogImage || post.coverImage` while works uses only `work.coverImage` (even though `lib/content.ts` populates `ogImage` for both via `addOgImage: true`); works annotates `Promise<Metadata>` while notes doesn't. Every SEO or card-layout change currently has to be made twice and reviewed twice. The data layer (`lib/content.ts`) is already generic over `ContentType` (`'works' | 'notes'`) — the route files just never took advantage of it.

## Current state

- Detail pages — `app/notes/[slug]/page.tsx` (63 lines) and `app/works/[slug]/page.tsx` (64 lines). Both: `generateStaticParams` from slugs; `generateMetadata` building identical title/description/openGraph/twitter shapes; a page component that calls `get<X>BySlug` and renders `<ContentLayout title date content />`, with `catch { notFound() }`. The only real differences:
  - notes `app/notes/[slug]/page.tsx:20`: `const ogImage = post.ogImage || post.coverImage`
  - works `app/works/[slug]/page.tsx:29`: `images: work.coverImage ? [...] : undefined`
  - notes `openGraph.type: 'article'` with `publishedTime: post.date` — works has the same; shapes match otherwise.
- Listing pages — `app/notes/page.tsx` and `app/works/page.tsx`: identical card grid (`Card`, `CardHeader`, `CardContent` from `@/components/ui/card`), identical empty state (differing copy: "No notes to show" / "No works to display yet"), identical date `<time>` block; works adds a cover-image block at `app/works/page.tsx:44-54` (`aspect-[1.41/1]`, `priority` on first item).
- `lib/content.ts` already exposes the generic layer: `ContentType = 'works' | 'notes'`, `getContentBySlug(type, slug)`, `getAllContent(type)` (currently module-private — export them or add thin wrappers).
- After plan 004: `formatContentDate(date)` exists in `lib/content.ts`; `getNoteBySlug` etc. are `cache()`-wrapped; the metadata catch blocks log.
- Conventions: server components by default (none of these four files needs `'use client'`); Base UI render-prop rules don't apply here (no Base UI primitives involved); single quotes, no semicolons.

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0              |
| Lint      | `bun lint`                         | exit 0              |
| Build     | `./node_modules/.bin/next build`   | succeeds, same route table |

Do NOT run `bun run build` (postbuild regenerates tracked `public/sitemap*.xml`).

## Scope

**In scope**:
- `app/notes/[slug]/page.tsx`, `app/works/[slug]/page.tsx`
- `app/notes/page.tsx`, `app/works/page.tsx`
- `lib/content-metadata.ts` (create — shared `generateMetadata` builder)
- `components/content-list.tsx` (create — shared listing component)
- `lib/content.ts` (only to export the generic accessors if needed)

**Out of scope**:
- `components/layout-content.tsx` (already shared)
- URL structure — `/notes/[slug]` and `/works/[slug]` remain distinct routes; do NOT merge into one dynamic segment
- Visual changes of any kind — pixel-identical output is a done criterion

## Git workflow

- Branch: `advisor/006-dry-content-pages`
- Commit style: `refactor: share metadata and listing code between notes and works`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Extract the metadata builder

Create `lib/content-metadata.ts` exporting:

```ts
import type { Metadata } from 'next'
import type { MDXContent } from '@/lib/content'

export function buildContentMetadata(item: MDXContent): Metadata {
  const ogImage = item.ogImage || item.coverImage
  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      type: 'article',
      publishedTime: item.date,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: item.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
```

Resolution of the drift: use the notes behavior (`ogImage || coverImage`) for both — `lib/content.ts` populates `ogImage` with a sensible fallback chain already, so works pages can only gain a previously-missing OG image, never lose one.

Then have both detail pages' `generateMetadata` call it inside their existing try/catch (keep the catch + logging from plan 004).

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 2: Extract the listing component

Create `components/content-list.tsx` (server component) with props like `{ items: MDXContent[], title: string, emptyMessage: string, hrefPrefix: '/notes' | '/works', showCoverImages?: boolean }`, containing the card grid currently duplicated in both listing pages — including the works-only cover-image block behind `showCoverImages` (preserve `priority` on the first item and the `aspect-[1.41/1]` classes exactly). Use `formatContentDate` from `lib/content.ts` for the `<time>` text. Rewrite `app/notes/page.tsx` and `app/works/page.tsx` to fetch and delegate (each keeps its own `export const metadata`).

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 3: Build and compare output

`./node_modules/.bin/next build` → route table unchanged from before the refactor (same routes, same static/SSG markers). Then `bun dev` and visually compare `/notes`, `/works`, one note detail, one work detail against production (https://www.rezailmi.com) — layout, dates, cover images identical.

**Verify**: `curl -s localhost:3020/notes/<existing-slug> | grep -o '<title>[^<]*'` shows the note title; view-source of a works detail page contains `og:image` meta.

## Test plan

No test framework. The step-3 build-table comparison plus HTML spot-checks (title + og:image present on both content types) are the gates.

## Done criteria

- [ ] `app/notes/[slug]/page.tsx` and `app/works/[slug]/page.tsx` no longer contain inline openGraph/twitter object literals (both delegate to `buildContentMetadata`)
- [ ] `app/notes/page.tsx` and `app/works/page.tsx` no longer contain `<Card` markup (both delegate to `ContentList`)
- [ ] Works detail pages now emit `og:image` when `ogImage` is derivable (behavior upgrade, note it in the report)
- [ ] `./node_modules/.bin/tsc --noEmit`, `bun lint`, `./node_modules/.bin/next build` all exit 0
- [ ] Route table unchanged
- [ ] `plans/README.md` status row updated

## STOP conditions

- Plan 004 has not landed (no `formatContentDate` in `lib/content.ts`) — this plan's steps assume it; report the ordering problem.
- The four page files have drifted structurally from the "Current state" description (someone refactored already).
- Achieving pixel-identical listing output requires diverging props beyond `showCoverImages` and strings — if a third axis of variation appears, report rather than growing the prop surface.

## Maintenance notes

- New content types (e.g. a future `/talks`) should add a `ContentType`, reuse `buildContentMetadata` + `ContentList`, and copy nothing.
- Reviewers: the works OG-image change is intentional (documented in step 1); everything else must be behavior-preserving.
