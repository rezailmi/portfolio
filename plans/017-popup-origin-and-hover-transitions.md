# 017 — Popups scale from trigger; tooltips/hover-cards become interruptible

- **Status**: DONE
- **Commit**: ed1069b
- **Severity**: MEDIUM
- **Category**: Physicality & origin / Interruptibility
- **Estimated scope**: 4 files

## Problem

**A.** All trigger-anchored popups zoom from their own center. Base UI (NOT Radix — this repo uses Base UI) exposes the trigger-anchored origin as the `--transform-origin` CSS custom property on the Popup element; none use it:

- `components/ui/dropdown-menu.tsx:79` (`DropdownMenuContent` Popup) and `:51` (`DropdownMenuSubContent` Popup)
- `components/ui/popover.tsx:29` (`PopoverPrimitive.Popup`)
- `components/ui/hover-card.tsx:21` (`HoverCardPrimitive.Popup`)
- `components/ui/tooltip.tsx:47` (`TooltipPrimitive.Popup`)

Current (dropdown-menu.tsx:79, representative):

```
"min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 ..."
```

**B.** Tooltip and hover-card are rapidly-reversible (hover on/off/on) but animate with keyframes (`animate-in`/`animate-out`), which restart from zero mid-motion instead of retargeting. They must use transitions via Base UI's `data-[starting-style]` / `data-[ending-style]`.

Current (tooltip.tsx:47):

```
'overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
```

## Target

**A.** Append `origin-[var(--transform-origin)]` to each of the five Popup classNames (dropdown ×2, popover, hover-card, tooltip).

**B.** Replace the tooltip Popup animation classes entirely. Target for `components/ui/tooltip.tsx:47`:

```
'overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 ease-out-strong data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 motion-reduce:transition-none'
```

Same pattern for `components/ui/hover-card.tsx:21`, keeping its box classes (`z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none`) and using `duration-200` instead of 150.

`ease-out-strong` is plan 013's token (`cubic-bezier(0.23, 1, 0.32, 1)`); if 013 hasn't run, use `ease-[cubic-bezier(0.23,1,0.32,1)]`.

Dropdown-menu and popover keep their keyframe animate-in/out (click-triggered, not rapidly reversible) — they only gain the origin class (plus `motion-reduce:animate-none` from plan 016).

## Repo conventions to follow

- The accordion panel is the in-repo exemplar of Base UI transition styling: `components/ui/accordion.tsx:49` uses `transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0`.
- Base UI render-prop patterns, never Radix `asChild` (see CLAUDE.md).

## Steps

1. Append `origin-[var(--transform-origin)]` to dropdown-menu.tsx:51 and :79, popover.tsx:29.
2. Rewrite tooltip.tsx:47 className to the target string.
3. Rewrite hover-card.tsx:21 className to the same pattern (`duration-200`).
4. Verify the sidebar still shows tooltips when collapsed (`components/ui/sidebar.tsx:575` renders `Tooltip` with `delayDuration={0}`).

## Boundaries

- Do NOT touch dialog/alert-dialog/sheet (centered or edge-anchored — exempt from trigger-origin).
- Do NOT change positioning props (`sideOffset`, `align`), only classNames.
- If Base UI does not apply `--transform-origin` on some Popup (check computed styles in DevTools), report it rather than hardcoding a side-dependent origin.

## Verification

- **Mechanical**: `bun run build` + `bun lint` pass.
- **Feel check**: open the theme-toggle dropdown — it grows out of the button, not from its own center (DevTools Animations panel at 10% speed makes this obvious). Collapse the sidebar (Cmd+B) and rapidly hover on/off a nav icon — the tooltip fades/scales continuously from wherever it currently is; it never blinks back to invisible and restarts.
- **Done when**: all five popups visibly originate at their trigger and rapid tooltip re-hover never restarts from zero.
