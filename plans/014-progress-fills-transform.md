# 014 — Animate progress fills with transform, not width

- **Status**: DONE
- **Commit**: ed1069b
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 2 files, small edits

## Problem

Two progress fills animate `width` (layout + paint every frame) and one uses unscoped `transition-all`.

```tsx
/* components/progress-bar.tsx:53-57 — current; fires on EVERY route navigation */
<div
  className="fixed left-0 top-0 z-50 h-[2px] bg-primary transition-all duration-300 ease-out"
  style={{ width: `${progress}%` }}
/>
```

```tsx
/* components/scary-numbers.tsx:706-709 — current; dropzone fill during the /base game */
<div
  className="absolute left-0 top-0 h-full bg-[#80ECFD] transition-[width] duration-300 ease-out"
  style={{ width: `${progress[index]}%` }}
/>
```

## Target

Full-width elements scaled on the compositor. `progress` values are 0–100 numbers.

```tsx
/* components/progress-bar.tsx — target */
<div
  className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-primary transition-transform duration-300 ease-out-strong"
  style={{ transform: `scaleX(${progress / 100})` }}
/>
```

```tsx
/* components/scary-numbers.tsx — target */
<div
  className="absolute left-0 top-0 h-full w-full origin-left bg-[#80ECFD] transition-transform duration-300 ease-out"
  style={{ transform: `scaleX(${progress[index] / 100})` }}
/>
```

Note: `ease-out-strong` is the token added by plan 013 (`cubic-bezier(0.23, 1, 0.32, 1)`). If plan 013 has not run yet, use `ease-[cubic-bezier(0.23,1,0.32,1)]` instead. The scary-numbers fill keeps plain `ease-out` to match its surrounding playground styles.

## Repo conventions to follow

- Dynamic values via `style` prop, static motion via Tailwind classes (exemplar: `components/ui/progress.tsx:23-24` already animates its indicator with `transform: translateX(...)`).

## Steps

1. Edit `components/progress-bar.tsx:53-57` to the target above (add `w-full origin-left`, swap `transition-all` → `transition-transform`, `width` style → `scaleX`).
2. Edit `components/scary-numbers.tsx:706-709` likewise. The `%` label that overlays it (`components/scary-numbers.tsx:711`) must remain unscaled — confirm it is a sibling, not a child, of the fill div (it is, at line 711).

## Boundaries

- Do NOT alter the progress state logic in either file, only the two rendering divs.
- Do NOT touch `components/ui/progress.tsx` (already transform-based; its `transition-all` belongs to plan 019).
- If code at a cited line doesn't match, STOP and report.

## Verification

- **Mechanical**: `bun run build` succeeds; `grep -n "width:" components/progress-bar.tsx` returns nothing.
- **Feel check**: navigate between pages at http://localhost:3020 — the top progress bar sweeps smoothly; in DevTools Performance panel a navigation shows no layout thrash from the bar. On `/base`, drag a number to a dropzone — the cyan fill grows smoothly from the left with no jump at 0% or 100%.
- **Done when**: both fills render correctly at 0, mid, and 100% values and animate via transform only.
