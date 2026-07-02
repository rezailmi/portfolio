# Plan 002: Keep the made-refine DirectEdit tool out of the production bundle

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4b1efd5..HEAD -- app/layout.tsx`
> If `app/layout.tsx` changed since this plan was written (plan 001 also touches
> it), locate the `<DirectEdit />` render site in the live file before
> proceeding; if it no longer exists, treat as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (composes with 001; if 001 already landed, line numbers in app/layout.tsx will have shifted — match on content)
- **Category**: perf
- **Planned at**: commit `4b1efd5`, 2026-07-02

## Why this matters

`made-refine`'s `DirectEdit` is a development-time visual editing overlay. Its package entry (`node_modules/made-refine/dist/index.mjs`) is a `"use client"` module of roughly 625 KB that even embeds a full Tailwind stylesheet as a string. It is statically imported and unconditionally rendered in the root layout, so every production visitor on every route downloads it. The author's intent is clearly dev-only: the sibling `made-refine-preload.js` script two lines above IS gated on `NODE_ENV === 'development'`. This plan applies the same gate to the component, removing what is likely the largest avoidable chunk in the production client bundle.

## Current state

- `app/layout.tsx`:

```tsx
// app/layout.tsx:20
import { DirectEdit } from 'made-refine'
// app/layout.tsx:149-151 — the existing dev-gate pattern to copy
{process.env.NODE_ENV === 'development' && (
  <Script src="/made-refine-preload.js" strategy="beforeInteractive" />
)}
// app/layout.tsx:165 — the ungated render
<DirectEdit />
```

- `app/edit/page.tsx` imports `DirectEditDemo` from `made-refine` — that is a deliberate demo route and is OUT of scope.
- `.babelrc` wires `made-refine/babel` under `env.development` only — dev wiring is already correct there.

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0              |
| Lint      | `bun lint`                         | exit 0              |
| Build     | `./node_modules/.bin/next build`   | succeeds            |

Do NOT run `bun run build` (its postbuild regenerates tracked `public/sitemap*.xml`).

## Scope

**In scope**:
- `app/layout.tsx`

**Out of scope**:
- `app/edit/page.tsx` — intentional made-refine demo route; it gets its own route-level chunk and does not affect other pages.
- `.babelrc`, `public/made-refine-preload.js`, `package.json` — made-refine stays a dependency (dev usage and `/edit` need it).

## Git workflow

- Branch: `advisor/002-dev-gate-directedit`
- Commit style: `perf: exclude DirectEdit from production bundle`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Record the baseline bundle size

Run `./node_modules/.bin/next build` and record the "First Load JS shared by all" value from the output (if the route table omits sizes, record the total size of `.next/static/chunks`: `du -sh .next/static/chunks`).

**Verify**: baseline number recorded in your report.

### Step 2: Gate DirectEdit behind a dev-only dynamic import

In `app/layout.tsx`, remove the top-level `import { DirectEdit } from 'made-refine'` and replace the `<DirectEdit />` render with a conditional. To guarantee the module is excluded from the production graph (not merely unrendered), use a dev-gated wrapper file, e.g. create `components/dev-tools.tsx`:

```tsx
'use client'
import dynamic from 'next/dynamic'

const DirectEdit = dynamic(() => import('made-refine').then((m) => m.DirectEdit), {
  ssr: false,
})

export function DevTools() {
  if (process.env.NODE_ENV !== 'development') return null
  return <DirectEdit />
}
```

and render `<DevTools />` where `<DirectEdit />` was. (`process.env.NODE_ENV` is statically replaced at build time, so the dynamic chunk is never requested in production; the `next/dynamic` split keeps it out of the shared layout chunk even in dev.) Add `components/dev-tools.tsx` to the in-scope list of your commit.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0; `grep -n "from 'made-refine'" app/layout.tsx` → no matches.

### Step 3: Confirm the production bundle shrank and dev still works

1. `./node_modules/.bin/next build` → record the same size metric as step 1. Expect a substantial drop (the removed module is ~625 KB pre-minification; expect at least ~100 KB gzipped off the shared/first-load size).
2. `bun dev`, open http://localhost:3020 → the DirectEdit overlay/tooling still appears in development as before.

**Verify**: after-number < before-number, delta reported; dev overlay confirmed working.

## Test plan

No test framework in this repo. The before/after bundle measurement in steps 1/3 is the verification; include both numbers in the final report.

## Done criteria

- [ ] `./node_modules/.bin/tsc --noEmit` exits 0 and `bun lint` exits 0
- [ ] `grep -rn "from 'made-refine'" app/layout.tsx` → no matches
- [ ] Production build measurably smaller than the step-1 baseline (report the delta)
- [ ] DirectEdit still functional in `bun dev`
- [ ] `git status` shows only `app/layout.tsx` + `components/dev-tools.tsx` modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- `<DirectEdit />` is no longer rendered in `app/layout.tsx` (someone already fixed this).
- The build size does not drop after step 2 — the module is being retained some other way; report what `.next/static/chunks` still contains it (search for a distinctive string such as `made-refine`).
- DirectEdit stops working in dev after the change.

## Maintenance notes

- The presence of `.babelrc` (needed for `made-refine/babel` in dev) makes Next use external Babel for production builds too, which slows builds and bypasses some SWC-based optimization. If made-refine ever supports a non-Babel dev integration, removing `.babelrc` is a follow-up win. Deferred here.
- If more dev-only tools are added later, render them inside `components/dev-tools.tsx` rather than adding new gates in the layout.
