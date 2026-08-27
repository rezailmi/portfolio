'use client'

import { space, shadow } from '@/lib/constants.stylex'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { colors, radius } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  group: {
    display: 'grid',
    gap: space.sm,
  },
  indicator: {
    backgroundColor: colors.primaryForeground,
    borderRadius: radius.full,
    height: '0.5rem',
    width: '0.5rem',
  },
  item: {
    alignItems: 'center',
    aspectRatio: '1 / 1',
    backgroundColor: 'transparent',
    borderColor: colors.input,
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: {
      ':focus-visible': `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: shadow.none,
    },
    color: colors.primary,
    cursor: { ':disabled': 'not-allowed', default: 'pointer' },
    display: 'flex',
    flexShrink: 0,
    height: '1rem',
    justifyContent: 'center',
    opacity: { ':disabled': 0.5, default: 1 },
    outline: 'none',
    padding: 0,
    width: '1rem',
  },
  itemChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
})

const RadioGroup = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof RadioGroupPrimitive>, 'className'> & {
  className?: string
}) => (
  <RadioGroupPrimitive
    {...stylex.props(styles.group, customClassName(className), style as StyleXStyles)}
    data-slot="radio-group"
    {...props}
  />
)

const RadioGroupItem = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof RadioPrimitive.Root>, 'className'> & {
  className?: string
}) => (
  <RadioPrimitive.Root
    className={(state) =>
      stylex.props(styles.item, state.checked && styles.itemChecked, customClassName(className))
        .className
    }
    data-slot="radio-group-item"
    style={style}
    {...props}
  >
    <RadioPrimitive.Indicator
      className={stylex.props(styles.indicator).className}
      data-slot="radio-group-indicator"
    />
  </RadioPrimitive.Root>
)

export { RadioGroup, RadioGroupItem }
