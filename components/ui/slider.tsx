"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  control: {
    alignItems: "center",
    display: "flex",
    paddingBlock: "0.75rem",
    touchAction: "none",
    userSelect: "none",
    width: "100%",
  },
  indicator: {
    backgroundColor: colors.primary,
    borderRadius: "9999px",
    height: "100%",
  },
  root: {
    position: "relative",
    width: "100%",
  },
  thumb: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderRadius: "9999px",
    borderStyle: "solid",
    borderWidth: "2px",
    boxShadow: {
      ":focus-visible": `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: "none",
    },
    height: "1.25rem",
    outline: "none",
    width: "1.25rem",
  },
  track: {
    backgroundColor: colors.secondary,
    borderRadius: "9999px",
    height: "0.5rem",
    position: "relative",
    width: "100%",
  },
});

const Slider = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof SliderPrimitive.Root>, "className"> & {
  className?: string;
}) => (
  <SliderPrimitive.Root
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="slider"
    {...props}
  >
    <SliderPrimitive.Control
      className={stylex.props(styles.control).className}
      data-slot="slider-control"
    >
      <SliderPrimitive.Track
        className={stylex.props(styles.track).className}
        data-slot="slider-track"
      >
        <SliderPrimitive.Indicator
          className={stylex.props(styles.indicator).className}
          data-slot="slider-indicator"
        />
        <SliderPrimitive.Thumb
          className={stylex.props(styles.thumb).className}
          data-slot="slider-thumb"
        />
      </SliderPrimitive.Track>
    </SliderPrimitive.Control>
  </SliderPrimitive.Root>
);

export { Slider };
