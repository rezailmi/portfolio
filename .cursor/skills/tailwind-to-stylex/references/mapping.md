# Tailwind to StyleX mapping

Adapted from [shadcn-labs/skills `tailwind-to-stylex`](https://github.com/shadcn-labs/skills/blob/main/skills/tailwind-to-stylex/references/mapping.md)
(MIT, Copyright 2026 Shadcn Labs). Session notes from rezailmi/portfolio are marked
**Portfolio**.

Resolve the class to CSS first. This file says where a Tailwind variant goes in a StyleX
object and what to do with utilities that have no one-property home.

## Contents

- [Modifiers and conditions](#modifiers-and-conditions)
- [Responsive breakpoints](#responsive-breakpoints)
- [Dark mode](#dark-mode)
- [Combining conditions](#combining-conditions)
- [Type scale](#type-scale)
- [Arbitrary and runtime values](#arbitrary-and-runtime-values)
- [Utilities that need restructuring](#utilities-that-need-restructuring)
- [Pseudo-elements](#pseudo-elements)
- [Animations and keyframes](#animations-and-keyframes)
- [Gradients, shadows, transforms](#gradients-shadows-transforms)
- [Accessibility and other utilities](#accessibility-and-other-utilities)
- [Common utilities (quick table)](#common-utilities-quick-table)

## Modifiers and conditions

Every Tailwind variant becomes a **key inside the property value object**, alongside a
`default`. The value object repeats per property the variant touches.

| Tailwind | StyleX condition key |
| --- | --- |
| `hover:` | `':hover'` |
| `focus:` | `':focus'` |
| `focus-visible:` | `':focus-visible'` |
| `focus-within:` | `':focus-within'` |
| `active:` | `':active'` |
| `visited:` | `':visited'` |
| `disabled:` | `':disabled'` |
| `checked:` | `':checked'` |
| `first:` | `':first-child'` |
| `last:` | `':last-child'` |
| `odd:` | `':nth-child(odd)'` |
| `even:` | `':nth-child(even)'` |
| `empty:` | `':empty'` |
| `aria-*`, such as `aria-expanded:` | `'[aria-expanded="true"]'` |
| `data-*`, such as `data-[state=open]:` | `'[data-state="open"]'` |
| `dark:` | see [Dark mode](#dark-mode) |
| `sm:` `md:` `lg:` `xl:` `2xl:` | `@media`; see [Responsive breakpoints](#responsive-breakpoints) |

```tsx
// hover:bg-blue-600 focus:bg-blue-700
backgroundColor: {
  default: '#3b82f6',
  ':hover': '#2563eb',
  ':focus': '#1d4ed8',
},
```

## Responsive breakpoints

Tailwind is mobile-first. Unprefixed is `default`. Breakpoints are `@media` `min-width`.

| Prefix | Media query key |
| --- | --- |
| `sm:` | `'@media (min-width: 640px)'` |
| `md:` | `'@media (min-width: 768px)'` |
| `lg:` | `'@media (min-width: 1024px)'` |
| `xl:` | `'@media (min-width: 1280px)'` |
| `2xl:` | `'@media (min-width: 1536px)'` |

If the project customized screens (`theme.screens` or CSS `@theme`), use those values.
`max-*` maps to `max-width`.

```tsx
// w-full md:w-1/2 lg:w-1/3
width: {
  default: '100%',
  '@media (min-width: 768px)': '50%',
  '@media (min-width: 1024px)': '33.333333%',
},
```

## Dark mode

Match how the project actually toggles theme:

- `darkMode: 'media'` → `'@media (prefers-color-scheme: dark)'`
- `darkMode: 'class'` / `.dark` on `html`: StyleX cannot target an ancestor class from a
  child. Use `stylex.defineVars` + `stylex.createTheme` on the root. See stylex-rules.md.

**Portfolio:** this site uses class-based dark mode. Do not rewrite `dark:` as
`prefers-color-scheme` unless the dump says the Tailwind tree does that.

## Combining conditions

Stacked variants nest. Each level needs its own `default`. A missing inner default
silently drops the style.

```tsx
// hover:bg-blue-600 md:hover:bg-blue-700
backgroundColor: {
  default: '#3b82f6',
  ':hover': {
    default: '#2563eb',
    '@media (min-width: 768px)': '#1d4ed8',
  },
},
```

## Type scale

**Portfolio:** Tailwind type utilities set **font-size and line-height**. StyleX
`fontSize` alone inherits `html { line-height: 1.5 }` and grows the box. A Colors swatch
card grew +28px and y-drifted when only `fontSize` was set.

| Tailwind | `fontSize` | `lineHeight` |
| --- | --- | --- |
| `text-xs` | `'0.75rem'` | `'1rem'` |
| `text-sm` | `'0.875rem'` | `'1.25rem'` |
| `text-base` | `'1rem'` | `'1.5rem'` |
| `text-lg` | `'1.125rem'` | `'1.75rem'` |
| `text-xl` | `'1.25rem'` | `'1.75rem'` |
| `text-2xl` | `'1.5rem'` | `'2rem'` |
| `text-3xl` | `'1.875rem'` | `'2.25rem'` |
| `text-4xl` | `'2.25rem'` | `'2.5rem'` |

Do not invent a type-scale module to fix one card. Set both properties on the nodes the
dump flags.

## Arbitrary and runtime values

- Static: `top-[117px]` → `top: '117px'`. `bg-[#1da1f2]` → `backgroundColor: '#1da1f2'`.
- Runtime `w-[${size}px]`: StyleX dynamic style function. Arguments are plain identifiers.
  Body is one object literal.

```tsx
const styles = stylex.create({
  bar: (width: number) => ({ width }),
})
<div {...stylex.props(styles.bar(width))} />
```

**Portfolio:** values written by JS at runtime (measured height, `--available-height`)
can also sit on the `style` prop. Popup lists:

```ts
maxHeight: 'min(20rem, var(--available-height, 20rem))'
```

An unset `--available-height` without the fallback collapses the list to 0.

## Utilities that need restructuring

These compile to descendant, sibling, or ancestor-state selectors. StyleX styles one
element. Restructure and tell the user.

| Tailwind | Why it doesn't map | What to do instead |
| --- | --- | --- |
| `space-x-*` / `space-y-*` | sibling margins | `gap` on a flex or grid parent. If the parent is neither, add child margins. |
| `divide-x-*` / `divide-y-*` | border between children | Border on each child after the first, or a separator element. |
| `group` + `group-hover:` | child from ancestor state | Lift `isHovered` into React, or a `defineVars` variable on the parent's `:hover`. |
| `peer` + `peer-*:` | sibling state | React state or a shared CSS variable. |
| `prose` | subtree of tags | Keep the plugin or style tags explicitly. Flag it. |
| `@container` | container queries | `containerType` on the parent; `'@container (min-width: 640px)'` on children. |

**Portfolio — `space-y-*` is often a no-op.** Tailwind `space-y-2` on an **inline**
`Label` does nothing. Do not put `flex-direction: column` + `gap` on `Field.Root`. The
24px block line box is the spacing. `Field.Root` is an unstyled context wrapper. Adding
a flex column added 8px the Tailwind tree never had.

Rule: inspect computed `display` on the Tailwind baseline. If children already stack via
block formatting, do not add a flex stack.

**Portfolio — `flex` vs `inline-flex`.** `flex w-full` stays `display: 'flex'` +
`width: '100%'`. `inline-flex` on a full-width `Collapsible.Trigger` picks up a 24px
line-box strut (~+4px).

## Pseudo-elements

`before:` / `after:` → `'::before'` / `'::after'`. Generated pseudos need `content`.
Tailwind sets `content: ''` implicitly.

```tsx
color: { default: null, '::before': '#ef4444' },
content: { default: null, '::before': '"*"' },
```

## Animations and keyframes

```tsx
const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})
const styles = stylex.create({
  spinner: {
    animationName: spin,
    animationDuration: '1s',
    animationIterationCount: 'infinite',
  },
})
```

Recreate Tailwind's `animate-spin` / `ping` / `pulse` / `bounce` keyframes. Split the
`animation` shorthand into longhands. Do not drop the animation.

## Gradients, shadows, transforms

- `bg-gradient-to-r` + `from-*` + `to-*` → one `backgroundImage: 'linear-gradient(...)'`
- `shadow-md` → the literal `boxShadow` from the project's Tailwind scale
- Compose `scale-95` + `rotate-3` + `-translate-x-2` into one `transform` string
- Keep transitions as `transitionProperty` / `transitionDuration` / `transitionTimingFunction`

**Portfolio:** progress fills via Tailwind `translateX` vs StyleX `width` can be AA-only.
Prefer the Tailwind transform if the dump shows a visual delta.

## Accessibility and other utilities

- `sr-only`: absolute, 1px, clipped, no wrap, zero border. `not-sr-only` reverses it.
- `container`: `width: '100%'` plus `maxWidth` per breakpoint.
- `line-clamp-*`: the `-webkit-box` / `-webkit-line-clamp` block Tailwind emits.

## Common utilities (quick table)

Spacing is `0.25rem` per step (`p-4` = `1rem`). Split two-value padding/margin.

| Tailwind | StyleX |
| --- | --- |
| `p-4` | `padding: '1rem'` (single value is valid) |
| `px-4` | `paddingInline: '1rem'` |
| `py-2` | `paddingBlock: '0.5rem'` |
| `mx-auto` | `marginInline: 'auto'` |
| `block` / `flex` / `grid` / `hidden` | `display: 'block'` / `'flex'` / `'grid'` / `'none'` |
| `flex-col` | `flexDirection: 'column'` |
| `items-center` | `alignItems: 'center'` |
| `justify-between` | `justifyContent: 'space-between'` |
| `grow` | `flexGrow: 1` |
| `shrink-0` | `flexShrink: 0` |
| `flex-1` | `flex: '1 1 0%'` |
| `w-full` | `width: '100%'` |
| `size-4` | `width: '1rem', height: '1rem'` |
| `max-w-md` | `maxWidth: '28rem'` |
| `font-medium` / `semibold` / `bold` | `fontWeight: 500` / `600` / `700` |
| `leading-none` | `lineHeight: 1` |
| `truncate` | `overflow: 'hidden'`, `textOverflow: 'ellipsis'`, `whiteSpace: 'nowrap'` |
| `border` | `borderWidth: 1`, `borderStyle: 'solid'` |
| `rounded-full` | `borderRadius: '9999px'` |
| `relative` / `absolute` / `fixed` | `position: 'relative'` / `'absolute'` / `'fixed'` |
| `inset-0` | `inset: 0` (single value is valid) |
| `z-50` | `zIndex: 50` |
| `opacity-50` | `opacity: 0.5` |
| `pointer-events-none` | `pointerEvents: 'none'` |

Theme colors (`bg-background`, `text-muted-foreground`): resolve against `globals.css` /
`@theme` / CSS variables. Do not guess oklch for `bg-red-500`.
