# Plan 004: Validate frontmatter, dedupe MDX parsing with cache(), and make date handling deterministic

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4b1efd5..HEAD -- lib/content.ts components/layout-content.tsx app/notes app/works`
> If in-scope files changed, compare the "Current state" excerpts against the
> live code; on a mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (plan 003 deletes an unrelated function in `lib/content.ts` — if both run, rebase carefully; plan 006 depends on THIS plan)
- **Category**: bug
- **Planned at**: commit `4b1efd5`, 2026-07-02

## Why this matters

The MDX content loader fabricates its type guarantees: `getMDXBySlug` returns `{ ...data, slug, content } as MDXContent`, so a content file missing `title`, `description`, or `date` sails through the compiler and ships a page with an empty `<title>`, missing OG tags, or a literal "Invalid Date" in the UI — with no error anywhere. Three more defects share this root: (1) an unquoted YAML date (`date: 2024-03-20`) is parsed by gray-matter into a JS `Date` object, silently violating the `date: string` contract; (2) date-only strings are parsed as UTC midnight but formatted in local time, so a `2024-03-01` post renders "February 2024" for viewers/builders in negative-UTC-offset timezones; (3) `generateMetadata` in both detail routes swallows all errors with `catch { return {} }`. Separately, every detail-page render parses the same file twice (once for `generateMetadata`, once for the page body) because nothing is memoized. This plan fixes all of it at the parse boundary.

## Current state

- `lib/content.ts` — the content loader. Key excerpts:

```ts
// lib/content.ts:58-66
function parseMDXFile(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    return matter(fileContent)
  } catch (error) {
    console.error(`Error parsing MDX file ${filePath}:`, error)
    throw new Error(`Failed to parse MDX file: ${filePath}`)
  }
}
// lib/content.ts:82-96 — the unchecked cast
function getMDXBySlug(slug: string, options: MDXOptions): MDXContent {
  const filePath = path.join(options.directory, `${slug}.mdx`)
  const { data, content } = parseMDXFile(filePath)
  if (options.addOgImage && !data.ogImage) {
    data.ogImage = data.coverImage || extractFirstImage(content) || options.fallbackOgImage
  }
  return { ...data, slug, content } as MDXContent
}
// lib/content.ts:30 — env-var name differs from app/layout.tsx:23 (NEXT_PUBLIC_SITE_URL)
baseUrl: process.env.SITE_URL || 'https://www.rezailmi.com',
```

- Date formatting is copy-pasted in three places, all with the UTC/local bug:
  - `components/layout-content.tsx:18`, `app/notes/page.tsx:35`, `app/works/page.tsx:36`:

```tsx
{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
```

- Swallowed metadata errors — `app/notes/[slug]/page.tsx:48-50` and `app/works/[slug]/page.tsx:49-51`:

```tsx
  } catch {
    return {}
  }
```

- Detail pages parse twice per render: `getNoteBySlug(slug)` is called in `generateMetadata` (`app/notes/[slug]/page.tsx:19`) and again in the page component (`:56`); same for works.
- Content files live in `_content/notes/*.mdx` and `_content/works/*.mdx` with quoted string dates today (e.g. `date: '2024-03-20'`).
- Conventions: no zod at the boundary (zod is being removed as unused by plan 003) — write a small hand-rolled validator. TypeScript strict; single quotes, no semicolons.

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0              |
| Lint      | `bun lint`                         | exit 0              |
| Build     | `./node_modules/.bin/next build`   | succeeds            |

Do NOT run `bun run build` (postbuild regenerates tracked `public/sitemap*.xml`).

## Scope

**In scope**:
- `lib/content.ts`
- `components/layout-content.tsx`, `app/notes/page.tsx`, `app/works/page.tsx` (swap in the shared date formatter only)
- `app/notes/[slug]/page.tsx`, `app/works/[slug]/page.tsx` (metadata catch blocks only)
- `_content/**` ONLY if step 1 reveals a file that fails validation (fix the frontmatter, report it)

**Out of scope**:
- `next-sitemap.config.js` (keeps its own `SITE_URL` read — changing deploy env config is not this plan's call; just note the naming split in your report)
- Page markup/layout in the listing pages — plan 006 refactors those; touch only the date expression
- Adding zod or any new dependency

## Git workflow

- Branch: `advisor/004-content-pipeline-hardening`
- Commit style: `fix: validate MDX frontmatter and make date handling deterministic`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add validation + date normalization at the parse boundary

In `lib/content.ts`, replace the cast in `getMDXBySlug` with an explicit validator. Target shape:

```ts
function assertFrontmatter(
  data: Record<string, unknown>,
  filePath: string
): asserts data is { title: string; description: string; date: string } {
  const missing = ['title', 'description', 'date'].filter(
    (key) => typeof data[key] !== 'string' || data[key] === ''
  )
  // YAML parses unquoted dates into Date objects — normalize instead of failing
  if (data.date instanceof Date && !isNaN(data.date.getTime())) {
    data.date = data.date.toISOString().slice(0, 10)
    missing.splice(missing.indexOf('date'), Number(missing.includes('date')))
  }
  if (missing.length > 0) {
    throw new Error(`Invalid frontmatter in ${filePath}: missing/invalid ${missing.join(', ')}`)
  }
  if (typeof data.date === 'string' && isNaN(new Date(data.date).getTime())) {
    throw new Error(`Invalid frontmatter in ${filePath}: unparseable date "${data.date}"`)
  }
}
```

Call it in `getMDXBySlug` after `parseMDXFile`, then keep the return statement but drop the `as MDXContent` cast (the spread of validated `data` plus `slug`/`content` should now satisfy `MDXContent`; if TS needs help, build the object explicitly rather than re-adding a blanket cast). Simplify/adjust the sketch as needed — the load-bearing requirements are: throws with the file path on missing/empty title/description/date, normalizes `Date`-object dates to `YYYY-MM-DD` strings, rejects unparseable date strings, and removes the `as MDXContent` cast.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0. Then `./node_modules/.bin/next build` → exit 0 (proves all existing content passes validation; if a content file fails, fix its frontmatter and note it).

### Step 2: Dedupe parsing with React cache()

In `lib/content.ts`, import `cache` from `react` and wrap the exported per-request entry points so `generateMetadata` and the page body share one parse:

```ts
import { cache } from 'react'
// ...
export const getWorkBySlug = cache((slug: string) => getContentBySlug('works', slug))
export const getAllWorks = cache(() => getAllContent('works'))
export const getNoteBySlug = cache((slug: string) => getContentBySlug('notes', slug))
export const getAllNotes = cache(() => getAllContent('notes'))
```

(`getWorkSlugs`/`getNoteSlugs` are cheap directory listings; wrapping them too is fine but optional.)

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 3: Add a shared, timezone-safe date formatter and use it in all three call sites

In `lib/content.ts` (exported alongside the content functions), add:

```ts
export function formatContentDate(date: string): string {
  return new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}
```

Replace the inline `new Date(...).toLocaleDateString(...)` expressions at `components/layout-content.tsx:18`, `app/notes/page.tsx:35`, and `app/works/page.tsx:36` with `formatContentDate(post.date)` / `formatContentDate(work.date)`. Note: input is guaranteed `YYYY-MM-DD` by step 1's normalization. If a date string already contains a `T` (full ISO), pass it through without appending — guard with `date.includes('T') ? date : date + 'T00:00:00Z'`.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0; `grep -rn "toLocaleDateString" app components | grep -v content` → no matches outside `lib/content.ts`.

### Step 4: Stop swallowing metadata errors

In both `app/notes/[slug]/page.tsx` and `app/works/[slug]/page.tsx`, change the `generateMetadata` catch from `catch { return {} }` to log before returning:

```tsx
  } catch (error) {
    console.error(`generateMetadata failed for slug "${slug}":`, error)
    return {}
  }
```

(Returning `{}` remains correct — the page component's own catch produces the 404; metadata just must not fail silently.)

**Verify**: `grep -rn "catch {" app/notes app/works` → no bare catches remain in the two metadata functions.

### Step 5: Prove the validation works

Temporarily create `_content/notes/__validation-test.mdx` with frontmatter missing `date`, run `./node_modules/.bin/next build`, and confirm the build FAILS with the "Invalid frontmatter in …" message naming the file. Then delete the test file and rebuild.

**Verify**: failing build shows the validator's error; after deletion, `./node_modules/.bin/next build` → exit 0.

## Test plan

No test framework in this repo. Step 5 is the executable regression test for the core behavior; record its output in the report.

## Done criteria

- [ ] `grep -n "as MDXContent" lib/content.ts` → no matches
- [ ] `getNoteBySlug`/`getWorkBySlug`/`getAllNotes`/`getAllWorks` wrapped in `cache()`
- [ ] `formatContentDate` exists and is the only date-formatting path for content dates
- [ ] Metadata catch blocks log errors
- [ ] Step-5 negative test demonstrated (build fails on bad frontmatter, passes after)
- [ ] `./node_modules/.bin/tsc --noEmit`, `bun lint`, `./node_modules/.bin/next build` all exit 0
- [ ] `plans/README.md` status row updated

## STOP conditions

- Existing `_content/` files fail validation for a reason other than missing/invalid title/description/date (e.g. the frontmatter model differs from what this plan assumes).
- Removing the `as MDXContent` cast triggers type errors that can't be resolved by constructing the return object explicitly — the `MDXContent` interface may need redesign; report rather than re-casting.
- The build behaves differently between `generateStaticParams`-driven SSG and dev-mode rendering with respect to `cache()` (it should not).

## Maintenance notes

- Future frontmatter fields: extend `assertFrontmatter`, don't re-introduce casts.
- The `SITE_URL` (in `lib/content.ts:30` + `next-sitemap.config.js`) vs `NEXT_PUBLIC_SITE_URL` (`app/layout.tsx:23`) naming split still exists after this plan — deliberately deferred because it touches deployment env config. Consolidate when convenient.
- Plan 006 (DRY notes/works pages) builds on `formatContentDate` and the validated types from this plan.
