---
name: tailwind-to-stylex
description: >-
  Migrate Tailwind CSS to StyleX. Use when converting className strings into
  stylex.create with stylex.props or stylex.attrs, wiring @stylexswc for Next.js 16
  webpack or Turbopack, debugging missing StyleX CSS on Vercel, lockfile vs
  node_modules preview failures, matching Tailwind visual parity (type scale,
  space-y, inline-flex), or converting Base UI / shadcn wrappers. Trigger on
  tailwind-to-stylex, tw-to-stylex, or any request to move Tailwind to StyleX.
compatibility: A JavaScript project. If StyleX is not configured, read references/stylex-rules.md and references/next-and-vercel.md before converting.
---

# Tailwind to StyleX

Convert Tailwind utilities into StyleX. Preserve the rendered output. Do not redesign
during migration. If a style cannot convert exactly, flag it instead of silently changing
the design.

This skill extends [shadcn-labs/skills `tailwind-to-stylex`](https://github.com/shadcn-labs/skills/tree/main/skills/tailwind-to-stylex)
(MIT). That public skill is the class converter. It is not enough for a Next.js 16 +
Vercel ship. This folder keeps that converter and adds bundler, lockfile, preview, visual
parity, and Base UI failures from a real migration.

If both skills are installed, use **this** one. Do not also run
`npx skills add https://github.com/shadcn-labs/skills --skill tailwind-to-stylex`.

## Non-negotiables

1. **Resolve, then reshape.** Expand every class to the CSS the project's Tailwind
   version emits. Then write StyleX. Do not map a utility name from memory.
2. **Conditions need `default`.** `hover:`, `md:`, `dark:`, `::before` all nest inside
   the property. Missing `default` drops the condition. Never write
   `[mq.sm]: { padding: ... }` as a top-level key on a style namespace.
   `@stylexswc` 0.18.4 throws `Invalid pseudo or at-rule`. Nested
   `padding: { default, [mq.sm] }` compiles. `@stylexjs/valid-styles` flags the
   top-level form.
3. **No multi-value shorthands.** `padding: '1rem 2rem'` is invalid. Split into
   `paddingBlock` / `paddingInline`.
4. **Prove CSS extraction on a clean install.** Dirty `node_modules` is not evidence.
5. **Do not silence Next 16 with empty `turbopack: {}`.** Turbopack then succeeds with
   hashed classes and no StyleX CSS.
6. **Pin the bundler the host runs.** Vercel dashboard `next build` is not
   `next build --webpack`.
7. **Match the Tailwind type scale, not just `fontSize`.** `text-xs` is
   `0.75rem / 1rem`. Size alone plus `html { line-height: 1.5 }` grows cards.
8. **Do not invent layout.** `space-y-*` on an inline child is a no-op. A StyleX column
   + gap on that wrapper is a regression.
9. **Pin primitive versions that export the subpaths you import.** Local 1.7.0 and
   lockfile 1.1.0 pass locally and fail on Vercel.

## Workflow

Work one component file at a time. Skip a ship step only when it does not exist in the
target repo.

### Step 0: inventory (whole-app migrations)

- Package manager and lockfile (`bun.lock`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`)
- Next version. Next 16 defaults to Turbopack.
- Where Tailwind lives: `globals.css`, `@tailwind` / `@import "tailwindcss"`, `cn()`, CVA
- Primitive library: Base UI (`render` prop) vs Radix (`asChild`)
- Host build command vs `package.json` `build`

### Step 1: confirm StyleX is set up

Without a compiler plugin, `stylex.props` returns nothing and the migration looks
broken. Check `package.json` and the bundler config.

- Generic setup: [references/stylex-rules.md](references/stylex-rules.md)
- Next 16 webpack vs Turbopack, `@stylex;` sentinel, Vercel: [references/next-and-vercel.md](references/next-and-vercel.md)

On Next 16, branch `next.config` on `process.argv.includes('--webpack')`. The turbopack
entry of `@stylexswc/nextjs-plugin` is a **default export**, not `{ withStylex }`. Do not
gate PostCSS StyleX on `process.env.TURBOPACK` unless that env is set when
`postcss.config` loads. Do not add empty `turbopack: {}`.

Configure it when the user asked for setup. Otherwise say what is missing before converting.

### Step 2: find every Tailwind usage

Locate every `className` and `class`, including `cn(...)`, `clsx(...)`, `twMerge(...)`,
template literals, and ternaries. You need the complete set of classes that can apply,
and under which conditions.

### Step 3: build `stylex.create`

One named entry per distinct element or variant (`base`, `label`, `iconActive`). Resolve
classes to CSS, then reshape:

- CamelCase properties. `border-radius` → `borderRadius`.
- Longhands or single-value shorthands only.
- Numbers are px for lengths. Keep `rem` / `%` / `vh` as strings.
- Conditions live in property values and require `default`. Use `null` when there is no
  base. Nested stacks (`md:hover:`) need an inner `default` too.
- `text-sm` sets **font-size and line-height**. `truncate` sets three properties.
- Modifiers, `space-*`, `group`/`peer`, dark mode, gradients: [references/mapping.md](references/mapping.md)

```
"px-4 py-2 text-sm font-medium hover:bg-blue-600"
        │
        ▼  resolve
padding-inline: 1rem; padding-block: 0.5rem;
font-size: 0.875rem; line-height: 1.25rem; font-weight: 500;
:hover { background-color: #2563eb }
        │
        ▼  reshape
{
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  fontWeight: 500,
  backgroundColor: { default: null, ':hover': '#2563eb' },
}
```

Define `stylex.create` at module top level, not inside render.

### Step 4: apply

- React / Preact / react-strict-dom: `{...stylex.props(styles.base, isActive && styles.active)}`
- Solid / Svelte / Vue / Qwik: `stylex.attrs(...)` (same style objects)
- Apply on host elements (`div`, `button`). Custom components do not accept the spread
  automatically. Pass a `style` token and apply it on the component's host.
- Last argument wins, matching `cn(...)`. Keep caller overrides last.
- Leftover `cn(compiledA, compiledB)` concatenates **strings**. Stylesheet order wins,
  not argument order. A header size that must beat a Button token needs inline `style`.

### Step 5: tokens and constants

Official authoring: https://stylexjs.com/docs/llm-resources

- Themed values (colors, radius that flip with `.dark`): `stylex.defineVars` in a
  `.stylex.ts` file. Named exports only. No other exports in that file.
- Unthemed values that recur (breakpoints, type scale): `stylex.defineConsts` in a
  `.stylex.ts` file. Prefer consts over vars when the value is not themed.
- This repo: `lib/tokens.stylex.ts` (`colors`, `radius`) and
  `lib/constants.stylex.ts` (`mq`, `font`, `leading`).
- Do not extract `stack2` / flex-column utilities. Do not invent a Tailwind clone.
  Class-based `dark:` becomes `createTheme` on an ancestor, or keep CSS variables
  under `.dark` as this site does.

### Step 6: report what did not convert

List `group`/`peer`/`prose`/`divide` restructures, unresolved plugins, and markup
changes. Losing a hover, dark mode, or breakpoint without warning is the failure that
matters.

### Step 7: visual parity (do this before claiming match)

- Tailwind baseline worktree on one port. StyleX on another. Do not edit the baseline.
- Dump `getComputedStyle` for **shared** section boxes. Extra kitchen-sink sections are
  not a full-page-diff failure.
- Check type scale (size **and** line-height), `space-y` vs flex gap, `inline-flex` struts.

Details: [references/visual-parity.md](references/visual-parity.md)

### Step 8: lockfile and the host build

The preview is a clean install of the committed lockfile.

```bash
rm -rf node_modules && <lockfile installer> && <build the host runs>
```

Search the emitted CSS for a hashed class from the rendered HTML. Class names without
rules means extraction failed.

Details: [references/lockfiles-and-ci.md](references/lockfiles-and-ci.md)

### Step 9: primitives

Base UI or shadcn-on-Base-UI: read [references/primitives.md](references/primitives.md)
before converting triggers, drawers, toasts, or `Field.Root`.

### Step 10: verify

Typecheck and lint changed files. If `@stylexjs/eslint-plugin` is present, fix what it
reports. Remove Tailwind directives and config only after the whole codebase is migrated.
Do not treat `tsc` as proof CSS was extracted.

## Worked example

```tsx
// Before
import { cn } from '@/lib/utils'

export function Badge({ active, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600',
        className,
      )}
    >
      Status
    </span>
  )
}
```

```tsx
// After
import * as stylex from '@stylexjs/stylex'

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    paddingInline: '0.625rem',
    paddingBlock: '0.125rem',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    fontWeight: 600,
  },
  active: { backgroundColor: '#dcfce7', color: '#166534' },
  inactive: { backgroundColor: '#f3f4f6', color: '#4b5563' },
})

export function Badge({ active, style }: Props) {
  return (
    <span {...stylex.props(styles.base, active ? styles.active : styles.inactive, style)}>
      Status
    </span>
  )
}
```

`text-xs` keeps both `fontSize` and `lineHeight`. The caller override moved from
`className` to `style`.

## Done when

- Converted files have no Tailwind class strings on migrated elements
- Clean install + production build emits StyleX rules (body class exists in the CSS chunk)
- The host runs the same build command as `package.json`
- Lockfile version of every imported subpath (`./drawer`, `./otp-field`, …) exists
- Shared section boxes match the Tailwind baseline within the project's tolerance

## Install on another machine or project

User-global (every Cursor / agent project on that machine):

```bash
cp -R .cursor/skills/tailwind-to-stylex ~/.cursor/skills/tailwind-to-stylex
cp -R .cursor/skills/tailwind-to-stylex ~/.agents/skills/tailwind-to-stylex
```

Repo-local: keep `.cursor/skills/tailwind-to-stylex` in git, or copy that folder into the
other project's `.cursor/skills/`.

Start a new Agent chat after copying. Invoke with `/tailwind-to-stylex` or ask to migrate
Tailwind to StyleX.

## References

| File | Read when |
| --- | --- |
| [references/mapping.md](references/mapping.md) | modifiers, `space-*`, `group`/`peer`, dark mode, type scale |
| [references/stylex-rules.md](references/stylex-rules.md) | authoring, theming, generic project setup |
| [references/next-and-vercel.md](references/next-and-vercel.md) | Next 16, Turbopack, `@stylex;`, Vercel `buildCommand` |
| [references/lockfiles-and-ci.md](references/lockfiles-and-ci.md) | dirty `node_modules`, export maps, two lockfiles |
| [references/visual-parity.md](references/visual-parity.md) | dual servers, dumps, line-box struts |
| [references/primitives.md](references/primitives.md) | Base UI `render`, toast import, Field.Root |

## Attribution

Class conversion and StyleX validity rules are adapted from Shadcn Labs `tailwind-to-stylex`
(MIT, Copyright 2026 Shadcn Labs). Bundler, Vercel, lockfile, visual-parity, and Base UI
sections are from the rezailmi/portfolio StyleX migration.
