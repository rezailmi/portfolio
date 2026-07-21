# 019 — Scope transition-all; real crossfade for playground screen swaps

- **Status**: DONE
- **Commit**: ed1069b
- **Severity**: LOW
- **Category**: Performance / Purpose
- **Estimated scope**: 5 files

## Problem

**A.** Unscoped `transition-all` (animates unintended properties off-GPU — always a finding):

```tsx
/* components/ui/tabs.tsx:32 — current (TabsTrigger, excerpt) */
"... ring-offset-background transition-all focus-visible:outline-none ... data-[active]:shadow-xs"

/* components/ui/accordion.tsx:31 — current (AccordionTrigger, excerpt) */
"group flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"

/* components/ui/progress.tsx:23 — current (Indicator) */
"h-full w-full flex-1 bg-primary transition-all"

/* components/ui/sidebar.tsx:295 — current (rail, excerpt) */
'... w-4 -translate-x-1/2 transition-all ease-linear after:absolute ... hover:after:bg-sidebar-border ...'
```

**B.** `components/computer-wrapper.tsx:72` wraps children that mount/unmount conditionally in `transition-all duration-500` — a transition can never animate a mount/unmount, so the ScaryNumbers → CongratulationsMessage swap teleports and the class is dead weight:

```tsx
/* components/computer-wrapper.tsx:72-78 — current */
<div className="h-full transition-all duration-500">
  {totalProgress === 100 && showCongrats ? (
    <CongratulationsMessage onReset={handleReset} />
  ) : (
    <ScaryNumbers className="h-full" onProgressChange={setTotalProgress} />
  )}
</div>
```

## Target

**A.** Scope each:

- tabs.tsx:32: `transition-all` → `transition-[color,background-color,box-shadow]`
- accordion.tsx:31: `transition-all` → `transition-colors` (underline is not transitionable; only color actually changes)
- progress.tsx:23: `transition-all` → `transition-transform` (indicator moves via `translateX` inline style)
- sidebar.tsx:295: `transition-all ease-linear` → `transition-colors` (only the `after:bg` hover color changes; the translate is static positioning)

**B.** Replace the wrapper so the swapped screen actually crossfades, keyed by which screen shows:

```tsx
<div
  key={totalProgress === 100 && showCongrats ? 'congrats' : 'game'}
  className="h-full animate-fade-in motion-reduce:animate-none"
>
  {totalProgress === 100 && showCongrats ? (
    <CongratulationsMessage onReset={handleReset} />
  ) : (
    <ScaryNumbers className="h-full" onProgressChange={setTotalProgress} />
  )}
</div>
```

`animate-fade-in` is the token fixed by plan 013 (`fade-in 0.25s cubic-bezier(0.23, 1, 0.32, 1) forwards`). The `key` forces a remount, so the entrance keyframe fires on each swap. `CongratulationsMessage` already runs its own `animate-fade-in` (components/congratulations-message.tsx:23) — that is fine (same curve, harmless double-opacity).

## Repo conventions to follow

- Scoped transitions with bracket syntax: exemplar `components/ui/sidebar.tsx:233` `transition-[left,right,width]`.

## Steps

1. Edit the four `transition-all` sites as specified.
2. Edit `components/computer-wrapper.tsx:72` to the keyed target above.
3. `grep -rn "transition-all" components app` — expect zero remaining (theme-toggle is fixed by plan 018).

## Boundaries

- Do NOT touch `components/ui/sidebar.tsx:222,233,437` (plan 013 owns their easing).
- Do NOT unmount/remount ScaryNumbers on ordinary progress changes — the `key` must only flip between the two string values shown.
- If code at a cited line doesn't match, STOP and report.

## Verification

- **Mechanical**: `bun run build` + `bun lint` pass; the grep in step 3 returns nothing.
- **Feel check**: on `/` playground, finish the game (or temporarily set progress to 100 via dragging) — the congratulations screen fades in instead of popping. Tab triggers on `/base` still show their active shadow instantly-smoothly. Accordion trigger hover unchanged.
- **Done when**: no `transition-all` remains in the repo and the screen swap visibly crossfades.
