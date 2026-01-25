# CLAUDE.md

Next.js 16 portfolio site with MDX content, Shadcn UI (Base UI primitives), and Tailwind CSS.

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

## Documentation

- [Base UI Patterns](.claude/docs/base-ui-patterns.md) - Component composition, accordion API, toasts, z-index
- [Project Architecture](.claude/docs/project-architecture.md) - Directory structure, MDX system, layout, styling
- [Coding Conventions](.claude/docs/coding-conventions.md) - TypeScript, naming, formatting, React patterns
