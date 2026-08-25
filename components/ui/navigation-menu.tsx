"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { ChevronDownIcon } from "lucide-react";

import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  content: {
    padding: "0.5rem",
    width: "16rem",
  },
  icon: {
    height: "1rem",
    width: "1rem",
  },
  link: {
    backgroundColor: { ":hover": colors.accent, default: "transparent" },
    borderRadius: radius.sm,
    color: colors.foreground,
    display: "block",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    paddingBlock: "0.5rem",
    paddingInline: "0.5rem",
    textDecorationLine: "none",
  },
  list: {
    alignItems: "center",
    display: "flex",
    gap: "0.25rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  popup: {
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    color: colors.popoverForeground,
    height: "var(--popup-height)",
    outline: "none",
    overflow: "hidden",
    width: "var(--popup-width)",
  },
  positioner: {
    position: "fixed",
    zIndex: 99999,
  },
  root: {
    position: "relative",
  },
  trigger: {
    alignItems: "center",
    backgroundColor: {
      ":hover": colors.accent,
      default: "transparent",
    },
    borderRadius: radius.sm,
    borderWidth: 0,
    color: colors.foreground,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "0.875rem",
    gap: "0.375rem",
    height: "2rem",
    justifyContent: "center",
    outline: "none",
    paddingInline: "0.75rem",
    textDecorationLine: "none",
    userSelect: "none",
  },
  viewport: {
    height: "100%",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
});

const NavigationMenu = ({
  className,
  style,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof NavigationMenuPrimitive.Root>,
  "className"
> & {
  className?: string;
}) => (
  <NavigationMenuPrimitive.Root
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="navigation-menu"
    {...props}
  >
    {children}
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        className={stylex.props(styles.positioner).className}
        collisionPadding={{ bottom: 5, left: 20, right: 20, top: 5 }}
        sideOffset={8}
      >
        <NavigationMenuPrimitive.Popup
          className={stylex.props(styles.popup).className}
          data-slot="navigation-menu-popup"
        >
          <NavigationMenuPrimitive.Viewport
            className={stylex.props(styles.viewport).className}
          />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  </NavigationMenuPrimitive.Root>
);

const NavigationMenuList = ({
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof NavigationMenuPrimitive.List>,
  "className"
> & {
  className?: string;
}) => (
  <NavigationMenuPrimitive.List
    {...stylex.props(
      styles.list,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="navigation-menu-list"
    {...props}
  />
);

const NavigationMenuItem = (
  props: React.ComponentProps<typeof NavigationMenuPrimitive.Item>
) => <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" {...props} />;

const NavigationMenuTrigger = ({
  className,
  style,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>,
  "className"
> & {
  className?: string;
}) => (
  <NavigationMenuPrimitive.Trigger
    {...stylex.props(
      styles.trigger,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="navigation-menu-trigger"
    {...props}
  >
    {children}
    <NavigationMenuPrimitive.Icon className={stylex.props(styles.icon).className}>
      <ChevronDownIcon size={16} />
    </NavigationMenuPrimitive.Icon>
  </NavigationMenuPrimitive.Trigger>
);

const NavigationMenuContent = ({
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof NavigationMenuPrimitive.Content>,
  "className"
> & {
  className?: string;
}) => (
  <NavigationMenuPrimitive.Content
    {...stylex.props(
      styles.content,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="navigation-menu-content"
    {...props}
  />
);

const NavigationMenuLink = ({
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof NavigationMenuPrimitive.Link>,
  "className"
> & {
  className?: string;
}) => (
  <NavigationMenuPrimitive.Link
    {...stylex.props(
      styles.link,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="navigation-menu-link"
    {...props}
  />
);

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
};
