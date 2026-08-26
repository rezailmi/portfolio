"use client";

import { font } from '@/lib/constants.stylex'

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
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
  trigger: {
    alignItems: "center",
    backgroundColor: {
      ":focus-visible": colors.accent,
      ":hover": colors.accent,
      default: "transparent",
    },
    borderRadius: radius.sm,
    borderWidth: 0,
    color: colors.foreground,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: font.sm,
    height: "2rem",
    justifyContent: "center",
    outline: "none",
    paddingInline: "0.75rem",
    userSelect: "none",
  },
});

const Menubar = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof MenubarPrimitive>, "className"> & {
  className?: string;
}) => (
  <MenubarPrimitive
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="menubar"
    {...props}
  />
);

const MenubarMenu = (props: React.ComponentProps<typeof MenuPrimitive.Root>) => (
  <MenuPrimitive.Root data-slot="menubar-menu" {...props} />
);

const MenubarTrigger = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof MenuPrimitive.Trigger>, "className"> & {
  className?: string;
}) => (
  <MenuPrimitive.Trigger
    {...stylex.props(
      styles.trigger,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="menubar-trigger"
    {...props}
  />
);

export { Menubar, MenubarMenu, MenubarTrigger };
