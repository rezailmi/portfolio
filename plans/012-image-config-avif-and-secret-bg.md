# Plan 012: Enable AVIF in the image optimizer and route the easter-egg background through it

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3206503..HEAD -- components/background-wrapper.tsx`
> (There is no `next.config.*` at planning time — `ls next.config.* 2>/dev/null`
> must come back empty; if a config file exists now, treat it as a STOP condition
> and merge into it instead of creating a new one, reporting the deviation.)
> If `background-wrapper.tsx` changed since this plan was written, compare the
> "Current state" excerpt against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (if run after 010/011, rebase over their `package.json` changes — this plan adds no dependency)
- **Category**: perf
- **Planned at**: commit `3206503`, 2026-07-03

## Why this matters

The repo has no `next.config` file, so the image optimizer runs on defaults — `formats: ["image/webp"]` (verified in the build's `images-manifest.json`). AVIF is opt-in and typically 20–30% smaller than WebP for the flat UI screenshots that dominate this site's content pages. One config file turns it on for every `next/image` on the site.

Separately, `components/background-wrapper.tsx` reveals a 1.2MB PNG (`public/img/bg-secret.png`, 1440×1024) as a CSS `background-image` when the homepage demo reaches 100% progress. CSS backgrounds bypass the image optimizer entirely, so the one image that ships as a raw file is also one of the largest in `public/`. Rendering it with `next/image` instead sends the optimized AVIF/WebP variant (~10× smaller) — and only when the easter egg actually triggers, same as today.

## Current state

- No `next.config.js` / `next.config.ts` / `next.config.mjs` exists (`ls next.config.*` → no matches). `package.json` has `"type": "module"`. Next.js is `^16.1.4` with Turbopack builds.
- `.next/images-manifest.json` after a default build shows `"formats": ["image/webp"]` — the gap this plan closes.
- `components/background-wrapper.tsx` — the whole file (29 lines); the CSS background at line 21:

```tsx
// components/background-wrapper.tsx:1-28
'use client'

import { useProgress } from '../hooks/use-progress'
import { cn } from '@/lib/utils'

export default function BackgroundWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const { progress } = useProgress()

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          progress === 100
            ? "bg-[url('/img/bg-secret.png')] bg-cover bg-center bg-no-repeat opacity-100"
            : 'opacity-0'
        )}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
```

- Usage: `app/page.tsx:51` — `<BackgroundWrapper className="rounded-lg bg-sidebar py-12">` wrapping the interactive computer demo. The demo area is ~776px wide (`max-w-[776px]` inside), but the wrapper spans the content column.
- `public/img/bg-secret.png` is 1440×1024, 1,195,875 bytes.
- Repo conventions: `next/image` with explicit `sizes` (see `components/content-list.tsx:50-57` for the `fill` + `sizes` pattern to match).

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|--------------------------------------|---------------------|
| Typecheck | `./node_modules/.bin/tsc --noEmit`   | exit 0              |
| Lint      | `bun lint`                           | exit 0              |
| Build     | `./node_modules/.bin/next build`     | exit 0 — **never `bun run build`** (postbuild regenerates tracked `public/sitemap.xml`) |
| Serve     | `./node_modules/.bin/next start -p 3020` | serves on :3020 |

## Scope

**In scope** (the only files you should modify/create):
- `next.config.ts` (create)
- `components/background-wrapper.tsx`

**Out of scope** (do NOT touch, even though they look related):
- `public/img/bg-secret.png` itself — no recompression; the optimizer handles it once it goes through `next/image`.
- `vercel.json`, `.babelrc` — deployment/build config beyond images is not this plan's business. (`.babelrc` exists for made-refine's dev-only plugin; a recorded decision, leave it.)
- `components/computer-wrapper.tsx` texture backgrounds — tiny files (16KB/2KB), fine as CSS backgrounds.
- Any other `next.config` option (headers, redirects, experimental flags). Formats only.

## Git workflow

- Branch: `advisor/012-avif-image-config`
- Commit style: conventional commits, e.g. `perf: enable AVIF and optimize the easter-egg background`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create `next.config.ts`

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
```

**Verify**: `./node_modules/.bin/next build` → exit 0, and `grep -o '"formats":[^]]*]' .next/images-manifest.json` → contains both `image/avif` and `image/webp` (avif first).

### Step 2: Render the easter-egg background with `next/image`

In `components/background-wrapper.tsx`, replace the CSS-background div with a conditionally rendered `Image`. Target shape (behavior preserved: invisible until `progress === 100`, 1s fade, non-interactive):

```tsx
'use client'

import Image from 'next/image'
import { useProgress } from '../hooks/use-progress'
import { cn } from '@/lib/utils'

export default function BackgroundWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const { progress } = useProgress()

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          progress === 100 ? 'opacity-100' : 'opacity-0'
        )}
      >
        {progress === 100 && (
          <Image
            src="/img/bg-secret.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover object-center"
          />
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
```

Load-bearing details:
- Mounting the `Image` only at `progress === 100` preserves today's lazy behavior (the CSS background URL was also only requested when the class applied).
- `alt=""` — decorative.
- The 1s opacity fade now races the image request; the fade covers typical load latency for the ~100KB optimized variant, and the image simply pops in slightly later on very slow connections. Acceptable for an easter egg; note it in the report if a reviewer asks.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0; `bun lint` → exit 0; `grep -c "bg-\[url" components/background-wrapper.tsx` → `0`.

### Step 3: Verify AVIF is actually served

`./node_modules/.bin/next build`, then `./node_modules/.bin/next start -p 3020` in the background.

**Verify**:
- `curl -s -o /dev/null -w "%{content_type}\n" -H "Accept: image/avif,image/webp,*/*" "http://localhost:3020/_next/image?url=%2Fimg%2Fbg-secret.png&w=1080&q=75"` → `image/avif`
- `curl -s -o /dev/null -w "%{size_download}\n" -H "Accept: image/avif,image/webp,*/*" "http://localhost:3020/_next/image?url=%2Fimg%2Fbg-secret.png&w=1080&q=75"` → well under 300000 (vs the 1,195,875-byte original)
- Kill the server afterwards (`lsof -ti:3020 | xargs kill`).

## Test plan

No test framework exists; do not add one. Beyond Step 3, if a browser tool is available: run the homepage demo to 100% (or temporarily hard-code `progress === 100` locally — revert before committing) and confirm the background fades in and covers the section as before, in both light and dark themes.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `./node_modules/.bin/tsc --noEmit` exits 0
- [ ] `bun lint` exits 0
- [ ] `./node_modules/.bin/next build` exits 0 and `images-manifest.json` lists avif+webp
- [ ] Step 3 curl returns `content_type: image/avif` and a payload far below the 1.2MB original
- [ ] `grep -rn "bg-secret" components/` matches only the `next/image` usage (no `bg-[url` form)
- [ ] `git status` shows changes only to in-scope files
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- A `next.config.*` file already exists (drift — merge, don't overwrite, and report).
- The build rejects `next.config.ts` for any reason (e.g. TS config loading issue under this Next/Turbopack version) — try `next.config.mjs` with the identical object once; if that also fails, stop.
- The Step 3 curl returns `image/webp` — AVIF didn't take; do not chase it with experimental flags, report instead.
- `components/background-wrapper.tsx` doesn't match the "Current state" excerpt.

## Maintenance notes

- AVIF encoding is slower than WebP on first request per size variant; Vercel caches variants after the first hit (`minimumCacheTTL` default 14400s), so this only affects cold requests. If image-heavy pages ever feel slow on first-ever load, that's the knob to look at.
- Every `next/image` on the site now serves AVIF to supporting browsers — the win from plans 011 (correct variant sizes) and this one compound.
- If a future redesign makes the easter-egg background load-bearing for the reveal moment, consider preloading it when `progress > 80`.
