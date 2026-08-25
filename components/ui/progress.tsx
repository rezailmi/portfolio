"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  indicator: {
    backgroundColor: colors.primary,
    height: "100%",
    transition: "width 0.2s ease-out",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  root: {
    backgroundColor: colors.secondary,
    borderRadius: "9999px",
    height: "1rem",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  track: {
    height: "100%",
    width: "100%",
  },
  value: {
    color: colors.mutedForeground,
    fontSize: "0.875rem",
  },
});

const Progress = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "className"> & {
  className?: string;
}) => (
  <ProgressPrimitive.Root
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="progress"
    {...props}
  >
    <ProgressPrimitive.Track
      className={stylex.props(styles.track).className}
      data-slot="progress-track"
    >
      <ProgressPrimitive.Indicator
        className={stylex.props(styles.indicator).className}
        data-slot="progress-indicator"
      />
    </ProgressPrimitive.Track>
  </ProgressPrimitive.Root>
);

const ProgressLabel = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Label>, "className"> & {
  className?: string;
}) => (
  <ProgressPrimitive.Label
    {...stylex.props(
      styles.label,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="progress-label"
    {...props}
  />
);

const ProgressValue = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Value>, "className"> & {
  className?: string;
}) => (
  <ProgressPrimitive.Value
    {...stylex.props(
      styles.value,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="progress-value"
    {...props}
  />
);

export { Progress, ProgressLabel, ProgressValue };
