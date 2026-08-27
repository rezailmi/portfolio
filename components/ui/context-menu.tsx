'use client'

import { font, space, shadow, zIndex, weight } from '@/lib/constants.stylex'

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { CheckIcon, CircleIcon } from 'lucide-react'

import { colors, radius } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  icon: {
    height: '1rem',
    width: '1rem',
  },
  indicatorWrap: {
    alignItems: 'center',
    display: 'flex',
    height: '0.875rem',
    insetInlineStart: space.sm,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
    width: '0.875rem',
  },
  item: {
    alignItems: 'center',
    borderRadius: radius.xs,
    cursor: 'default',
    display: 'flex',
    fontSize: font.sm,
    gap: space.sm,
    outline: 'none',
    paddingBlock: space.fine,
    paddingInline: space.sm,
    position: 'relative',
    userSelect: 'none',
  },
  itemDisabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  itemHighlighted: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
  },
  itemIndented: {
    paddingInlineStart: space['4xl'],
  },
  label: {
    color: colors.foreground,
    fontSize: font.sm,
    fontWeight: weight.semibold,
    paddingBlock: space.fine,
    paddingInline: space.sm,
  },
  popup: {
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: shadow.lg,
    color: colors.popoverForeground,
    minWidth: '8rem',
    opacity: 1,
    outline: 'none',
    overflowY: 'auto',
    padding: space.xs,
    zIndex: zIndex.overlay,
  },
  popupHidden: {
    opacity: 0,
  },
  positioner: {
    position: 'fixed',
    zIndex: zIndex.popover,
  },
  separator: {
    backgroundColor: colors.border,
    height: '1px',
    marginBlock: space.xs,
    marginInline: `calc(${space.xs} * -1)`,
  },
  trigger: {
    display: 'block',
  },
})

const hidden = (s: string | undefined) => s === 'starting' || s === 'ending'

const ContextMenu = (props: React.ComponentProps<typeof ContextMenuPrimitive.Root>) => (
  <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
)

const ContextMenuTrigger = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.Trigger>, 'className'> & {
  className?: string
}) => (
  <ContextMenuPrimitive.Trigger
    {...stylex.props(styles.trigger, customClassName(className), style as StyleXStyles)}
    data-slot="context-menu-trigger"
    {...props}
  />
)

const ContextMenuContent = ({
  className,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.Popup>, 'className'> & {
  className?: string
}) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Positioner className={stylex.props(styles.positioner).className}>
      <ContextMenuPrimitive.Popup
        className={(state) =>
          stylex.props(
            styles.popup,
            hidden(state.transitionStatus) && styles.popupHidden,
            customClassName(className)
          ).className
        }
        data-slot="context-menu-content"
        style={style}
        {...props}
      >
        {children}
      </ContextMenuPrimitive.Popup>
    </ContextMenuPrimitive.Positioner>
  </ContextMenuPrimitive.Portal>
)

const ContextMenuItem = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.Item>, 'className'> & {
  className?: string
}) => (
  <ContextMenuPrimitive.Item
    className={(state) =>
      stylex.props(
        styles.item,
        state.highlighted && styles.itemHighlighted,
        state.disabled && styles.itemDisabled,
        customClassName(className)
      ).className
    }
    data-slot="context-menu-item"
    style={style}
    {...props}
  />
)

const ContextMenuCheckboxItem = ({
  className,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>, 'className'> & {
  className?: string
}) => {
  const indicator = stylex.props(styles.indicatorWrap)
  const icon = stylex.props(styles.icon)
  return (
    <ContextMenuPrimitive.CheckboxItem
      className={(state) =>
        stylex.props(
          styles.item,
          styles.itemIndented,
          state.highlighted && styles.itemHighlighted,
          state.disabled && styles.itemDisabled,
          customClassName(className)
        ).className
      }
      data-slot="context-menu-checkbox-item"
      style={style}
      {...props}
    >
      <span className={indicator.className} style={indicator.style}>
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className={icon.className} style={icon.style} />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

const ContextMenuRadioGroup = (
  props: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>
) => <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />

const ContextMenuRadioItem = ({
  className,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>, 'className'> & {
  className?: string
}) => {
  const indicator = stylex.props(styles.indicatorWrap)
  return (
    <ContextMenuPrimitive.RadioItem
      className={(state) =>
        stylex.props(
          styles.item,
          styles.itemIndented,
          state.highlighted && styles.itemHighlighted,
          state.disabled && styles.itemDisabled,
          customClassName(className)
        ).className
      }
      data-slot="context-menu-radio-item"
      style={style}
      {...props}
    >
      <span className={indicator.className} style={indicator.style}>
        <ContextMenuPrimitive.RadioItemIndicator>
          <CircleIcon style={{ fill: 'currentColor', height: '0.5rem', width: '0.5rem' }} />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

const ContextMenuLabel = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.GroupLabel>, 'className'> & {
  className?: string
}) => (
  <ContextMenuPrimitive.GroupLabel
    {...stylex.props(styles.label, customClassName(className), style as StyleXStyles)}
    data-slot="context-menu-label"
    {...props}
  />
)

const ContextMenuSeparator = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuPrimitive.Separator>, 'className'> & {
  className?: string
}) => (
  <ContextMenuPrimitive.Separator
    {...stylex.props(styles.separator, customClassName(className), style as StyleXStyles)}
    data-slot="context-menu-separator"
    {...props}
  />
)

const ContextMenuGroup = (props: React.ComponentProps<typeof ContextMenuPrimitive.Group>) => (
  <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
)

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
}
