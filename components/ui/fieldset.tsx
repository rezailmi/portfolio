'use client'

import { font, leading, space, weight } from '@/lib/constants.stylex'

import { Fieldset as FieldsetPrimitive } from '@base-ui/react/fieldset'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { colors } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  legend: {
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    color: colors.foreground,
    fontSize: font.sm,
    fontWeight: weight.semibold,
    lineHeight: leading.sm,
    paddingBottom: space.sm,
    width: '100%',
  },
  root: {
    borderWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: space.lg,
    margin: 0,
    maxWidth: '16rem',
    minWidth: 0,
    padding: 0,
    width: '100%',
  },
})

const FieldsetRoot = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof FieldsetPrimitive.Root>, 'className'> & {
  className?: string
}) => (
  <FieldsetPrimitive.Root
    {...stylex.props(styles.root, customClassName(className), style as StyleXStyles)}
    data-slot="fieldset"
    {...props}
  />
)

const FieldsetLegend = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof FieldsetPrimitive.Legend>, 'className'> & {
  className?: string
}) => (
  <FieldsetPrimitive.Legend
    {...stylex.props(styles.legend, customClassName(className), style as StyleXStyles)}
    data-slot="fieldset-legend"
    {...props}
  />
)

const Fieldset = Object.assign(FieldsetRoot, {
  Legend: FieldsetLegend,
  Root: FieldsetRoot,
})

export { Fieldset, FieldsetLegend, FieldsetRoot }
