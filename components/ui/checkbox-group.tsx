'use client'

import { space } from '@/lib/constants.stylex'

import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.sm,
  },
})

const CheckboxGroup = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof CheckboxGroupPrimitive>, 'className'> & {
  className?: string
}) => (
  <CheckboxGroupPrimitive
    {...stylex.props(styles.root, customClassName(className), style as StyleXStyles)}
    data-slot="checkbox-group"
    {...props}
  />
)

export { CheckboxGroup }
