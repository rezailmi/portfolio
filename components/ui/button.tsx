"use client";

import { useRender } from "@base-ui/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { font, leading } from "@/lib/constants.stylex";
import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  base: {
    alignItems: "center",
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: 0,
    cursor: { ":disabled": "not-allowed", default: "pointer" },
    display: "inline-flex",
    flexShrink: 0,
    fontSize: font.sm,
    fontWeight: 500,
    gap: "0.5rem",
    justifyContent: "center",
    lineHeight: leading.sm,
    opacity: { ":disabled": 0.5, default: 1 },
    outline: "none",
    pointerEvents: { ":disabled": "none", default: null },
    transform: { ":active": "scale(0.97)", default: "none" },
    transition:
      "color 160ms ease-out, background-color 160ms ease-out, border-color 160ms ease-out, transform 160ms ease-out",
    whiteSpace: "nowrap",
  },
  default: {
    backgroundColor: {
      ":hover": `color-mix(in oklab, ${colors.primary} 90%, transparent)`,
      default: colors.primary,
    },
    color: colors.primaryForeground,
  },
  destructive: {
    backgroundColor: {
      ":hover": `color-mix(in oklab, ${colors.destructive} 90%, transparent)`,
      default: colors.destructive,
    },
    color: colors.primaryForeground,
  },
  focusable: {
    boxShadow: {
      ":focus-visible": `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: null,
    },
  },
  ghost: {
    backgroundColor: { ":hover": colors.accent, default: "transparent" },
    color: { ":hover": colors.accentForeground, default: colors.foreground },
  },
  link: {
    backgroundColor: "transparent",
    color: colors.primary,
    textDecorationLine: { ":hover": "underline", default: "none" },
    textUnderlineOffset: "4px",
    transform: { ":active": "none", default: "none" },
  },
  outline: {
    backgroundColor: {
      ":hover": colors.accent,
      default: colors.background,
    },
    borderColor: colors.input,
    borderWidth: "1px",
    color: { ":hover": colors.accentForeground, default: colors.foreground },
  },
  secondary: {
    backgroundColor: {
      ":hover": `color-mix(in oklab, ${colors.secondary} 80%, transparent)`,
      default: colors.secondary,
    },
    color: colors.secondaryForeground,
  },
  sizeDefault: { height: "2.5rem", paddingBlock: "0.5rem", paddingInline: "1rem" },
  sizeIcon: {
    height: "2.5rem",
    paddingInline: 0,
    width: "2.5rem",
  },
  sizeIconLg: {
    height: "2.5rem",
    paddingInline: 0,
    width: "2.5rem",
  },
  sizeIconSm: {
    height: "2rem",
    paddingInline: 0,
    width: "2rem",
  },
  sizeLg: { height: "2.75rem", paddingInline: "2rem" },
  sizeSm: {
    height: "2.25rem",
    paddingInline: "0.75rem",
  },
});

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";

const variantStyles: Record<ButtonVariant, StyleXStyles> = {
  default: styles.default,
  destructive: styles.destructive,
  ghost: styles.ghost,
  link: styles.link,
  outline: styles.outline,
  secondary: styles.secondary,
};

const sizeStyles: Record<ButtonSize, StyleXStyles> = {
  default: styles.sizeDefault,
  icon: styles.sizeIcon,
  "icon-lg": styles.sizeIconLg,
  "icon-sm": styles.sizeIconSm,
  lg: styles.sizeLg,
  sm: styles.sizeSm,
};

export interface ButtonProps extends Omit<
  React.ComponentProps<"button">,
  "className"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Render as a different element (Base UI render API). */
  render?: useRender.RenderProp;
}

const Button = ({
  className,
  style,
  variant = "default",
  size = "default",
  render,
  ...props
}: ButtonProps) =>
  useRender({
    props: {
      ...stylex.props(
        styles.base,
        styles.focusable,
        variantStyles[variant],
        sizeStyles[size],
        customClassName(className),
        style as StyleXStyles
      ),
      "data-size": size,
      "data-slot": "button",
      "data-variant": variant,
      ...props,
    },
    render: render ?? <button type="button" />,
  });

export { Button };
