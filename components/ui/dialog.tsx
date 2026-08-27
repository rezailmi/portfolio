'use client'

import { font, leading, mq, space, shadow, zIndex, weight, tracking } from '@/lib/constants.stylex'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
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
    transition: 'opacity 0.15s ease-in-out',
    zIndex: zIndex.overlay,
  },
  backdropHidden: {
    opacity: 0,
  },
  closeButton: {
    alignItems: 'center',
    background: 'none',
    borderRadius: radius.sm,
    borderWidth: 0,
    boxShadow: {
      ':focus-visible': `0 0 0 2px color-mix(in oklab, ${colors.ring} 50%, transparent)`,
      default: null,
    },
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
    transition: 'opacity 0.15s ease-in-out',
  },
  description: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: space.sm,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.sm,
    textAlign: 'center',
  },
  popup: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: shadow.lg,
    color: colors.foreground,
    display: 'grid',
    gap: space.lg,
    left: '50%',
    maxWidth: {
      [mq.sm]: '32rem',
      default: 'calc(100% - 2rem)',
    },
    opacity: 1,
    outline: 'none',
    padding: space['2xl'],
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%) scale(1)',
    transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
    width: '100%',
    zIndex: zIndex.overlay,
  },
  popupHidden: {
    opacity: 0,
    transform: 'translate(-50%, -50%) scale(0.95)',
  },
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
  title: {
    color: colors.foreground,
    fontSize: font.lg,
    fontWeight: weight.semibold,
    letterSpacing: tracking.tight,
    lineHeight: 1,
  },
})

const hidden = (s: string | undefined) => s === 'starting' || s === 'ending'

const Dialog = (props: React.ComponentProps<typeof DialogPrimitive.Root>) => (
  <DialogPrimitive.Root data-slot="dialog" {...props} />
)

const DialogTrigger = (props: React.ComponentProps<typeof DialogPrimitive.Trigger>) => (
  <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
)

const DialogClose = (props: React.ComponentProps<typeof DialogPrimitive.Close>) => (
  <DialogPrimitive.Close data-slot="dialog-close" {...props} />
)

const DialogPortal = (props: React.ComponentProps<typeof DialogPrimitive.Portal>) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
)

const DialogOverlay = (props: React.ComponentProps<typeof DialogPrimitive.Backdrop>) => (
  <DialogPrimitive.Backdrop
    data-slot="dialog-overlay"
    className={(state) =>
      stylex.props(styles.backdrop, hidden(state.transitionStatus) && styles.backdropHidden)
        .className
    }
    {...props}
  />
)

const DialogContent = ({
  children,
  className,
  style,
  showCloseButton = true,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Popup>, 'className'> & {
  className?: string
  showCloseButton?: boolean
}) => {
  const close = stylex.props(styles.closeButton)
  const sr = stylex.props(styles.srOnly)
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
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
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className={close.className}
            style={close.style}
          >
            <XIcon size={16} />
            <span className={sr.className} style={sr.style}>
              Close
            </span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

const DialogHeader = ({ className, style, ...props }: React.ComponentProps<'div'>) => (
  <div
    data-slot="dialog-header"
    {...stylex.props(styles.header, customClassName(className), style as StyleXStyles)}
    {...props}
  />
)

const DialogFooter = ({ className, style, ...props }: React.ComponentProps<'div'>) => (
  <div
    data-slot="dialog-footer"
    {...stylex.props(styles.footer, customClassName(className), style as StyleXStyles)}
    {...props}
  />
)

const DialogTitle = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Title>, 'className'> & {
  className?: string
}) => (
  <DialogPrimitive.Title
    data-slot="dialog-title"
    {...stylex.props(styles.title, customClassName(className), style as StyleXStyles)}
    {...props}
  />
)

const DialogDescription = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Description>, 'className'> & {
  className?: string
}) => (
  <DialogPrimitive.Description
    data-slot="dialog-description"
    {...stylex.props(styles.description, customClassName(className), style as StyleXStyles)}
    {...props}
  />
)

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
