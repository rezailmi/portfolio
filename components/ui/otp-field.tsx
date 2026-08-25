"use client";

import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  input: {
    backgroundColor: colors.background,
    borderColor: colors.input,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: {
      ":focus": `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: "none",
    },
    color: colors.foreground,
    fontSize: "1rem",
    height: "2.5rem",
    lineHeight: "1.5rem",
    margin: 0,
    outline: "none",
    padding: 0,
    textAlign: "center",
    width: "2.5rem",
  },
  root: {
    display: "flex",
    gap: "0.5rem",
    width: "100%",
  },
});

const OTPField = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof OTPFieldPrimitive.Root>, "className"> & {
  className?: string;
}) => (
  <OTPFieldPrimitive.Root
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="otp-field"
    {...props}
  />
);

const OTPFieldInput = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof OTPFieldPrimitive.Input>, "className"> & {
  className?: string;
}) => (
  <OTPFieldPrimitive.Input
    {...stylex.props(
      styles.input,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="otp-field-input"
    {...props}
  />
);

export { OTPField, OTPFieldInput };
