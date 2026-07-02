# Plan 008: Four small interaction/correctness fixes (any-key reset, NaN dropzone index, image sizes, context memo)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4b1efd5..HEAD -- components/congratulations-message.tsx components/scary-numbers.tsx app/page.tsx hooks/use-progress.tsx`
> On mismatch with the excerpts below, STOP for the affected fix only; the
> four fixes are independent — deliver the ones whose state matches.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `4b1efd5`, 2026-07-02

## Why this matters

Four small, independent defects in the home-page interactive demo and hero:

1. **Any keypress resets the completed game.** After finishing the "scary numbers" demo, a global keydown listener calls `onReset()` unconditionally — even the app's own Cmd/Ctrl+B sidebar shortcut, a modifier tap, or DevTools keys silently discard the unlocked state. The onboarding screen next to it correctly gates on Enter.
2. **Exact right-edge drop yields NaN progress.** The dropzone hit-test is inclusive (`clientX <= bounds.right`) but the bucket index `Math.floor((clientX - left) / (width/4))` evaluates to 4 at the exact right edge, indexing past the 4-element progress array: `undefined + increase` → `NaN`, which propagates to the total-progress readout and breaks the 100% completion path.
3. **Hero images over-serve pixels.** Both home-page showcase images declare `width={1920}` with no `sizes`, so browsers pick srcset candidates for a 1920px slot that actually renders at ≤712px.
4. **Progress context value re-created every render.** `ProgressProvider` passes a fresh object + fresh callback each render, re-rendering all consumers on every update during pointer-driven progress changes.

## Current state

- `components/congratulations-message.tsx:11-18`:

```tsx
useEffect(() => {
  const handleKeyPress = () => {
    onReset()
  }
  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [onReset])
```

  The Enter-gated exemplar to match: `components/onboarding-screen.tsx:11-20` (checks `event.key === 'Enter'`).

- `components/scary-numbers.tsx` — two identical index computations, mouse at `:369-375` and touch at `:509-515`:

```tsx
const dropzoneWidth = dropzoneBounds.width / 4
const dropzoneIndex = Math.floor((event.clientX - dropzoneBounds.left) / dropzoneWidth)
setProgress((prev) => {
  const newProgress = [...prev]
  const increase = getRandomIncrease()
  newProgress[dropzoneIndex] = Math.min(newProgress[dropzoneIndex] + increase, 100)
  return newProgress
})
```

  (`progress` is `useState([0, 0, 0, 0])` at `:126`; the total is reduced in a `useEffect` at `:132-136` and reported via `onProgressChange`.)

- `app/page.tsx:57-76` — two `next/image` blocks, each `width={1920} height={1080}` with `className="h-auto w-full max-w-[712px] rounded-lg border"` and no `sizes`. Exemplar with `sizes` in this repo: `components/mdx-components.tsx` image uses `sizes="100vw"`.

- `hooks/use-progress.tsx:15-24`:

```tsx
const handleSetProgress = (newProgress: number) => {
  setProgress(Math.max(0, Math.min(100, newProgress)))
}
return (
  <ProgressContext.Provider value={{ progress, setProgress: handleSetProgress }}>
```

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0              |
| Lint      | `bun lint`                         | exit 0              |
| Dev       | `bun dev` (port 3020)              | manual verification |

## Scope

**In scope**:
- `components/congratulations-message.tsx`
- `components/scary-numbers.tsx` (ONLY the two index computations — nothing else in this 724-line file)
- `app/page.tsx` (ONLY the two `sizes` props)
- `hooks/use-progress.tsx`

**Out of scope**:
- Any broader refactor of `scary-numbers.tsx` (a full rework was considered and rejected — do not start one)
- `components/onboarding-screen.tsx` (correct as-is; it is the pattern to copy)
- Extracting a shared `useKeyPress` hook — deliberately skipped; two call sites don't justify it yet

## Git workflow

- Branch: `advisor/008-interaction-fixes`
- One commit per fix (4 commits); style: `fix: gate game reset on Enter/Escape instead of any key`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Gate the reset key

In `components/congratulations-message.tsx`, match the onboarding pattern: accept the event and only call `onReset()` for `event.key === 'Enter' || event.key === 'Escape'`.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0. In `bun dev`: complete-state screen (see step 5 for how to reach it) survives pressing letters and Cmd/Ctrl+B; Enter resets.

### Step 2: Clamp the dropzone index (both pointer paths)

At both `:370` (mouse) and `:510` (touch), clamp: `const dropzoneIndex = Math.min(3, Math.max(0, Math.floor(...)))`. Keep everything else identical.

**Verify**: `grep -n "Math.floor((.*clientX - dropzoneBounds.left)" components/scary-numbers.tsx` shows both sites wrapped in the clamp.

### Step 3: Add `sizes` to the two hero images

On both images in `app/page.tsx`, add `sizes="(max-width: 744px) 100vw, 712px"` (712px display cap + 2rem container padding).

**Verify**: `grep -c 'sizes=' app/page.tsx` → 2.

### Step 4: Memoize the progress context value

In `hooks/use-progress.tsx`: wrap the setter in `useCallback` (empty deps — `setProgress` from useState is stable) and the value in `useMemo` keyed on `progress`.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0; `bun lint` → exit 0 (the exhaustive-deps rule must be satisfied, not suppressed).

### Step 5: Manual verification of the demo

`bun dev` → home page → start the demo (Enter on the onboarding screen). Drag number groups into each of the 4 dropzone bins, including releases at the far-right edge of the rightmost bin. Confirm: the header percentage never shows `NaN`, reaching 100% shows the congratulations screen and the unlocked background, typing random keys does NOT reset it, Enter does.

**Verify**: all behaviors confirmed; report pass/fail per fix.

## Test plan

No test framework. Step 5 is the test plan. The NaN case (fix 2) is probabilistic to hit by hand — code-review the clamp instead of relying on reproducing the edge release, and say so in the report.

## Done criteria

- [ ] All four fixes landed as separate commits
- [ ] `./node_modules/.bin/tsc --noEmit` and `bun lint` exit 0
- [ ] Step-5 checklist reported
- [ ] No changes outside the four in-scope files (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

- Any excerpt in "Current state" no longer matches (apply the remaining fixes, report the drifted one).
- Fix 4 causes the demo's progress readout to stop updating (a consumer was depending on unstable identity — unlikely; report).
- You find yourself editing more than ~5 lines in `scary-numbers.tsx` — that's the rejected refactor starting; stop.

## Maintenance notes

- The full `scary-numbers.tsx` refactor (DOM-as-state, duplicated mouse/touch paths, 724 lines) was audited and deliberately deferred: it works, has no tests, and is high-risk/low-user-value to rework. If it ever needs feature changes, do the pointer-events unification first.
- If a third global-keyboard listener appears, extract the shared `useKeyPress` hook then.
