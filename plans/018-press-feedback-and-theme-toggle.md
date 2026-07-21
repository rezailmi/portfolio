# 018 — Press feedback on pressables; fix theme-toggle icon swap

- **Status**: DONE
- **Commit**: ed1069b
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 3 files

## Problem

**A.** No pressable element has press feedback — `:active` changes color only:

```tsx
/* components/ui/button.tsx:8 — current base (cva) */
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
```

```tsx
/* components/ui/sidebar.tsx:508 — current (sidebarMenuButtonVariants base, excerpt) */
'... transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ... active:bg-sidebar-accent active:text-sidebar-accent-foreground ...'
```

**B.** Theme-toggle swaps Sun/Moon via `scale-0` (appears from nothing — never `scale(0)`) with unscoped `transition-all`:

```tsx
/* components/theme-toggle.tsx:28-29 — current */
<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
```

## Target

**A.** Press feedback: `scale(0.97)` on `:active`, 160ms ease-out, transform transitioned alongside colors.

`components/ui/button.tsx` base — replace `transition-colors` with:

```
transition-[color,background-color,border-color,transform] duration-[160ms] ease-out active:scale-[0.97]
```

…but the `link` variant must NOT scale (inline text links don't depress). Since `active:scale-[0.97]` in the base would hit `link` too, instead: keep the transition classes in the base, and add `active:scale-[0.97]` individually to the `default`, `destructive`, `outline`, `secondary`, and `ghost` variant strings (NOT `link`, NOT the `icon` size — sizes are orthogonal, icon buttons get it via their variant).

`components/ui/sidebar.tsx:508` (`sidebarMenuButtonVariants` base) and `:710` (`SidebarMenuSubButton`): append `active:scale-[0.98]` and extend the existing `transition-[width,height,padding]` at 508 to `transition-[width,height,padding,transform]` (line 710 currently has no transition — add `transition-transform duration-[160ms] ease-out`).

**B.** Theme-toggle icons — crossfade at 0.95 scale with scoped transition:

```tsx
<Sun className="h-4 w-4 rotate-0 scale-100 opacity-100 transition-[transform,opacity] duration-200 ease-out dark:-rotate-90 dark:scale-95 dark:opacity-0" />
<Moon className="absolute h-4 w-4 rotate-90 scale-95 opacity-0 transition-[transform,opacity] duration-200 ease-out dark:rotate-0 dark:scale-100 dark:opacity-100" />
```

## Repo conventions to follow

- Variants live in `cva()` strings; append classes inside the existing strings (exemplar: `components/ui/button.tsx:10-21`).
- Arbitrary values use brackets: `duration-[160ms]`, `scale-[0.97]`.

## Steps

1. `components/ui/button.tsx`: update base transition string; add `active:scale-[0.97]` to the five non-link variants.
2. `components/ui/sidebar.tsx:508`: extend transition property list; append `active:scale-[0.98]`.
3. `components/ui/sidebar.tsx:710`: add `transition-transform duration-[160ms] ease-out active:scale-[0.98]`.
4. `components/theme-toggle.tsx:28-29`: replace with target JSX above.

## Boundaries

- Do NOT add press feedback to plain `<a>`/`Link` text links elsewhere in the app.
- Do NOT change any hover colors or focus rings.
- If the cva structure differs from the excerpt, STOP and report.

## Verification

- **Mechanical**: `bun run build` + `bun lint` pass.
- **Feel check**: click and HOLD any button (e.g. theme toggle, sidebar nav) — it depresses subtly (~3%); release — it returns. It must feel like a press, not a bounce. Toggle theme — Sun rotates/fades out as Moon rotates/fades in; neither icon ever shrinks to nothing. Sidebar nav items depress on click without their labels reflowing.
- **Done when**: every Button variant except `link` depresses on :active, and the icon swap is a crossfade between scale 0.95 and 1.
