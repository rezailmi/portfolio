"use client";

import { font, leading } from '@/lib/constants.stylex'

import { Toast } from "@base-ui/react/toast";
import * as stylex from "@stylexjs/stylex";
import { XIcon } from "lucide-react";

import { colors, radius } from "@/lib/tokens.stylex";

const styles = stylex.create({
  close: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: radius.sm,
    borderWidth: 0,
    color: colors.mutedForeground,
    cursor: "pointer",
    display: "inline-flex",
    height: "1.5rem",
    justifyContent: "center",
    outline: "none",
    position: "absolute",
    right: "0.5rem",
    top: "0.5rem",
    width: "1.5rem",
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
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    color: colors.foreground,
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    padding: "1rem",
    paddingInlineEnd: "2rem",
    position: "relative",
    width: "22rem",
  },
  title: {
    fontSize: font.sm,
    fontWeight: 600,
    lineHeight: leading.sm,
  },
  viewport: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    insetBlockEnd: "1rem",
    insetInlineEnd: "1rem",
    maxWidth: "calc(100vw - 2rem)",
    position: "fixed",
    zIndex: 99999,
  },
});

const ToastProvider = Toast.Provider;

function useToastManager() {
  return Toast.useToastManager();
}

function Toaster() {
  const { toasts } = useToastManager();
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
            {toast.title ? (
              <Toast.Title className={stylex.props(styles.title).className} />
            ) : null}
            {toast.description ? (
              <Toast.Description
                className={stylex.props(styles.description).className}
              />
            ) : null}
            <Toast.Close
              className={stylex.props(styles.close).className}
              data-slot="toast-close"
            >
              <XIcon size={14} />
            </Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export { Toaster, ToastProvider, useToastManager };
