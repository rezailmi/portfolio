# 016 — Reduced-motion coverage

- **Status**: DONE
- **Commit**: ed1069b
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: ~8 files, one class per site

## Problem

`prefers-reduced-motion` is handled only in `components/blur-transition.tsx:20` and `components/empty-state.tsx` (`motion-reduce:animate-none`). Everything else moves ungated. Reduced motion means *fewer and gentler* animations, not zero — keep opacity/color feedback, drop movement (zoom, slide, jiggle, width/transform morphs).

Ungated movement sites:

1. Popup enter/exit zoom+slide keyframes: `components/ui/dropdown-menu.tsx:51,79`, `components/ui/popover.tsx:29`, `components/ui/tooltip.tsx:47`, `components/ui/hover-card.tsx:21`, `components/ui/dialog.tsx:41` (+ its overlay), `components/ui/alert-dialog.tsx` popup, `components/ui/sheet.tsx:34`.
2. Infinite jiggle keyframes injected by `components/scary-numbers.tsx:54-64` (`jiggleHorizontal`, `jiggleVertical`, `jiggleHorizontalNeighbor`, `jiggleVerticalNeighbor` — continuous translate+scale while dragging).
3. `components/scary-numbers.tsx:679` grid `transition-transform duration-300` and the dropzone fill transition (line ~707).
4. `components/onboarding-screen.tsx:28` typing reveal — handled by plan 015; skip here if already gated.
5. Sidebar collapse transitions `components/ui/sidebar.tsx:222,233,437,508` and `components/progress-bar.tsx` — **leave these**: they are position/size feedback tied to direct state changes; gating them removes comprehension feedback. Do not touch.

## Target

Two mechanisms:

**A. Tailwind `motion-reduce:` variants** on the popup components. For each popup className listed in (1), append:

```
motion-reduce:animate-none
```

Instant appear/disappear is acceptable for popups — presence itself is the feedback. Example target for `components/ui/tooltip.tsx:47` (same pattern everywhere):

```
'overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 ... motion-reduce:animate-none'
```

(If plan 017 has already converted tooltip/hover-card to transitions, use `motion-reduce:transition-none` there instead.)

**B. A media query inside the injected style string** of `components/scary-numbers.tsx` (append to the template literal that defines the jiggle classes, after line ~68):

```css
@media (prefers-reduced-motion: reduce) {
  .jiggle-horizontal,
  .jiggle-vertical,
  .jiggle-horizontal-neighbor,
  .jiggle-vertical-neighbor {
    animation: none;
  }
}
```

And on the grid transform div (`components/scary-numbers.tsx:679`) and dropzone fill (~707), append `motion-reduce:transition-none`. The staggered `cell-fade-in` entrance (opacity-only) may stay — opacity is comprehension-safe.

## Repo conventions to follow

- Exemplar: `components/blur-transition.tsx:20` — `cn('animate-blur-fade-in motion-reduce:animate-none', className)`.
- UI-kit classNames are single long strings inside `cn(...)` — append the variant at the end of the string, before any `className` merge argument.

## Steps

1. Append `motion-reduce:animate-none` to each popup/overlay animation className in: dropdown-menu (both popups), popover, tooltip, hover-card, dialog (overlay + content), alert-dialog (overlay + content), sheet (overlay + `sheetVariants` base).
2. Add the media query block to the scary-numbers injected style string.
3. Append `motion-reduce:transition-none` to scary-numbers lines ~679 and ~707.
4. `grep -rn "motion-reduce" components/ui/ | wc -l` — expect ≥ 10 sites.

## Boundaries

- Do NOT gate `components/ui/skeleton.tsx` (`animate-pulse` is opacity-only, allowed), `animate-blink` cursors (opacity-only), the sidebar transitions, or the progress bars.
- Do NOT introduce a blanket `* { animation: none }` rule — that nukes feedback.
- If code at a cited line doesn't match, STOP and report.

## Verification

- **Mechanical**: `bun run build` + `bun lint` pass.
- **Feel check**: DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce". Theme-toggle dropdown appears instantly (no zoom/slide) but still appears. On `/base`, drag a number — cells no longer jiggle, but drops still register and fills still update (instantly). Turn emulation off — everything animates as before.
- **Done when**: with reduced motion emulated, no element on `/`, `/base`, `/notes`, `/works`, `/about` visibly translates, scales, or jiggles, while all state feedback remains.
