# UI components (`components/ui/`)

StyleX + Base UI primitives from [shadcn-cssinjs](https://www.shadcn-cssinjs.com/). Parent rules live in `/AGENTS.md`. Styling how-to lives in `.claude/docs/styling.md`.

## Local rules

- Use `useRender` and the `render` prop. Do not use Radix `asChild`
- Set `zIndex: 99999` on menu, tooltip, and select positioners so they sit above backdrop-blur
- When a Base UI subcomponent wants a string `className`, pass `className={stylex.props(styles.trigger).className ?? undefined}`
- Install or refresh a primitive with `node scripts/install-shadcn-cssinjs.mjs <name>`

Registry config is `components.json`. The utils alias is `@/lib/utils.stylex`.
