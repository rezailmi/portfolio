# Coding Conventions

## TypeScript

- Prefer `interface` over `type` for object shapes
- Avoid enums; use `as const` objects instead
- Path alias: `@/*` maps to project root

## Naming

| Type | Convention | Example |
|------|------------|---------|
| Directories | lowercase-dashes | `auth-wizard/` |
| Components | PascalCase | `AuthWizard.tsx` |
| Variables | camelCase + auxiliary verbs | `isLoading`, `hasError` |
| Functions | camelCase | `fetchUserData()` |

Use `function` keyword for pure functions. Favor named exports.

## File Structure

Order within component files:
1. Exported component
2. Subcomponents
3. Helpers
4. Static content
5. Types

## Formatting (Prettier)

- No semicolons
- Single quotes
- 2-space indentation
- Trailing commas (ES5)
- 100 char line width
- Tailwind class sorting via prettier-plugin-tailwindcss

## React Patterns

- Minimize `'use client'` - prefer Server Components
- Use client components only for Web API access
- Wrap client components in `Suspense` with fallback
- Use dynamic imports for non-critical components

## Pull Requests

- Titles under 80 characters, concise and specific
- Descriptions under 5 sentences
- Include summary and test plan

## Code Reviews

Structure reviews with:
1. Summary of changes
2. Issues table with severity and suggested solutions
3. What was verified (build, lint, etc.)
