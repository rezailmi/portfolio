# Base UI patterns

This project uses Base UI (`@base-ui/react`), not Radix UI.

## Composition

```tsx
<Tooltip.Trigger render={<Button />} />
```

Do not use the Radix pattern:

```tsx
<Tooltip.Trigger asChild><Button /></Tooltip.Trigger>
```

## Components that use Base UI

Dialog, Menu (Dropdown), Popover, Preview Card (Hover Card), Accordion, Checkbox, Collapsible, Label, Progress, Radio Group, Separator, Slider, Switch, Tabs, Toggle, Toggle Group, Alert Dialog, Scroll Area, Avatar, Tooltip, Sheet.

## Accordion

```tsx
<Accordion>
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>

<Accordion multiple>
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>
```

Use the `multiple` prop. Do not use `type="multiple"` or `collapsible`.

## Toasts

The toast and sonner integration was removed on 2026-07-02. Re-add it through the shadcn CLI if you need toasts.

## Z-index

Set `zIndex: 99999` on StyleX positioner styles so menus sit above backdrop-blur. See `components/ui/dropdown-menu.tsx`.

## Styling primitives

Apply StyleX on the host with `stylex.props()`. When a Base UI subcomponent wants a string `className`, pass `className={stylex.props(styles.foo).className}`.
