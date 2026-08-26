# Base UI Patterns

This project uses **Base UI** (`@base-ui/react`), not Radix UI.

## Composition Pattern

```tsx
// Base UI uses the `render` prop for composition
<Tooltip.Trigger render={<Button />} />
```

**DO NOT use the Radix pattern:**
```tsx
// Wrong - this is Radix, not Base UI
<Tooltip.Trigger asChild><Button /></Tooltip.Trigger>
```

## Components Using Base UI

Dialog, Menu (Dropdown), Popover, Preview Card (Hover Card), Accordion, Checkbox, Collapsible, Label, Progress, Radio Group, Separator, Slider, Switch, Tabs, Toggle, Toggle Group, Alert Dialog, Scroll Area, Avatar, Tooltip, Sheet

## Components Retaining Radix Slot

These intentionally use `@radix-ui/react-slot` for `asChild`:
- Button, Sidebar, Form, Breadcrumb

## Accordion API

```tsx
// Single mode (default)
<Accordion>
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>

// Multiple mode
<Accordion multiple>
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>
```

Use `multiple` prop, not `type="multiple"` or `collapsible`.

## Toast Notifications

The toast/sonner integration was removed as unused on 2026-07-02. If toasts are needed, re-add via the shadcn CLI.

## Z-Index for Dropdowns

Set `zIndex: 99999` in the StyleX positioner styles so menus appear above backdrop-blur effects. See `components/ui/dropdown-menu.tsx` for the pattern.

## Styling Base UI primitives

StyleX styles apply on the host element via `stylex.props()`. When a Base UI subcomponent expects a string `className`, use `className={stylex.props(styles.foo).className}` — see individual `components/ui/*` files.
