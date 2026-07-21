# 013 — Motion tokens, easing fixes, dead-CSS removal

- **Status**: DONE
- **Commit**: ed1069b
- **Severity**: HIGH
- **Category**: Easing & duration / Cohesion & tokens
- **Estimated scope**: 4 files, small edits

## Problem

1. `app/globals.css:150` — the shared fade token uses `ease-in` (starts slow, delaying the moment the user watches) and exceeds the 300ms UI budget:

```css
/* app/globals.css:150 — current */
--animate-fade-in: fade-in 0.5s ease-in forwards;
```

2. `components/scary-numbers.tsx:66-68` — an injected global `<style>` block defines a class named `.animate-fade-in` that **collides** with the Tailwind utility generated from the token above (different duration and easing; which wins depends on stylesheet order):

```css
/* components/scary-numbers.tsx:66-68 — current (inside the injected style string) */
.animate-fade-in {
  animation: fadeIn 0.7s ease-out forwards;
}
```

3. `components/ui/sheet.tsx:34` — the drawer enters/exits with `ease-in-out`; enter/exit should use a drawer curve:

```
/* components/ui/sheet.tsx:34 — current */
'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[open]:animate-in data-[closed]:animate-out data-[closed]:duration-300 data-[open]:duration-500'
```

4. `components/ui/sidebar.tsx:222,233,437` — sidebar collapse transitions use `ease-linear`; linear is for constant motion (marquee/progress), not UI state changes:

```
/* components/ui/sidebar.tsx:222 — current */
'relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear'
/* components/ui/sidebar.tsx:233 — current */
'... transition-[left,right,width] duration-200 ease-linear ...'
/* components/ui/sidebar.tsx:437 — current */
'... transition-[margin,opa] duration-200 ease-linear ...'
```

(`sidebar.tsx:295` also has `ease-linear` — it is handled together with its `transition-all` fix in plan 019; do not touch line 295 in this plan.)

5. `app/globals.css:147-148` + `154-170` — dead Radix-era accordion animation tokens and keyframes. The actual accordion (`components/ui/accordion.tsx:49`) uses a height *transition* with `data-[starting-style]`, and `--accordion-content-height` is never set anywhere:

```css
/* app/globals.css:147-148 — current (dead) */
--animate-accordion-down: accordion-down 0.2s ease-out;
--animate-accordion-up: accordion-up 0.2s ease-out;
/* app/globals.css:154-170 — current (dead) */
@keyframes accordion-down { from { height: 0; } to { height: var(--accordion-content-height); } }
@keyframes accordion-up { from { height: var(--accordion-content-height); } to { height: 0; } }
```

## Target

Add three easing tokens inside the existing `@theme` block in `app/globals.css` (next to the `--animate-*` tokens, around line 147). Exact values — do not approximate:

```css
--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

(Tailwind v4 generates `ease-out-strong` etc. utilities from `--ease-*` theme keys.)

Then:

1. Fade token becomes: `--animate-fade-in: fade-in 0.25s cubic-bezier(0.23, 1, 0.32, 1) forwards;` (literal curve inside the token, not `var()`).
2. In `components/scary-numbers.tsx`, rename the injected class `.animate-fade-in` → `.cell-fade-in` (keep `fadeIn 0.7s ease-out forwards` — the staggered grid reveal is a licensed playground moment) and update its single usage site, the cell `className` at `components/scary-numbers.tsx:613`, from `animate-fade-in` to `cell-fade-in`.
3. Sheet: replace ` ease-in-out ` with ` ease-drawer ` in the `sheetVariants` base string (`components/ui/sheet.tsx:34`). Keep durations (300/500ms are within drawer budget and asymmetric by design).
4. Sidebar lines 222, 233, 437: replace `ease-linear` with `ease-out-strong`. Keep `duration-200`.
5. Delete globals.css lines 147-148 (`--animate-accordion-*`) and the `@keyframes accordion-down` / `@keyframes accordion-up` blocks entirely.

## Repo conventions to follow

- Animation tokens live in the `@theme` block of `app/globals.css` (see `--animate-blur-fade-in` at line 151 as the exemplar).
- Components use Tailwind utilities, not inline styles, for static motion (see `components/ui/accordion.tsx:49`).

## Steps

1. `app/globals.css`: add the three `--ease-*` tokens to `@theme`; change `--animate-fade-in` value; delete the two accordion tokens and both accordion keyframes blocks.
2. `components/scary-numbers.tsx`: rename `.animate-fade-in` → `.cell-fade-in` in the style string (line ~66) and `animate-fade-in` → `cell-fade-in` in the cell className (line ~613).
3. `components/ui/sheet.tsx:34`: `ease-in-out` → `ease-drawer`.
4. `components/ui/sidebar.tsx:222,233,437`: `ease-linear` → `ease-out-strong`.
5. Grep for remaining consumers of `animate-fade-in` (expect: `components/congratulations-message.tsx:23` and `components/computer-wrapper.tsx` after plan 019) — they keep the utility name and inherit the fixed token; no edit needed.

## Boundaries

- Do NOT touch `--animate-blur-fade-in` or `--animate-blink`.
- Do NOT touch `components/ui/sidebar.tsx:295` (plan 019 owns it).
- Do NOT change any duration other than the fade token's.
- Do NOT add dependencies. If code at a cited line doesn't match, STOP and report.

## Verification

- **Mechanical**: `bun run build` succeeds; `bun lint` shows only the pre-existing `public/made-refine-preload.js` warning; `grep -rn "ease-linear" components/ui/sidebar.tsx` returns only line 295; `grep -n "accordion-down" app/globals.css` returns nothing.
- **Feel check**: on `/base`, complete the game → congratulations screen now fades in quickly (250ms, fast start) instead of a slow 500ms crawl. The scary-numbers grid still staggers in. Sheet (if any page opens one) slides with an iOS-like settle. Sidebar collapse (Cmd+B) no longer moves robotically linearly.
- **Done when**: all greps above pass and the accordion on `/notes`-style MDX pages (see `/base`) still expands/collapses smoothly (its transition is untouched).
