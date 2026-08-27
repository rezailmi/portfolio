'use client'

import { font, space, zIndex, weight } from '@/lib/constants.stylex'

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { XIcon } from 'lucide-react'

import { colors, radius } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  backdrop: {
    backgroundColor: colors.overlayScrim,
    inset: 0,
    opacity: 1,
    position: 'fixed',
    transition: 'opacity 0.3s ease-in-out',
    zIndex: zIndex.overlay,
  },
  backdropHidden: { opacity: 0 },
  close: {
    alignItems: 'center',
    background: 'none',
    borderRadius: radius.sm,
    borderWidth: 0,
    color: colors.foreground,
    cursor: 'pointer',
    display: 'flex',
    insetInlineEnd: space.lg,
    justifyContent: 'center',
    opacity: { ':hover': 1, default: 0.7 },
    outline: 'none',
    padding: space.xs,
    position: 'absolute',
    top: space.lg,
  },
  content: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    gap: space.lg,
    padding: space['2xl'],
  },
  description: { color: colors.mutedForeground, fontSize: font.sm },
  popup: {
    backgroundColor: colors.background,
    borderLeftColor: colors.border,
    borderLeftStyle: 'solid',
    borderLeftWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '24rem',
    outline: 'none',
    position: 'relative',
    transform: 'translateX(var(--drawer-swipe-movement-x, 0px))',
    transition: 'transform 0.3s ease-in-out',
    width: '75%',
  },
  popupHidden: { transform: 'translateX(100%)' },
  srOnly: {
    borderWidth: 0,
    clip: 'rect(0, 0, 0, 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
  title: { color: colors.foreground, fontWeight: weight.semibold },
  viewport: {
    alignItems: 'stretch',
    display: 'flex',
    inset: 0,
    justifyContent: 'flex-end',
    position: 'fixed',
    zIndex: zIndex.overlay,
  },
})

const hidden = (s: string | undefined) => s === 'starting' || s === 'ending'

const Drawer = (props: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root data-slot="drawer" {...props} />
)

const DrawerTrigger = (props: React.ComponentProps<typeof DrawerPrimitive.Trigger>) => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
)

const DrawerClose = (props: React.ComponentProps<typeof DrawerPrimitive.Close>) => (
  <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
)

const DrawerContent = ({
  className,
  style,
  children,
  showCloseButton = true,
  ...props
}: Omit<React.ComponentProps<typeof DrawerPrimitive.Popup>, 'className'> & {
  className?: string
  showCloseButton?: boolean
}) => {
  const close = stylex.props(styles.close)
  const sr = stylex.props(styles.srOnly)
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop
        className={(state) =>
          stylex.props(styles.backdrop, hidden(state.transitionStatus) && styles.backdropHidden)
            .className
        }
        data-slot="drawer-overlay"
      />
      <DrawerPrimitive.Viewport className={stylex.props(styles.viewport).className}>
        <DrawerPrimitive.Popup
          className={(state) =>
            stylex.props(
              styles.popup,
              hidden(state.transitionStatus) && styles.popupHidden,
              customClassName(className)
            ).className
          }
          data-slot="drawer-content"
          style={style}
          {...props}
        >
          <DrawerPrimitive.Content className={stylex.props(styles.content).className}>
            {children}
          </DrawerPrimitive.Content>
          {showCloseButton ? (
            <DrawerPrimitive.Close
              className={close.className}
              data-slot="drawer-close"
              style={close.style}
            >
              <XIcon size={16} />
              <span className={sr.className} style={sr.style}>
                Close
              </span>
            </DrawerPrimitive.Close>
          ) : null}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

const DrawerTitle = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof DrawerPrimitive.Title>, 'className'> & {
  className?: string
}) => (
  <DrawerPrimitive.Title
    {...stylex.props(styles.title, customClassName(className), style as StyleXStyles)}
    data-slot="drawer-title"
    {...props}
  />
)

const DrawerDescription = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof DrawerPrimitive.Description>, 'className'> & {
  className?: string
}) => (
  <DrawerPrimitive.Description
    {...stylex.props(styles.description, customClassName(className), style as StyleXStyles)}
    data-slot="drawer-description"
    {...props}
  />
)

export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger }
