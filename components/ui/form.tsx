"use client";

import { Form as FormPrimitive } from "@base-ui/react/form";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { customClassName } from "@/lib/utils.stylex";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "16rem",
    width: "100%",
  },
});

const Form = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof FormPrimitive>, "className"> & {
  className?: string;
}) => (
  <FormPrimitive
    {...stylex.props(
      styles.root,
      customClassName(className),
      style as StyleXStyles
    )}
    data-slot="form"
    {...props}
  />
);

export { Form };
