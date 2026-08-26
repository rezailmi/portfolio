"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext } from "react";

import { customClassName } from "@/lib/utils.stylex";
import { toggleStyles } from "@/components/ui/toggle";

const styles = stylex.create({
  group: {
    alignItems: "center",
    display: "flex",
    gap: "0.25rem",
    justifyContent: "center",
  },
});

type ToggleGroupVariant = "default" | "outline";
type ToggleGroupSize = "default" | "sm" | "lg";

const ToggleGroupContext = createContext<{
  variant: ToggleGroupVariant;
  size: ToggleGroupSize;
}>({ size: "default", variant: "default" });

const sizeStyles = {
  default: toggleStyles.sizeDefault,
  lg: toggleStyles.sizeLg,
  sm: toggleStyles.sizeSm,
};

const ToggleGroup = ({
  className,
  style,
  variant = "default",
  size = "default",
  orientation = "horizontal",
  ...props
}: Omit<React.ComponentProps<typeof ToggleGroupPrimitive>, "className"> & {
  className?: string;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
}) => (
  <ToggleGroupContext.Provider value={{ size, variant }}>
    <ToggleGroupPrimitive
      {...stylex.props(
        styles.group,
        customClassName(className),
        {
          flexDirection: orientation === "vertical" ? "column" : "row",
        } as StyleXStyles,
        style as StyleXStyles
      )}
      data-slot="toggle-group"
      data-variant={variant}
      orientation={orientation}
      {...props}
    />
  </ToggleGroupContext.Provider>
);

const ToggleGroupItem = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof TogglePrimitive>, "className"> & {
  className?: string;
}) => {
  const { variant, size } = useContext(ToggleGroupContext);
  return (
    <TogglePrimitive
      className={(state) =>
        stylex.props(
          toggleStyles.base,
          variant === "outline" ? toggleStyles.outline : toggleStyles.default,
          sizeStyles[size],
          state.pressed && toggleStyles.pressed,
          customClassName(className)
        ).className
      }
      data-slot="toggle-group-item"
      style={style}
      {...props}
    />
  );
};

export { ToggleGroup, ToggleGroupItem };
