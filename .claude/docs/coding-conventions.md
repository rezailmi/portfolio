# Coding conventions

## TypeScript

- Prefer `interface` over `type` for object shapes
- Avoid enums. Use `as const` objects
- Path alias `@/*` maps to the project root

## Naming

| Type | Convention | Example |
|------|------------|---------|
| Directories | lowercase-dashes | `auth-wizard/` |
| Components | PascalCase | `AuthWizard.tsx` |
| Variables | camelCase + auxiliary verbs | `isLoading`, `hasError` |
| Functions | camelCase | `fetchUserData()` |
| StyleX token files | `*.stylex.ts` | `tokens.stylex.ts` |

Use the `function` keyword for pure functions. Favor named exports.

## File structure

Order inside a component file:

1. Imports (external, then `@/` internal)
2. `stylex.create()` definitions
3. Variant and size maps (`Record<Variant, StyleXStyles>`)
4. Exported component
5. Types

## Formatting

Prettier: no semicolons, single quotes, 2-space indent, trailing commas, 100 char width.

## Styling

See [How to style with StyleX](styling.md).

## React

- Prefer Server Components. Add `'use client'` only for Web API access
- Wrap client components in `Suspense`
- Use dynamic imports for non-critical components

## Pull requests

- Titles under 80 characters
- Descriptions under 5 sentences
- Include what changed and how you verified it
