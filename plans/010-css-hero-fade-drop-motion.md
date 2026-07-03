# Plan 010: Replace the motion-powered hero fade with CSS and remove the `motion` dependency

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 3206503..HEAD -- app/page.tsx components/blur-transition.tsx app/globals.css package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `3206503`, 2026-07-03

## Why this matters

The homepage intro paragraphs — the likely LCP element — are server-rendered with inline `style="filter:blur(8px);opacity:0"` because `BlurTransition` uses the `motion` (framer-motion) library, whose `initial` prop is baked into the SSR HTML. The text stays invisible until the JS bundle downloads, React hydrates, and the animation plays (up to ~0.95s of animation on top of hydration time). On slow connections or with JS disabled, the hero is blank. This component is also the **only** importer of `motion`, which adds a measured **38.7KB gzipped** chunk to the homepage's first-load JS (311KB total; content pages ship 276KB). Replacing the fade with a pure CSS animation makes the text paint with the first render, removes the dependency entirely, and adds `prefers-reduced-motion` support (currently absent).

## Current state

- `components/blur-transition.tsx` — client component wrapping `motion.div`; the whole file:

```tsx
// components/blur-transition.tsx:1-35
'use client'

import { motion, HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

interface BlurTransitionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function BlurTransition({ children, className, delay = 0, duration = 0.7, ...props }: BlurTransitionProps) {
  return (
    <motion.div
      initial={{ filter: 'blur(8px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
```

- `app/page.tsx:24-45` — the only consumer. Five usages, each wrapping one `<p>`, with `delay={0.1}`, `{0.15}`, `{0.2}`, `{0.25}` (the last one at line 43). No `duration` override anywhere, no other props passed.
- `package.json` — `"motion": "^12.29.0"` in `dependencies`. Confirmed sole importer: `grep -rn "from 'motion" app components hooks lib` matches only `components/blur-transition.tsx:3`.
- `app/globals.css` — Tailwind v4 CSS-first config. It already defines an animation token + keyframes pair to model after:
  - line 150: `--animate-fade-in: fade-in 0.5s ease-in forwards;` (inside a `@theme` block)
  - line 176: `@keyframes fade-in { ... }`
- Repo conventions: Tailwind v4 with `@theme` tokens in `globals.css`; components in `components/` as named exports; Prettier with tailwind plugin (`bun run` scripts: none for format — leave formatting as-is, match surrounding style).

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|--------------------------------------|---------------------|
| Install   | `bun install`                        | exit 0              |
| Typecheck | `./node_modules/.bin/tsc --noEmit`   | exit 0, no errors   |
| Lint      | `bun lint`                           | exit 0              |
| Build     | `./node_modules/.bin/next build`     | exit 0 — **never `bun run build`** (its postbuild regenerates the tracked `public/sitemap.xml`) |
| Serve     | `./node_modules/.bin/next start -p 3020` | serves on :3020 |

## Scope

**In scope** (the only files you should modify):
- `components/blur-transition.tsx`
- `app/globals.css`
- `package.json` + `bun.lock` (removing the `motion` dependency)

**Out of scope** (do NOT touch, even though they look related):
- `app/page.tsx` — the component API (children/className/delay) is preserved, so the consumer needs no change. If you find you must edit it, STOP.
- `components/congratulations-message.tsx`, `components/scary-numbers.tsx` — they use their own `animate-fade-in`; unrelated.
- Any other animation or transition in the repo.

## Git workflow

- Branch: `advisor/010-css-hero-fade`
- Commit style: conventional commits, e.g. `perf: replace motion hero fade with CSS animation` (matches `git log`: `perf: exclude DirectEdit from production bundle`).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add the blur-fade keyframes and theme token to globals.css

In `app/globals.css`, add alongside the existing `fade-in` pair (token near line 150 inside the `@theme` block, keyframes near line 176):

```css
/* in the @theme block, next to --animate-fade-in */
--animate-blur-fade-in: blur-fade-in 0.7s ease-out backwards;

/* next to the existing @keyframes fade-in */
@keyframes blur-fade-in {
  from {
    opacity: 0;
    filter: blur(8px);
  }
  to {
    opacity: 1;
    filter: blur(0px);
  }
}
```

`backwards` fill-mode is load-bearing: it keeps the element hidden during its `animation-delay` and requires no pre-hidden inline style — so without CSS the text is simply visible, never blank.

**Verify**: `grep -n "blur-fade-in" app/globals.css` → 2+ matches (token + keyframes).

### Step 2: Rewrite BlurTransition as a server component

Replace the entire contents of `components/blur-transition.tsx` with:

```tsx
import { cn } from '@/lib/utils'

interface BlurTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function BlurTransition({
  children,
  className,
  delay = 0,
  duration = 0.7,
  style,
  ...props
}: BlurTransitionProps) {
  return (
    <div
      className={cn('animate-blur-fade-in motion-reduce:animate-none', className)}
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s`, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
```

No `'use client'` directive — this must be a server component. `motion-reduce:animate-none` honors `prefers-reduced-motion` (with the animation removed, the element is fully visible because hiding only happens inside the keyframes).

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0. `grep -c "use client" components/blur-transition.tsx` → 0.

### Step 3: Remove the motion dependency

Remove the `"motion"` line from `dependencies` in `package.json`, then run `bun install` to update `bun.lock`.

**Verify**:
- `grep -rn "from 'motion\|from \"motion" app components hooks lib` → no matches
- `grep -n '"motion"' package.json` → no matches
- `bun install` → exit 0

### Step 4: Build and verify the rendered HTML

Run `./node_modules/.bin/next build`, then `./node_modules/.bin/next start -p 3020` in the background.

**Verify**:
- `curl -s http://localhost:3020/ | grep -c 'opacity:0'` → `0` (the SSR HTML no longer hides the intro text)
- `curl -s http://localhost:3020/ | grep -c 'animate-blur-fade-in'` → `4`
- Kill the server afterwards (`lsof -ti:3020 | xargs kill`).

## Test plan

No test framework exists in this repo (per `plans/README.md`); do not add one. Verification is the build-output checks in Step 4 plus, if a browser tool is available: load `http://localhost:3020/`, confirm the four intro paragraphs blur-fade in sequentially and are visible immediately on a hard reload with JS disabled (DevTools → Command Menu → "Disable JavaScript").

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `./node_modules/.bin/tsc --noEmit` exits 0
- [ ] `bun lint` exits 0
- [ ] `./node_modules/.bin/next build` exits 0
- [ ] `grep -rn "motion/react" app components hooks lib` → no matches
- [ ] `grep -n '"motion"' package.json` → no matches
- [ ] Served homepage HTML contains no `opacity:0` inline style and four `animate-blur-fade-in` elements (Step 4 curls)
- [ ] `git status` shows changes only to in-scope files (+ `bun.lock`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `grep -rn "from 'motion" app components hooks lib` matches any file other than `components/blur-transition.tsx` before Step 3 (another consumer appeared).
- The `@theme` block or `@keyframes fade-in` can't be found near the cited lines in `app/globals.css` (drift).
- After Step 2, `app/page.tsx` fails to typecheck (its usage should be compatible; if not, the API contract assumption is wrong — report, don't edit `app/page.tsx`).
- `bun install` fails or wants to change unrelated dependencies.

## Maintenance notes

- If a future hero redesign needs interactive/gesture animation, prefer `motion/mini` or CSS view transitions before reintroducing full framer-motion — this plan's whole win is the 38.7KB gz chunk staying out of the homepage.
- Reviewer should scrutinize: the SSR HTML check (no hidden-by-default content) and that `prefers-reduced-motion` shows static, fully visible text.
- Deferred: the h1 tooltip (`app/page.tsx:16-21`) still pulls Base UI floating chunks into the homepage; judged not worth removing (see PERF-04 rejection in `plans/README.md`).
