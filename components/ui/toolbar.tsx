"use client";

import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  button: {
    alignItems: "center",
    backgroundColor: { ":hover": colors.muted, default: "transparent" },
    borderRadius: radius.md,
    borderWidth: 0,
    boxShadow: {
      ":focus-visible": `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: null,
    },
    color: colors.foreground,
    cursor: { ":disabled": "not-allowed", default: "pointer" },
    display: "inline-flex",
    height: "2.25rem",
    justifyContent: "center",
    minWidth: "2.25rem",
    opacity: { ":disabled": 0.5, default: 1 },
    outline: "none",
    paddingInline: "0.5rem",
  },
  group: {
    alignItems: "center",
    display: "flex",
    gap: "0.25rem",
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.input,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: "1px",
    color: colors.foreground,
    fontSize: "0.875rem",
    height: "2.25rem",
    outline: "none",
    paddingInline: "0.75rem",
  },
  link: {
    color: { ":hover": colors.foreground, default: colors.mutedForeground },
    fontSize: "0.875rem",
    textDecorationLine: "none",
  },
  root: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: "1px",
    display: "flex",
    gap: "0.25rem",
    padding: "0.25rem",
  },
  separator: {
    alignSelf: "stretch",
    backgroundColor: colors.border,
    marginInline: "0.25rem",
    width: "1px",
  },
});

const Toolbar = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ToolbarPrimitive.Root>, "className"> & {
  className?: string;
}) => (
  <ToolbarPrimitive.Root
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="toolbar"
    {...props}
  />
);

const ToolbarGroup = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ToolbarPrimitive.Group>, "className"> & {
  className?: string;
}) => (
  <ToolbarPrimitive.Group
    {...stylex.props(
      styles.group,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="toolbar-group"
    {...props}
  />
);

const ToolbarButton = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ToolbarPrimitive.Button>, "className"> & {
  className?: string;
}) => (
  <ToolbarPrimitive.Button
    {...stylex.props(
      styles.button,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="toolbar-button"
    {...props}
  />
);

const ToolbarLink = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ToolbarPrimitive.Link>, "className"> & {
  className?: string;
}) => (
  <ToolbarPrimitive.Link
    {...stylex.props(
      styles.link,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="toolbar-link"
    {...props}
  />
);

const ToolbarInput = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ToolbarPrimitive.Input>, "className"> & {
  className?: string;
}) => (
  <ToolbarPrimitive.Input
    {...stylex.props(
      styles.input,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="toolbar-input"
    {...props}
  />
);

const ToolbarSeparator = ({
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof ToolbarPrimitive.Separator>,
  "className"
> & {
  className?: string;
}) => (
  <ToolbarPrimitive.Separator
    {...stylex.props(
      styles.separator,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="toolbar-separator"
    {...props}
  />
);

export {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
};
