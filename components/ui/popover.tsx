'use client'

import { font, leading, space, shadow, zIndex, weight } from '@/lib/constants.stylex'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { colors, radius } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  description: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.fine,
  },
  popup: {
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: shadow.lg,
    color: colors.popoverForeground,
    opacity: 1,
    outline: 'none',
    padding: space.lg,
    transform: 'scale(1)',
    transformOrigin: 'var(--transform-origin)',
    transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
    width: '18rem',
    zIndex: zIndex.overlay,
  },
  popupHidden: {
    opacity: 0,
    transform: 'scale(0.95)',
  },
  title: {
    fontSize: font.sm,
    fontWeight: weight.semibold,
    lineHeight: 1,
  },
})

const hidden = (s: string | undefined) => s === 'starting' || s === 'ending'

const Popover = (props: React.ComponentProps<typeof PopoverPrimitive.Root>) => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
)

const PopoverTrigger = (props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
)

const PopoverAnchor = (props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => (
  <PopoverPrimitive.Trigger data-slot="popover-anchor" {...props} />
)

const PopoverContent = ({
  className,
  style,
  sideOffset = 4,
  align = 'center',
  side = 'bottom',
  alignOffset,
  collisionPadding,
  children,
  ...props
}: Omit<React.ComponentProps<typeof PopoverPrimitive.Popup>, 'className'> & {
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  sideOffset?: number
  alignOffset?: number
  collisionPadding?: number
}) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      side={side}
      sideOffset={sideOffset}
    >
      <PopoverPrimitive.Popup
        data-slot="popover-content"
        className={(state) =>
          stylex.props(
            styles.popup,
            hidden(state.transitionStatus) && styles.popupHidden,
            customClassName(className)
          ).className
        }
        style={style}
        {...props}
      >
        {children}
      </PopoverPrimitive.Popup>
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
)

const PopoverHeader = ({ className, style, ...props }: React.ComponentProps<'div'>) => (
  <div
    {...stylex.props(styles.header, customClassName(className), style as StyleXStyles)}
    data-slot="popover-header"
    {...props}
  />
)

const PopoverTitle = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof PopoverPrimitive.Title>, 'className'> & {
  className?: string
}) => (
  <PopoverPrimitive.Title
    {...stylex.props(styles.title, customClassName(className), style as StyleXStyles)}
    data-slot="popover-title"
    {...props}
  />
)

const PopoverDescription = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof PopoverPrimitive.Description>, 'className'> & {
  className?: string
}) => (
  <PopoverPrimitive.Description
    {...stylex.props(styles.description, customClassName(className), style as StyleXStyles)}
    data-slot="popover-description"
    {...props}
  />
)

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
