# Primitives (Base UI, shadcn)

This portfolio uses **Base UI**, not Radix. shadcn wrappers sit on top. A Tailwind → StyleX migration that retargets those wrappers will fail in ways the class converter does not mention.

## render, not asChild

```tsx
// Correct (Base UI)
<Tooltip.Trigger render={<Button />}>Label</Tooltip.Trigger>

// Wrong (Radix)
<Tooltip.Trigger asChild>
  <Button>Label</Button>
</Tooltip.Trigger>
```

If the target project is still Radix, keep `asChild`. Do not rewrite it because this skill mentions `render`.

## Toast import

```ts
import { Toast } from "@base-ui/react/toast"

const { add } = Toast.useToastManager()
```

A named `useToastManager` import can be rewritten by webpack to a missing file. Import the namespace (`Toast`) and call `Toast.useToastManager()`.

If toasts were removed (this repo dropped sonner on 2026-07-02), do not re-add them for the migration unless a page still calls them.

## Pin the export map

Before you write `import { Drawer } from "@base-ui/react/drawer"`:

1. Open `node_modules/@base-ui/react/package.json` `exports`
2. Confirm the **lockfile** version, not just `node_modules`
3. Drawer is not on 1.1.0. OTP Field is not on 1.1.0. This migration wrote wrappers against **1.7.0** while `bun.lock` stayed on 1.1.0. Vercel failed. Local passed.

See lockfiles-and-ci.md.

## Field.Root is not a layout node

`Field.Root` is a context wrapper. Tailwind often leaves it unstyled. Do not assign `space-y` / column + gap to it because a nearby `Label` had `space-y-2`. The label is inline. The stack is the block line box of the control.

## Triggers

- `flex w-full` → `display: "flex"`, `width: "100%"`
- `inline-flex` on a full-width collapsible trigger adds a line-box strut

## Dialog, sheet, drawer height

Positioned popups use `--available-height` / `--available-width`. Always give a fallback in `maxHeight` / `maxWidth` so an unset variable does not compute to 0.

## Do not modify shadcn `components/ui` in place if the project forbids it

AGENTS.md in this repo says do not modify Shadcn components directly; extend them. A migration that must change `className` on a primitive has to either:

- extend the primitive, or
- treat the file as in-scope because StyleX cannot live only in the caller

Prefer the smallest edit that removes Tailwind from the shipped CSS. Do not restyle the primitive's API (`render`, data-slots, ids).

## className-only primitives

Some wrappers still take `className`. When you cannot spread `stylex.props`:

```tsx
<Separator className={stylex.props(styles.sepBlock).className} />
```

To merge a caller `className` with StyleX, use a `$$css` token (this repo:
`customClassName` in `lib/utils.stylex.ts`):

```ts
export const customClassName = (className: string | undefined) =>
  className ? ({ [className]: className, $$css: true } as StyleXStyles) : null
```

`stylex.props(styles.root, customClassName(className))`. Concatenating compiled class
strings with `cn()` loses to stylesheet order.

## Kitchen sink pages

`/base` (or a shadcn demo route) will grow during a migration. Extra sections after the last shared Tailwind section are not a parity failure. Compare shared boxes only.

## Toast / sonner

If the project has no toast runtime, do not add `@stylex` rules for toasts. If it does, keep the existing manager. Do not swap sonner for Base UI toast in the same PR as the CSS migration unless the task says so.
