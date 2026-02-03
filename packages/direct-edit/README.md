# direct-edit

A Figma-style visual CSS editor for React. Select any element and adjust padding, border-radius, and flex properties in real-time, then copy as Tailwind classes.

## Installation

```bash
npm install direct-edit
# or
bun add direct-edit
# or
yarn add direct-edit
```

## Usage

### Simple (Recommended)

```tsx
import { DirectEdit } from 'direct-edit'

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <DirectEdit />}
    </>
  )
}
```

That's it! No CSS import needed - styles are auto-injected at runtime.

### Manual CSS (CSP/SSR)

If your app disallows inline styles, import the stylesheet directly and disable auto-injection by adding a `data-direct-edit-disable-styles` attribute on your `<html>` element.

```tsx
import 'direct-edit/styles'
import { DirectEdit } from 'direct-edit'

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <DirectEdit />}
    </>
  )
}
```

### Advanced (Custom Setup)

```tsx
import { DirectEditProvider, DirectEditPanel, DirectEditToolbar, useDirectEdit } from 'direct-edit'

function App() {
  return (
    <DirectEditProvider>
      <YourApp />
      <DirectEditPanel />
      <CustomToolbar />
    </DirectEditProvider>
  )
}

function CustomToolbar() {
  const { editModeActive, toggleEditMode } = useDirectEdit()

  return (
    <button onClick={toggleEditMode}>
      {editModeActive ? 'Exit Edit Mode' : 'Enter Edit Mode'}
    </button>
  )
}
```

## Features

- **Element Selection**: Click any element to select it (or use `Cmd+.` / `Ctrl+.` to toggle edit mode)
- **Padding Controls**: Adjust padding with combined (horizontal/vertical) or individual mode
- **Border Radius**: Slider for uniform radius or individual corner controls
- **Flex Properties**: Direction, alignment grid, distribution, and gap controls
- **Copy as Tailwind**: One-click copy of modified styles as Tailwind classes
- **Draggable Panel**: Position the panel anywhere on screen (persisted to localStorage)
- **Keyboard Shortcuts**:
  - `Cmd+.` / `Ctrl+.`: Toggle edit mode
  - `Escape`: Close panel or exit edit mode

## Exports

### Components

- `DirectEdit` - All-in-one component (Provider + Panel + Toolbar)
- `DirectEditProvider` - Context provider for state management
- `DirectEditPanel` - The main editor panel
- `DirectEditToolbar` - Floating toggle button

### Hooks

- `useDirectEdit()` - Access edit state and methods

### Types

- `ElementInfo`
- `CSSPropertyValue`
- `SpacingProperties`
- `BorderRadiusProperties`
- `FlexProperties`
- `DirectEditState`

### Utilities

- `parsePropertyValue(value: string)` - Parse CSS value to structured format
- `formatPropertyValue(value: CSSPropertyValue)` - Format back to CSS string
- `getComputedStyles(element: HTMLElement)` - Get all editable styles
- `stylesToTailwind(styles: Record<string, string>)` - Convert to Tailwind classes
- `getElementInfo(element: HTMLElement)` - Get element metadata

Server-safe utilities are also available via:

```ts
import { getDimensionDisplay, stylesToTailwind } from 'direct-edit/utils'
```

## Requirements

- React 18+
- Works with any React framework (Next.js, Vite, CRA, etc.)

## CSS Variables

The package uses CSS variables for theming. It will use your app's existing shadcn/ui theme if available, or fall back to sensible defaults:

- `--background`
- `--foreground`
- `--muted`
- `--muted-foreground`
- `--border`
- `--input`
- `--ring`
- `--primary`
- `--primary-foreground`
- `--secondary`
- `--secondary-foreground`
- `--accent`
- `--accent-foreground`
- `--radius`

## License

MIT
