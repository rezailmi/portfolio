"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";

import { colors } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  root: {
    alignItems: "center",
    backgroundColor: colors.input,
    borderColor: "transparent",
    borderRadius: "9999px",
    borderStyle: "solid",
    borderWidth: "2px",
    boxShadow: {
      ":focus-visible": `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: "none",
    },
    cursor: { ":disabled": "not-allowed", default: "pointer" },
    display: "inline-flex",
    flexShrink: 0,
    height: "1.5rem",
    opacity: { ":disabled": 0.5, default: 1 },
    outline: "none",
    padding: 0,
    position: "relative",
    transition: "background-color 0.15s ease-in-out",
    width: "2.75rem",
  },
  rootChecked: {
    backgroundColor: colors.primary,
  },
  rootSm: {
    height: "1.25rem",
    width: "2.25rem",
  },
  thumb: {
    backgroundColor: colors.background,
    borderRadius: "9999px",
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    display: "block",
    height: "1.25rem",
    pointerEvents: "none",
    transform: "translateX(0)",
    transition: "transform 0.15s ease-in-out",
    width: "1.25rem",
  },
  thumbChecked: {
    transform: "translateX(1.25rem)",
  },
  thumbSm: {
    height: "1rem",
    width: "1rem",
  },
  thumbSmChecked: {
    transform: "translateX(1rem)",
  },
});

const Switch = ({
  className,
  style,
  size = "default",
  ...props
}: Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, "className"> & {
  className?: string;
  size?: "default" | "sm";
}) => {
  const sm = size === "sm";
  return (
    <SwitchPrimitive.Root
      className={(state) =>
        stylex.props(
          styles.root,
          sm && styles.rootSm,
          state.checked && styles.rootChecked,
          customClassName(className)
        ).className
      }
      data-size={size}
      data-slot="switch"
      style={style}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={(state) => {
          const checkedThumb = sm ? styles.thumbSmChecked : styles.thumbChecked;
          return stylex.props(
            styles.thumb,
            sm && styles.thumbSm,
            state.checked && checkedThumb
          ).className;
        }}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
};

export { Switch };
