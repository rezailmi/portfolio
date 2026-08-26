"use client";

import { font, leading } from '@/lib/constants.stylex'

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as stylex from "@stylexjs/stylex";

import { colors, radius } from "@/lib/tokens.stylex";
import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  popup: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    color: colors.primaryForeground,
    fontSize: font.xs,
    lineHeight: leading.xs,
    maxWidth: "20rem",
    opacity: 1,
    outline: "none",
    overflow: "hidden",
    paddingBottom: "0.375rem",
    paddingInline: "0.75rem",
    paddingTop: "0.375rem",
    textAlign: "center",
    textWrap: "balance",
    transform: "scale(1)",
    transformOrigin: "var(--transform-origin)",
    transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
    width: "fit-content",
  },
  popupHidden: {
    opacity: 0,
    transform: "scale(0.95)",
  },
  positioner: {
    position: "fixed",
    zIndex: 99999,
  },
});

const hidden = (s: string | undefined) => s === "starting" || s === "ending";

const TooltipProvider = (
  props: React.ComponentProps<typeof TooltipPrimitive.Provider>
) => <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />;

const Tooltip = (props: React.ComponentProps<typeof TooltipPrimitive.Root>) => (
  <TooltipProvider>
    <TooltipPrimitive.Root data-slot="tooltip" {...props} />
  </TooltipProvider>
);

const TooltipTrigger = (
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>
) => <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;

const TooltipContent = ({
  className,
  style,
  sideOffset = 8,
  side = "top",
  align = "center",
  children,
  ...props
}: Omit<React.ComponentProps<typeof TooltipPrimitive.Popup>, "className"> & {
  className?: string;
  sideOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}) => {
  const positioner = stylex.props(styles.positioner);
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        className={positioner.className}
        side={side}
        sideOffset={sideOffset}
        style={positioner.style}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={(state) =>
            stylex.props(
              styles.popup,
              hidden(state.transitionStatus) && styles.popupHidden,
              customClassName(className)
            ).className
          }
          style={style}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
};

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
