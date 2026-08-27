# StyleX authoring rules and setup

Adapted from [shadcn-labs/skills `tailwind-to-stylex`](https://github.com/shadcn-labs/skills/blob/main/skills/tailwind-to-stylex/references/stylex-rules.md)
(MIT, Copyright 2026 Shadcn Labs). Next/SWC notes from rezailmi/portfolio are marked
**Portfolio**.

## Contents

- [Authoring rules](#authoring-rules)
- [Common mistakes](#common-mistakes)
- [Theming with variables](#theming-with-variables)
- [Project setup](#project-setup)
- [Next.js 16 (SWC)](#nextjs-16-swc)
- [CSS layers](#css-layers)
- [Framework support: props vs attrs](#framework-support-props-vs-attrs)

## Authoring rules

- Define `stylex.create({...})` at module top level, not inside a component render.
- CamelCase properties. `background-color` → `backgroundColor`. Custom props `--my-var` stay as-is.
- Longhands and **single-value** shorthands only. Multi-value shorthands collide during merge:
  - `margin: '0 auto'` → `marginBlock: 0, marginInline: 'auto'`
  - `padding: '1rem 2rem'` → `paddingBlock: '1rem', paddingInline: '2rem'`
  - `border: '1px solid #ccc'` → `borderWidth: 1, borderStyle: 'solid', borderColor: '#ccc'`
  - `inset: 0` is valid; `inset: '0 4px'` is not.
- Numbers are px for lengths. `width: 24` = `24px`. Unitless props (`lineHeight`, `flexGrow`,
  `opacity`, `zIndex`, `fontWeight`) also take numbers. Non-px units are strings (`'1.5rem'`).
- Conditional values need `default`. Any `:pseudo`, `@media`, `@container`, `[attr]`, or
  `::pseudo-element` key must have `default`. Use `null` when there is no base. This applies
  at every nesting level.
- `null` unsets a property in a variant.
- No descendant selectors. You cannot write `'& .child'` or `'.dark &'`. Conditions are
  this element's own pseudos, attributes, and at-rules.
- Dynamic styles are functions: arguments are plain identifiers; body is one object
  literal. `bar: (h) => ({ height: h })`. No destructuring, no defaults, no `return`.

```ts
import * as stylex from '@stylexjs/stylex'

const styles = stylex.create({
  root: {
    display: 'flex',
    padding: '1rem',
  },
})
```

## Common mistakes

- Forgetting `default` on a conditional property. StyleX ignores the condition.
- Putting a media query or `defineConsts` media key at the top of a style
  namespace. Official authoring and `@stylexjs/valid-styles` require nesting
  inside the property. **Portfolio:** `@stylexswc` 0.18.4 compiles string
  top-level `'@media (min-width: 40rem)': { ... }` and nested
  `[mq.sm]` inside a property. It rejects top-level `[mq.sm]: { ... }` with
  `Invalid pseudo or at-rule`. Always nest.
- Spreading `stylex.props(...)` onto a custom component. Pass a style token; apply it on
  the host element inside that component.
- Multi-value shorthand such as `padding: '8px 16px'`. Compiler or linter rejects it.
- Dropping extra declarations from a Tailwind utility. `text-sm` is size **and**
  line-height. `truncate` is three properties.
- Building styles inside render. The compiler cannot extract them.
- Wrong merge order. `stylex.props` is last-wins. Keep caller overrides last.
- **Portfolio:** leftover `cn()` on compiled class strings. Stylesheet order wins, not
  argument order. A page-level size that must beat a Button token needs inline `style`.
- **Portfolio:** `tsc --noEmit` passing is not proof CSS was extracted.

## Theming with variables

Variables must be **named exports** and the **only** exports in a `.stylex.ts` /
`.stylex.js` file.

```ts
// tokens.stylex.ts
import * as stylex from '@stylexjs/stylex'

export const colors = stylex.defineVars({
  text: '#111827',
  bg: '#ffffff',
  brand: '#2563eb',
})
```

```tsx
import { colors } from './tokens.stylex'

const styles = stylex.create({
  card: { color: colors.text, backgroundColor: colors.bg },
})
```

Do not put `var(--token)` *inside* `defineVars` unless this repo's compiler has been
proven to accept it. Using `var(--background)` in a **rule** (not a token definition) is
fine when the project already owns those CSS variables.

Class-based dark mode: `createTheme` on an ancestor. Descendants reading `colors.*`
switch with the theme. This replaces `dark:` ancestor selectors StyleX cannot express.

```tsx
export const darkTheme = stylex.createTheme(colors, {
  text: '#f9fafb',
  bg: '#111827',
})

<div {...stylex.props(darkTheme, styles.app)} />
```

Use `stylex.defineConsts` for unthemed repeats (breakpoints, type scale). Use
`stylex.defineVars` for themed values. Official guide:
https://stylexjs.com/docs/llm-resources

Use the shared `space`, `shadow`, and `zIndex` consts. Do not invent a second
scale or extract `stack2`.

[aidenybai/tailwind-stylex](https://github.com/aidenybai/tailwind-stylex) is a generated
`defineConsts` dump of **default** Tailwind v4 tokens (`colors.stone100`, `spacing[4]`,
`mediaQueries.sm`). Do not install it in this repo. Site colors and radius are
shadcn CSS variables under `.dark`. Geist is the font. The compiler `include` list
only covers `app/`, `components/`, `lib/`, and `hooks/`. A `node_modules` token
file would need a new include and still paint the wrong palette. Steal the
breakpoint table (v4 is rem). Leave the package out.

## Project setup

StyleX is compile-time. Without the plugin, `stylex.props` produces no styles.

1. Install `@stylexjs/stylex` and the matching build integration.
2. Pick the plugin for the toolchain:
   - Next.js: `@stylexjs/nextjs-plugin` or `@stylexswc/nextjs-plugin` (see below)
   - Vite: `vite-plugin-stylex` or `@stylexjs/postcss-plugin`
   - Webpack/rspack: `@stylexjs/webpack-plugin` or `@stylexswc/webpack-plugin`
   - Babel-only: `@stylexjs/babel-plugin`
3. Import the extracted stylesheet once at the app root.
4. Consider `@stylexjs/eslint-plugin`.
5. react-strict-dom: `css.create` + `style` on `html.*`. Same authoring rules.

Consult current StyleX docs for package names. They move. If you cannot verify setup,
convert the code and tell the user to confirm the plugin.

## Next.js 16 (SWC)

**Portfolio:** Next 16 defaults to Turbopack. The default export of
`@stylexswc/nextjs-plugin` injects `webpack()`. Bare `next build` then fails:

```
ERROR: This build is using Turbopack, with a webpack config and no turbopack config.
```

Honest paths:

1. Ship webpack: `next dev --webpack` / `next build --webpack`. Default plugin.
   `extractCSS: true`. Import `@stylexswc/webpack-plugin/stylex.css` in the root layout.
2. Ship Turbopack: default-import `@stylexswc/nextjs-plugin/turbopack` +
   `@stylexswc/postcss-plugin` + a CSS file containing `@stylex;`. The PostCSS plugin
   replaces `@stylex;` with atoms.

Do **not** add empty `turbopack: {}` to silence the error. That succeeds with no CSS.

Do not gate PostCSS StyleX on `process.env.TURBOPACK` unless that env is set when
`postcss.config` loads.

Branch on `process.argv.includes('--webpack')` if both exist. Skip PostCSS StyleX on
`--webpack` or you emit CSS twice.

Full host notes: [next-and-vercel.md](next-and-vercel.md).

## CSS layers

**Portfolio:** `useCSSLayers: true` puts atoms in `@layer priority4`. UA / preflight
reset must live in `@layer priority1`. An unlayered reset loses to StyleX. Buttons and
headings then look off even when class names are present.

```css
@layer priority1 {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }
}
```

## Framework support: props vs attrs

`stylex.create` never changes. Only the applicator does.

| Host | Call | Returns |
| --- | --- | --- |
| React, Preact, react-strict-dom | `stylex.props(...)` | `{ className, style }` |
| Solid, Svelte, Vue, Qwik | `stylex.attrs(...)` | `{ class, style }` (`style` is a string) |

Spread or bind onto a **host** element. Same style objects either way.
