"use client";

import { font, leading } from '@/lib/constants.stylex'

import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  indicator: {
    backgroundColor: colors.primary,
    height: "100%",
  },
  label: {
    fontSize: font.sm,
    fontWeight: 500,
    lineHeight: leading.sm,
  },
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
  },
  track: {
    backgroundColor: colors.secondary,
    borderRadius: "9999px",
    height: "1rem",
    overflow: "hidden",
    width: "100%",
  },
  value: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
});

const Meter = ({
  className,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof MeterPrimitive.Root>, "className"> & {
  className?: string;
}) => (
  <MeterPrimitive.Root
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="meter"
    {...props}
  >
    {children}
    <MeterPrimitive.Track
      className={stylex.props(styles.track).className}
      data-slot="meter-track"
    >
      <MeterPrimitive.Indicator
        className={stylex.props(styles.indicator).className}
        data-slot="meter-indicator"
      />
    </MeterPrimitive.Track>
  </MeterPrimitive.Root>
);

const MeterLabel = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof MeterPrimitive.Label>, "className"> & {
  className?: string;
}) => (
  <MeterPrimitive.Label
    {...stylex.props(
      styles.label,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="meter-label"
    {...props}
  />
);

const MeterValue = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof MeterPrimitive.Value>, "className"> & {
  className?: string;
}) => (
  <MeterPrimitive.Value
    {...stylex.props(
      styles.value,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="meter-value"
    {...props}
  />
);

const MeterRow = ({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    {...stylex.props(
      styles.row,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="meter-row"
    {...props}
  />
);

export { Meter, MeterLabel, MeterRow, MeterValue };
