'use client'

import { font, leading, weight } from '@/lib/constants.stylex'

import { Field as FieldPrimitive } from '@base-ui/react/field'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { colors } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  description: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
  error: {
    color: colors.destructive,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
  label: {
    color: colors.foreground,
    fontSize: font.sm,
    fontWeight: weight.medium,
    lineHeight: 1,
  },
})

const FieldRoot = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof FieldPrimitive.Root>, 'className'> & {
  className?: string
}) => (
  <FieldPrimitive.Root
    {...stylex.props(customClassName(className), style as StyleXStyles)}
    data-slot="field"
    {...props}
  />
)

const FieldLabel = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof FieldPrimitive.Label>, 'className'> & {
  className?: string
}) => (
  <FieldPrimitive.Label
    {...stylex.props(styles.label, customClassName(className), style as StyleXStyles)}
    data-slot="field-label"
    {...props}
  />
)

const FieldDescription = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof FieldPrimitive.Description>, 'className'> & {
  className?: string
}) => (
  <FieldPrimitive.Description
    {...stylex.props(styles.description, customClassName(className), style as StyleXStyles)}
    data-slot="field-description"
    {...props}
  />
)

const FieldError = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof FieldPrimitive.Error>, 'className'> & {
  className?: string
}) => (
  <FieldPrimitive.Error
    {...stylex.props(styles.error, customClassName(className), style as StyleXStyles)}
    data-slot="field-error"
    {...props}
  />
)

const FieldControl = FieldPrimitive.Control
const FieldValidity = FieldPrimitive.Validity
const FieldItem = FieldPrimitive.Item

const Field = Object.assign(FieldRoot, {
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
  Item: FieldItem,
  Label: FieldLabel,
  Root: FieldRoot,
  Validity: FieldValidity,
})

export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldRoot,
  FieldValidity,
}
