import type { StyleXStyles } from '@stylexjs/stylex'
import * as stylex from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { colorStyles } from '@/lib/box-styles'
import { font, leading, tracking, weight } from '@/lib/constants.stylex'
import type { ColorToken } from '@/lib/token-types'
import { colors } from '@/lib/tokens.stylex'

export type TextElement = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'time'
export type TextVariant = 'title' | 'listTitle' | 'body' | 'muted'

const styles = stylex.create({
  title: {
    fontSize: font.base,
    fontWeight: weight.medium,
    lineHeight: leading.base,
  },
  listTitle: {
    fontSize: font.xl,
    fontWeight: weight.medium,
    letterSpacing: tracking.tight,
    lineHeight: leading.lg,
  },
  body: {
    fontSize: font.base,
    lineHeight: leading.base,
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
})

interface TextOwnProps {
  as?: TextElement
  variant?: TextVariant
  color?: ColorToken
  style?: StyleXStyles
  children?: ReactNode
}

export type TextProps<E extends TextElement = 'p'> = TextOwnProps &
  Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps | 'className' | 'style'>

export function Text<E extends TextElement = 'p'>({
  as,
  variant = 'body',
  color,
  style,
  children,
  ...props
}: TextProps<E>) {
  const Component = (as ?? 'p') as ElementType

  return (
    <Component {...stylex.props(styles[variant], color && colorStyles[color], style)} {...props}>
      {children}
    </Component>
  )
}
