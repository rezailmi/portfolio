"use client";

import { font, leading } from '@/lib/constants.stylex'

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

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
    paddingInline: "0.75rem",
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
    paddingInline: "0.5rem",
    position: "relative",
    userSelect: "none",
  },
  itemHighlighted: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
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
});

const hidden = (s: string | undefined) => s === "starting" || s === "ending";

const Autocomplete = (
  props: React.ComponentProps<typeof AutocompletePrimitive.Root>
) => <AutocompletePrimitive.Root data-slot="autocomplete" {...props} />;

const AutocompleteInput = ({
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof AutocompletePrimitive.Input>,
  "className"
> & {
  className?: string;
}) => (
  <AutocompletePrimitive.Input
    {...stylex.props(
      styles.input,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="autocomplete-input"
    {...props}
  />
);

const AutocompleteContent = ({
  className,
  style,
  sideOffset = 4,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof AutocompletePrimitive.Popup>,
  "className"
> & {
  className?: string;
  sideOffset?: number;
}) => (
  <AutocompletePrimitive.Portal>
    <AutocompletePrimitive.Positioner
      className={stylex.props(styles.positioner).className}
      side="bottom"
      sideOffset={sideOffset}
    >
      <AutocompletePrimitive.Popup
        className={(state) =>
          stylex.props(
            styles.popup,
            hidden(state.transitionStatus) && styles.popupHidden,
            customClassName(className)
          ).className
        }
        data-slot="autocomplete-content"
        style={style}
        {...props}
      >
        {children}
      </AutocompletePrimitive.Popup>
    </AutocompletePrimitive.Positioner>
  </AutocompletePrimitive.Portal>
);

const AutocompleteList = ({
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof AutocompletePrimitive.List>,
  "className"
> & {
  className?: string;
}) => (
  <AutocompletePrimitive.List
    {...stylex.props(
      styles.list,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="autocomplete-list"
    {...props}
  />
);

const AutocompleteItem = ({
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof AutocompletePrimitive.Item>,
  "className"
> & {
  className?: string;
}) => (
  <AutocompletePrimitive.Item
    className={(state) =>
      stylex.props(
        styles.item,
        state.highlighted && styles.itemHighlighted,
        customClassName(className)
      ).className
    }
    data-slot="autocomplete-item"
    style={style}
    {...props}
  />
);

const AutocompleteEmpty = ({
  className,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof AutocompletePrimitive.Empty>,
  "className"
> & {
  className?: string;
}) => (
  <AutocompletePrimitive.Empty
    {...stylex.props(
      styles.empty,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="autocomplete-empty"
    {...props}
  />
);

export {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
};
