# Visual parity against a Tailwind baseline

Class conversion can be “correct” and still fail a dump. These are the traps from rezailmi/portfolio vs `main`.

## Dual servers

- Tailwind baseline: a **separate worktree** of `main`. Do not edit it.
- StyleX: the migration branch.
- Different ports. This session used StyleX `3020`, Tailwind `3021`, production walk `3022`.
- Open `http://localhost:<port>`, not `127.0.0.1`, unless `allowedDevOrigins` includes it.

Viewport for dumps: **1280×800** (or the project's design width). Record the viewport in the dump files.

## What to compare

Compare **shared section boxes**, not a full-page image.

A StyleX branch may add kitchen-sink sections (Autocomplete, Drawer, OTP). Those extra blocks after Skeleton / Dropdown Menu are intentional. Deleting them to pass a full-page diff is wrong.

If you keep dump scripts, do not “fix” comparison logic to hide a delta. Fix the StyleX CSS.

## Type scale

Tailwind `text-xs` is `font-size: 0.75rem; line-height: 1rem`.

StyleX that sets only `fontSize: "0.75rem"` inherits `html { line-height: 1.5 }`. A Colors swatch card grew **+28px** and y-drifted. Same class of bug for:

| Utility | Must set line-height |
| --- | --- |
| `text-xs` | `1rem` |
| `text-sm` | `1.25rem` |
| `text-base` | `1.5rem` |
| `text-lg` | `1.75rem` |

Do not invent a whole type-scale module to fix one card. Set `fontSize` + `lineHeight` on the nodes the dump flags.

## space-y on inline children

Tailwind `space-y-2` on an **inline** `Label` does nothing.

Do not put `stack2` / `flex-direction: column` + `gap` on `Field.Root`. The 24px block line box *is* the spacing. `Field.Root` is an unstyled context wrapper. Making it a flex column adds 8px the Tailwind tree never had.

Rule: if the computed Tailwind display is `inline` or the children already stack via block formatting, do not add a flex stack.

## inline-flex line box

`Collapsible.Trigger` (or any full-width trigger) as `inline-flex` lets the root pick up a **24px line-box strut** (~+4px).

If Tailwind was `flex w-full`, StyleX is `display: "flex"` + `width: "100%"`.

## Compiled class concatenation

`customClassName()` / leftover `cn()` concatenates compiled StyleX class strings. **Stylesheet order wins, not props order.**

Header sizes that must beat Button tokens need inline `style={{ fontSize, lineHeight }}`.

## Popup height

```ts
maxHeight: "min(20rem, var(--available-height, 20rem))"
```

Without the fallback, an unset `--available-height` collapses the list to 0.

## Scroll root

Page scroll is often inside `[data-slot="scroll-area-viewport"]` or `.base-ui-disable-scrollbar`, not `document`.

`window.scrollTo` and `screenshot --full` stay at the viewport height (800px). Scroll the inner viewport for below-the-fold dumps.

## Dump workflow (this repo)

Scripts lived under `/tmp/parity` (`dump-sections.mjs`, `dump-base.mjs`, `shot-sections.mjs`). Do not modify `/tmp/parity/dump-base.mjs` comparison logic to pass a diff.

Tolerance used here: **2px** on shared boxes. AA-only deltas (progress `translateX` vs `width`) can stay if the dump says so.

## Production walk

After CSS extraction and lockfile are green, walk the live UI the way a user would: click accordion, collapsible, select, toast, drawer, alert dialog, theme toggle, a content article. One screenshot is not a walk.

## Do not “fix” these to chase a full-page diff

- Extra `/base` sections after the last shared Tailwind section
- Home lettermark / playground animation noise
- Non-visual utilities (CSP, direction, merge-props)
- Form `Field.Error` unproven by synthetic value writes unless that is the task
