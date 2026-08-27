'use client'

import { font, leading, mq, space, shadow, zIndex, weight, tracking } from '@/lib/constants.stylex'

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { colors, radius } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'
import { Button } from '@/components/ui/button'

const styles = stylex.create({
  backdrop: {
    backgroundColor: colors.overlayScrim,
    inset: 0,
    opacity: 1,
    position: 'fixed',
    transition: 'opacity 0.15s ease-in-out',
    zIndex: zIndex.overlay,
  },
  backdropHidden: { opacity: 0 },
  description: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
  footer: {
    display: 'flex',
    flexDirection: {
      [mq.sm]: 'row',
      default: 'column-reverse',
    },
    gap: space.sm,
    justifyContent: { [mq.sm]: 'flex-end', default: null },
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.sm,
    textAlign: { [mq.sm]: 'start', default: 'center' },
  },
  media: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    display: 'flex',
    height: '2.75rem',
    justifyContent: 'center',
    marginBottom: space.xs,
    width: '2.75rem',
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
  popupSm: {
    maxWidth: {
      [mq.sm]: '24rem',
      default: 'calc(100% - 2rem)',
    },
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

const AlertDialog = (props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) => (
  <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
)

const AlertDialogTrigger = (props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) => (
  <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
)

const AlertDialogContent = ({
  children,
  className,
  style,
  size = 'default',
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Popup>, 'className'> & {
  className?: string
  size?: 'default' | 'sm'
}) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Backdrop
      className={(state) =>
        stylex.props(styles.backdrop, hidden(state.transitionStatus) && styles.backdropHidden)
          .className
      }
      data-slot="alert-dialog-overlay"
    />
    <AlertDialogPrimitive.Popup
      className={(state) =>
        stylex.props(
          styles.popup,
          size === 'sm' && styles.popupSm,
          hidden(state.transitionStatus) && styles.popupHidden,
          customClassName(className)
        ).className
      }
      data-size={size}
      data-slot="alert-dialog-content"
      style={style}
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Popup>
  </AlertDialogPrimitive.Portal>
)

const AlertDialogMedia = ({ className, style, ...props }: React.ComponentProps<'div'>) => (
  <div
    {...stylex.props(styles.media, customClassName(className), style as StyleXStyles)}
    data-slot="alert-dialog-media"
    {...props}
  />
)

const AlertDialogHeader = ({ className, style, ...props }: React.ComponentProps<'div'>) => (
  <div
    {...stylex.props(styles.header, customClassName(className), style as StyleXStyles)}
    data-slot="alert-dialog-header"
    {...props}
  />
)

const AlertDialogFooter = ({ className, style, ...props }: React.ComponentProps<'div'>) => (
  <div
    {...stylex.props(styles.footer, customClassName(className), style as StyleXStyles)}
    data-slot="alert-dialog-footer"
    {...props}
  />
)

const AlertDialogTitle = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Title>, 'className'> & {
  className?: string
}) => (
  <AlertDialogPrimitive.Title
    {...stylex.props(styles.title, customClassName(className), style as StyleXStyles)}
    data-slot="alert-dialog-title"
    {...props}
  />
)

const AlertDialogDescription = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Description>, 'className'> & {
  className?: string
}) => (
  <AlertDialogPrimitive.Description
    {...stylex.props(styles.description, customClassName(className), style as StyleXStyles)}
    data-slot="alert-dialog-description"
    {...props}
  />
)

const AlertDialogAction = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Close>, 'className' | 'render'> & {
  className?: string
}) => (
  <AlertDialogPrimitive.Close
    data-slot="alert-dialog-action"
    render={<Button className={className} />}
    {...props}
  />
)

const AlertDialogCancel = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Close>, 'className' | 'render'> & {
  className?: string
}) => (
  <AlertDialogPrimitive.Close
    data-slot="alert-dialog-cancel"
    render={<Button variant="outline" className={className} />}
    {...props}
  />
)

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
}
