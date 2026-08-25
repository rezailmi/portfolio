"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext } from "react";

import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  list: {
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    color: colors.mutedForeground,
    display: "inline-flex",
    height: "2.5rem",
    justifyContent: "center",
    padding: "0.25rem",
    width: "fit-content",
  },
  listLine: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.border}`,
    color: colors.mutedForeground,
    display: "inline-flex",
    gap: "0.25rem",
    justifyContent: "center",
    padding: 0,
    width: "fit-content",
  },
  panel: {
    flex: 1,
    outline: "none",
  },
  root: {
    display: "flex",
    flexDirection: "column",
  },
  trigger: {
    alignItems: "center",
    background: "transparent",
    borderRadius: radius.sm,
    borderWidth: 0,
    boxShadow: {
      ":focus-visible": `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: null,
    },
    color: colors.mutedForeground,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "0.875rem",
    fontWeight: 500,
    justifyContent: "center",
    lineHeight: "1.25rem",
    outline: "none",
    paddingBlock: "0.375rem",
    paddingInline: "0.75rem",
    transition: "color 0.15s ease-out, background-color 0.15s ease-out, box-shadow 0.15s ease-out",
    whiteSpace: "nowrap",
  },
  triggerActive: {
    backgroundColor: colors.background,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    color: colors.foreground,
  },
  triggerLine: {
    borderBottom: "2px solid transparent",
    borderRadius: 0,
    flex: "0 0 auto",
    marginBottom: "-1px",
  },
  triggerLineActive: {
    borderBottomColor: colors.foreground,
    color: colors.foreground,
  },
});

const TabsListContext = createContext<"default" | "line">("default");

const Tabs = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof TabsPrimitive.Root>, "className"> & {
  className?: string;
}) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    {...props}
  />
);

const TabsList = ({
  className,
  style,
  variant = "default",
  ...props
}: Omit<React.ComponentProps<typeof TabsPrimitive.List>, "className"> & {
  className?: string;
  variant?: "default" | "line";
}) => (
  <TabsListContext.Provider value={variant}>
    <TabsPrimitive.List
      {...stylex.props(
        variant === "line" ? styles.listLine : styles.list,
        customClassName(className),
        style as StyleXStyles
      )}
      data-slot="tabs-list"
      data-variant={variant}
      {...props}
    />
  </TabsListContext.Provider>
);

const TabsTrigger = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof TabsPrimitive.Tab>, "className"> & {
  className?: string;
}) => {
  const variant = useContext(TabsListContext);
  const line = variant === "line";
  const activeStyle = line ? styles.triggerLineActive : styles.triggerActive;
  return (
    <TabsPrimitive.Tab
      className={(state) =>
        stylex.props(
          styles.trigger,
          line && styles.triggerLine,
          state.active && activeStyle,
          customClassName(className)
        ).className
      }
      data-slot="tabs-trigger"
      style={style}
      {...props}
    />
  );
};

const TabsContent = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof TabsPrimitive.Panel>, "className"> & {
  className?: string;
}) => (
  <TabsPrimitive.Panel
    data-slot="tabs-content"
    {...stylex.props(
      styles.panel,
      customClassName(className),
      style as StyleXStyles
    )}
    {...props}
  />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
