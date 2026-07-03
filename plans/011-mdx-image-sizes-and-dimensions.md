# Plan 011: Serve MDX images at article width with their real aspect ratios

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3206503..HEAD -- components/mdx-components.tsx package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (010 and 012 touch different files; rebase whichever runs second on `package.json`/`bun.lock`)
- **Category**: perf
- **Planned at**: commit `3206503`, 2026-07-03

## Why this matters

Every image in MDX content (14 across `_content/`) renders through one shared `img` component with two defects:

1. **`sizes="100vw"` over-fetches 2–4×.** The article container is `max-w-3xl` (768px), but `sizes="100vw"` tells the browser the image spans the viewport. On a 1440px/2×DPR display the browser picks the 3840w optimizer variant when ~1536w suffices. On image-heavy pages (`/works/designing-0-1-product-through-systems` has 8+ images) this is the dominant payload cost.
2. **Hardcoded `width={1440} height={1024}` mis-declares aspect ratio.** The browser reserves a 1.406:1 box; any image with a different real ratio (e.g. the 16:9 wallpaper in `_content/notes/image-optimization-nextjs.mdx:38`) shifts the layout when it loads (CLS).

All MDX image sources are local files under `public/` (verified: `grep -rn '!\[.*\](http' _content/` → no matches), so at build time a server component can read each file's true dimensions. Pages are SSG, so this costs nothing at request time.

## Current state

- `components/mdx-components.tsx` — the shared MDX component map; the whole file (37 lines):

```tsx
// components/mdx-components.tsx:21-34 (the img entry; OGImage + Accordion entries above it stay untouched)
img: ({ src, alt }: { src?: string; alt?: string }) => (
  <Image
    src={src || ''}
    alt={alt || ''}
    width={1440}
    height={1024}
    sizes="100vw"
    className="rounded-md"
    style={{
      width: '100%',
      height: 'auto',
    }}
  />
),
```

- `components/layout-content.tsx:16` — the consuming article: `<article className="container prose mx-auto max-w-3xl p-4 ...">`. `max-w-3xl` = 48rem = 768px. It renders `<MDXRemote ... components={components}>` (RSC variant from `next-mdx-remote/rsc`), so MDX components may be **async server components**.
- `lib/content.ts:3,172-178` — the repo's convention for build-time memoization: `import { cache } from 'react'` and e.g. `export const getWorkBySlug = cache((slug: string) => getContentBySlug('works', slug))`. Match it.
- `components/content-list.tsx:55` — the repo's existing `sizes` convention for same-width content: `sizes="(max-width: 768px) 100vw, 736px"`.
- Image inventory (for spot-checks): `public/img/App-shell-2.png` is 3542×2490; `public/img/Components-overview.png` is 2880×2048; `public/img/Microsoft_Nostalgic_Windows_Wallpaper_4k.jpg` is 3840×2160 (16:9 — the CLS repro case).
- No test framework exists; verification is typecheck/lint/build plus curling the served HTML.

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|--------------------------------------|---------------------|
| Install   | `bun install`                        | exit 0              |
| Add dep   | `bun add image-size`                 | exit 0              |
| Typecheck | `./node_modules/.bin/tsc --noEmit`   | exit 0              |
| Lint      | `bun lint`                           | exit 0              |
| Build     | `./node_modules/.bin/next build`     | exit 0 — **never `bun run build`** (postbuild regenerates tracked `public/sitemap.xml`) |
| Serve     | `./node_modules/.bin/next start -p 3020` | serves on :3020 |

## Scope

**In scope** (the only files you should modify):
- `components/mdx-components.tsx`
- `package.json` + `bun.lock` (adding `image-size`)

**Out of scope** (do NOT touch, even though they look related):
- `components/content-list.tsx` — its cover images already have correct `sizes` + `priority`.
- `components/layout-content.tsx`, `lib/content.ts`, anything in `_content/` — content and layout are correct; the fix is entirely in the shared `img` component.
- The `OGImage` component and Accordion entries inside `mdx-components.tsx` — leave them exactly as they are.
- Image files in `public/img/` — no recompression in this plan (012 handles the one CSS-background case).

## Git workflow

- Branch: `advisor/011-mdx-image-dimensions`
- Commit style: conventional commits, e.g. `perf: size MDX images to the article and their real dimensions`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add the `image-size` dependency

`bun add image-size` (zero-dependency package; reads dimensions from file headers without decoding).

**Verify**: `grep -n '"image-size"' package.json` → 1 match in `dependencies`.

### Step 2: Rewrite the `img` entry as an async server component with real dimensions

In `components/mdx-components.tsx`, replace the `img` entry. Target shape:

```tsx
import { cache } from 'react'
import fs from 'fs'
import path from 'path'
import { imageSize } from 'image-size'

const FALLBACK = { width: 1440, height: 1024 }

const getImageDimensions = cache((src: string) => {
  if (!src.startsWith('/')) return FALLBACK
  try {
    const buffer = fs.readFileSync(path.join(process.cwd(), 'public', src))
    const { width, height } = imageSize(buffer)
    return width && height ? { width, height } : FALLBACK
  } catch {
    return FALLBACK
  }
})

// in the components map:
img: async ({ src, alt }: { src?: string; alt?: string }) => {
  const { width, height } = getImageDimensions(src || '')
  return (
    <Image
      src={src || ''}
      alt={alt || ''}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, 768px"
      className="rounded-md"
      style={{ width: '100%', height: 'auto' }}
    />
  )
},
```

Notes that are load-bearing:
- The async component is legal here because `MDXRemote` from `next-mdx-remote/rsc` renders in the server component tree.
- `cache(...)` matches the repo convention in `lib/content.ts:172-178` and dedupes reads when the same image appears on several pages within one build.
- The `sizes` value matches the article's `max-w-3xl` (768px) and follows the existing convention at `components/content-list.tsx:55`.
- Keep `fs`/`path` imports as shown — this file must consequently never be imported from a client component (it isn't today; only `components/layout-content.tsx`, a server component, imports it).
- `image-size` v2 exports `imageSize` as a named export taking a `Buffer`. If the installed version instead exposes a default function or a sync-from-path API, adapt the call — the contract is: buffer/path in, `{ width, height }` out.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0; `bun lint` → exit 0.

### Step 3: Build, serve, and verify rendered dimensions

`./node_modules/.bin/next build`, then `./node_modules/.bin/next start -p 3020` in the background.

**Verify** (all against the served HTML):
- `curl -s http://localhost:3020/works/designing-0-1-product-through-systems | grep -o 'width="3542" height="2490"' | head -1` → exactly that string (App-shell-2.png's real size).
- `curl -s http://localhost:3020/notes/image-optimization-nextjs | grep -o 'width="3840" height="2160"' | head -1` → match (the 16:9 wallpaper no longer claims 1.406:1).
- `curl -s http://localhost:3020/works/designing-0-1-product-through-systems | grep -c 'sizes="100vw"'` → `0`.
- Kill the server afterwards (`lsof -ti:3020 | xargs kill`).

## Test plan

No test framework exists; do not add one. Beyond Step 3's checks, if a browser tool is available: open `/notes/image-optimization-nextjs`, network tab → the wallpaper request should be a `/_next/image?...w=1920...` (or smaller) variant, not `w=3840`, on a ~1440px viewport.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `./node_modules/.bin/tsc --noEmit` exits 0
- [ ] `bun lint` exits 0
- [ ] `./node_modules/.bin/next build` exits 0 (all 5 content pages still SSG — build output lists ● for `/works/[slug]` and `/notes/[slug]`)
- [ ] Served HTML checks in Step 3 all pass (real dimensions, no `sizes="100vw"`)
- [ ] `git status` shows changes only to in-scope files
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `components/mdx-components.tsx` no longer matches the "Current state" excerpt (drift).
- Any MDX content file turns out to reference a remote (`http…`) image — the fallback covers it, but it means the "all local" assumption changed; note it in the report.
- The build errors with anything about `fs` being unavailable — that means this component map got imported into a client component somewhere; do NOT work around it with `require` tricks. Report which import chain broke.
- `image-size` fails to parse any of the 12 files in `public/img/` (Step 3's dimension greps would fail).

## Maintenance notes

- Anyone adding MDX content with **remote** images gets the 1440×1024 fallback ratio — fine for layout, but consider extending `getImageDimensions` if remote images become common.
- If the article container ever changes from `max-w-3xl`, the `sizes` attribute here and in `components/content-list.tsx:55` must change with it — they encode the same 768px assumption.
- Deferred deliberately: making the first content image `priority`/eager (the LCP element on detail pages is usually the title text, and MDX components can't cheaply know their position). Revisit if Vercel Speed Insights shows image LCP on work pages.
