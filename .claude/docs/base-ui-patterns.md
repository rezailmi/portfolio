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

Use **Sonner**, not Radix Toast:

```tsx
import { toast } from "sonner"

toast.success("Operation successful")
toast.error("Something went wrong")
```

## Z-Index for Dropdowns

Use `className="fixed z-[99999]"` on `Menu.Positioner` to appear above backdrop-blur effects.
