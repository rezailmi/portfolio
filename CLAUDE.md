# CLAUDE.md

Next.js 16 portfolio site with MDX content, StyleX, and Base UI primitives from shadcn-cssinjs.

## Commands

```bash
bun dev          # Development server
bun run build    # Production build
bun lint         # ESLint
```

No test framework configured.

## Critical: Base UI (Not Radix)

This project uses Base UI. Use `render` prop, not `asChild`:

```tsx
// Correct
<Tooltip.Trigger render={<Button />} />

// Wrong - this is Radix pattern
<Tooltip.Trigger asChild><Button /></Tooltip.Trigger>
```

See [Base UI patterns](.claude/docs/base-ui-patterns.md) for full details.

## Styling

- Page layout: `Box` / `Text` with token props. `display` is explicit.
- Component internals: `stylex.create` using `space`, `shadow`, `zIndex`, `weight`, `tracking`, `colors`, `radius`.
- Do not write rem/px/hex in `stylex.create` for spacing or color. ESLint `local/no-hardcoded-*` and `local/no-classname-box` enforce this.

## Documentation

- [Base UI Patterns](.claude/docs/base-ui-patterns.md) - Component composition, accordion API, toasts, z-index
- [Project Architecture](.claude/docs/project-architecture.md) - Directory structure, MDX system, layout, styling
- [Coding Conventions](.claude/docs/coding-conventions.md) - TypeScript, naming, formatting, React patterns
