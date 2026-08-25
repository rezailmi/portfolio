"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  button: {
    alignItems: "center",
    backgroundColor: { ":hover": colors.accent, default: "transparent" },
    borderWidth: 0,
    color: colors.mutedForeground,
    cursor: { ":disabled": "not-allowed", default: "pointer" },
    display: "inline-flex",
    height: "100%",
    justifyContent: "center",
    opacity: { ":disabled": 0.5, default: 1 },
    outline: "none",
    width: "2rem",
  },
  group: {
    alignItems: "stretch",
    backgroundColor: colors.background,
    borderColor: colors.input,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: {
      ":focus-within": `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: "none",
    },
    display: "flex",
    height: "2.5rem",
    overflow: "hidden",
    width: "8rem",
  },
  input: {
    backgroundColor: "transparent",
    borderWidth: 0,
    color: colors.foreground,
    flex: 1,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    minWidth: 0,
    outline: "none",
    paddingInline: "0.75rem",
    textAlign: "center",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  scrub: {
    color: colors.mutedForeground,
    cursor: "ew-resize",
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1,
    userSelect: "none",
  },
});

const NumberField = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof NumberFieldPrimitive.Root>, "className"> & {
  className?: string;
}) => (
  <NumberFieldPrimitive.Root
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="number-field"
    {...props}
  />
);

const NumberFieldScrubArea = ({
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof NumberFieldPrimitive.ScrubArea>,
  "className"
> & {
  className?: string;
}) => (
  <NumberFieldPrimitive.ScrubArea
    {...stylex.props(
      styles.scrub,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="number-field-scrub-area"
    {...props}
  />
);

const NumberFieldGroup = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof NumberFieldPrimitive.Group>, "className"> & {
  className?: string;
}) => (
  <NumberFieldPrimitive.Group
    {...stylex.props(
      styles.group,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="number-field-group"
    {...props}
  />
);

const NumberFieldInput = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof NumberFieldPrimitive.Input>, "className"> & {
  className?: string;
}) => (
  <NumberFieldPrimitive.Input
    {...stylex.props(
      styles.input,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="number-field-input"
    {...props}
  />
);

const NumberFieldIncrement = ({
  className,
  style,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof NumberFieldPrimitive.Increment>,
  "className"
> & {
  className?: string;
}) => (
  <NumberFieldPrimitive.Increment
    {...stylex.props(
      styles.button,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="number-field-increment"
    {...props}
  >
    {children ?? <ChevronUpIcon size={14} />}
  </NumberFieldPrimitive.Increment>
);

const NumberFieldDecrement = ({
  className,
  style,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof NumberFieldPrimitive.Decrement>,
  "className"
> & {
  className?: string;
}) => (
  <NumberFieldPrimitive.Decrement
    {...stylex.props(
      styles.button,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="number-field-decrement"
    {...props}
  >
    {children ?? <ChevronDownIcon size={14} />}
  </NumberFieldPrimitive.Decrement>
);

export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
};
