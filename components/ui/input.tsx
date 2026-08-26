import { font, leading, mq } from '@/lib/constants.stylex'
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";


const styles = stylex.create({
  root: {
    "::file-selector-button": {
      backgroundColor: "transparent",
      borderStyle: "none",
      borderWidth: 0,
      color: colors.foreground,
      fontSize: font.sm,
      fontWeight: 500,
      marginInlineEnd: "0.5rem",
    },
    "::placeholder": {
      color: colors.mutedForeground,
    },
    "::selection": {
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
    backgroundColor: colors.background,
    borderColor: colors.input,
    borderRadius: radius.md,
    borderStyle: "solid",
    borderWidth: "1px",
    boxShadow: {
      ":focus-visible": `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: "none",
    },
    color: colors.foreground,
    cursor: { ":disabled": "not-allowed", default: "auto" },
    display: "flex",
    fontSize: { [mq.md]: font.sm, default: font.base },
    height: "2.5rem",
    lineHeight: { [mq.md]: leading.sm, default: leading.base },
    minWidth: 0,
    opacity: { ":disabled": 0.5, default: 1 },
    outline: "none",
    paddingBlock: "0.5rem",
    paddingInline: "0.75rem",
    width: "100%",
  },
});

const Input = ({
  className,
  style,
  type,
  ...props
}: React.ComponentProps<"input">) => (
  <input
    type={type}
    data-slot="input"
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    {...props}
  />
);

export { Input };
