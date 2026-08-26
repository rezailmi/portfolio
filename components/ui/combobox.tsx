"use client";

import { font, leading } from '@/lib/constants.stylex'

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  empty: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    paddingBlock: "1.5rem",
    textAlign: "center",
  },
  input: {
    "::placeholder": { color: colors.mutedForeground },
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
    fontSize: font.sm,
    height: "2.5rem",
    lineHeight: leading.sm,
    outline: "none",
    paddingInlineEnd: "2rem",
    paddingInlineStart: "0.75rem",
    width: "100%",
  },
  inputWrap: {
    position: "relative",
    width: "16rem",
  },
  item: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: radius.sm,
    color: colors.popoverForeground,
    cursor: "default",
    display: "flex",
    fontSize: font.sm,
    lineHeight: leading.sm,
    outline: "none",
    paddingBlock: "0.375rem",
    paddingInlineEnd: "2rem",
    paddingInlineStart: "0.5rem",
    position: "relative",
    userSelect: "none",
  },
  itemHighlighted: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
  },
  itemIndicator: {
    alignItems: "center",
    display: "flex",
    height: "1rem",
    insetInlineEnd: "0.5rem",
    justifyContent: "center",
    position: "absolute",
    width: "1rem",
  },
  list: {
    overflowY: "auto",
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
    maxHeight: "min(20rem, var(--available-height, 20rem))",
    minWidth: "var(--anchor-width)",
    opacity: 1,
    outline: "none",
    overflowY: "auto",
    padding: "0.25rem",
    transformOrigin: "var(--transform-origin)",
    width: "var(--anchor-width)",
    zIndex: 50,
  },
  popupHidden: { opacity: 0 },
  positioner: {
    position: "fixed",
    zIndex: 99999,
  },
  trigger: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 0,
    color: colors.mutedForeground,
    cursor: "pointer",
    display: "inline-flex",
    insetInlineEnd: "0.5rem",
    justifyContent: "center",
    padding: 0,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  },
});

const hidden = (s: string | undefined) => s === "starting" || s === "ending";

const Combobox = (
  props: React.ComponentProps<typeof ComboboxPrimitive.Root>
) => <ComboboxPrimitive.Root data-slot="combobox" {...props} />;

const ComboboxInput = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxPrimitive.Input>, "className"> & {
  className?: string;
}) => {
  const wrap = stylex.props(styles.inputWrap);
  return (
    <div className={wrap.className} data-slot="combobox-input-wrap" style={wrap.style}>
      <ComboboxPrimitive.Input
        {...stylex.props(
          styles.input,
          customClassName(className),
          style as StyleXStyles
        )}
        data-slot="combobox-input"
        {...props}
      />
      <ComboboxPrimitive.Trigger
        className={stylex.props(styles.trigger).className}
        data-slot="combobox-trigger"
      >
        <ChevronsUpDownIcon size={16} />
      </ComboboxPrimitive.Trigger>
    </div>
  );
};

const ComboboxContent = ({
  className,
  style,
  sideOffset = 4,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxPrimitive.Popup>, "className"> & {
  className?: string;
  sideOffset?: number;
}) => (
  <ComboboxPrimitive.Portal>
    <ComboboxPrimitive.Positioner
      className={stylex.props(styles.positioner).className}
      side="bottom"
      sideOffset={sideOffset}
    >
      <ComboboxPrimitive.Popup
        className={(state) =>
          stylex.props(
            styles.popup,
            hidden(state.transitionStatus) && styles.popupHidden,
            customClassName(className)
          ).className
        }
        data-slot="combobox-content"
        style={style}
        {...props}
      >
        {children}
      </ComboboxPrimitive.Popup>
    </ComboboxPrimitive.Positioner>
  </ComboboxPrimitive.Portal>
);

const ComboboxList = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxPrimitive.List>, "className"> & {
  className?: string;
}) => (
  <ComboboxPrimitive.List
    {...stylex.props(
      styles.list,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="combobox-list"
    {...props}
  />
);

const ComboboxItem = ({
  className,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxPrimitive.Item>, "className"> & {
  className?: string;
}) => (
  <ComboboxPrimitive.Item
    className={(state) =>
      stylex.props(
        styles.item,
        state.highlighted && styles.itemHighlighted,
        customClassName(className)
      ).className
    }
    data-slot="combobox-item"
    style={style}
    {...props}
  >
    {children}
    <ComboboxPrimitive.ItemIndicator
      className={stylex.props(styles.itemIndicator).className}
    >
      <CheckIcon size={16} />
    </ComboboxPrimitive.ItemIndicator>
  </ComboboxPrimitive.Item>
);

const ComboboxEmpty = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxPrimitive.Empty>, "className"> & {
  className?: string;
}) => (
  <ComboboxPrimitive.Empty
    {...stylex.props(
      styles.empty,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="combobox-empty"
    {...props}
  />
);

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
};
