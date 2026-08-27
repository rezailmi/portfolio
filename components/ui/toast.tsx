'use client'

import { font, leading, space, shadow, zIndex, weight } from '@/lib/constants.stylex'

import { Toast } from '@base-ui/react/toast'
import * as stylex from '@stylexjs/stylex'
import { XIcon } from 'lucide-react'

import { colors, radius } from '@/lib/tokens.stylex'

const styles = stylex.create({
  close: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius.sm,
    borderWidth: 0,
    color: colors.mutedForeground,
    cursor: 'pointer',
    display: 'inline-flex',
    height: '1.5rem',
    justifyContent: 'center',
    outline: 'none',
    position: 'absolute',
    right: space.sm,
    top: space.sm,
    width: '1.5rem',
  },
  description: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
  root: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: shadow.lg,
    color: colors.foreground,
    display: 'flex',
    flexDirection: 'column',
    gap: space.xs,
    padding: space.lg,
    paddingInlineEnd: space['4xl'],
    position: 'relative',
    width: '22rem',
  },
  title: {
    fontSize: font.sm,
    fontWeight: weight.semibold,
    lineHeight: leading.sm,
  },
  viewport: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.sm,
    insetBlockEnd: '1rem',
    insetInlineEnd: space.lg,
    maxWidth: 'calc(100vw - 2rem)',
    position: 'fixed',
    zIndex: zIndex.popover,
  },
})

const ToastProvider = Toast.Provider

function useToastManager() {
  return Toast.useToastManager()
}

function Toaster() {
  const { toasts } = useToastManager()
  return (
    <Toast.Portal>
      <Toast.Viewport
        className={stylex.props(styles.viewport).className}
        data-slot="toast-viewport"
      >
        {toasts.map((toast) => (
          <Toast.Root
            className={stylex.props(styles.root).className}
            data-slot="toast"
            key={toast.id}
            toast={toast}
          >
            {toast.title ? <Toast.Title className={stylex.props(styles.title).className} /> : null}
            {toast.description ? (
              <Toast.Description className={stylex.props(styles.description).className} />
            ) : null}
            <Toast.Close className={stylex.props(styles.close).className} data-slot="toast-close">
              <XIcon size={14} />
            </Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}

export { Toaster, ToastProvider, useToastManager }
