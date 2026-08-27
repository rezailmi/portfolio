import type { StyleXStyles } from '@stylexjs/stylex'
import * as stylex from '@stylexjs/stylex'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import {
  alignItemsStyles,
  backgroundColorStyles,
  borderColorStyles,
  borderRadiusStyles,
  borderStyleStyles,
  borderWidthStyles,
  boxShadowStyles,
  colorStyles,
  columnGapStyles,
  displayStyles,
  flexDirectionStyles,
  flexStyles,
  flexWrapStyles,
  gapStyles,
  justifyContentStyles,
  marginBlockStyles,
  marginInlineStyles,
  marginStyles,
  paddingBlockStyles,
  paddingInlineStyles,
  paddingStyles,
  rowGapStyles,
  widthStyles,
} from '@/lib/box-styles'
import type {
  ColorToken,
  MarginToken,
  RadiusToken,
  ShadowToken,
  SpaceToken,
} from '@/lib/token-types'

export type BoxElement =
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'aside'
  | 'main'
  | 'nav'
  | 'header'
  | 'footer'
  | 'form'
  | 'fieldset'
  | 'label'
  | 'ul'
  | 'ol'
  | 'li'

export type DisplayToken = 'block' | 'flex' | 'inline-flex' | 'grid' | 'none' | 'contents'
export type FlexDirectionToken = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type FlexWrapToken = 'wrap' | 'nowrap' | 'wrap-reverse'
export type FlexToken = '1' | 'none' | 'auto'
export type AlignItemsToken = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
export type JustifyContentToken = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
export type BorderWidthToken = '0' | '1'
export type BorderStyleToken = 'solid' | 'dashed' | 'dotted' | 'none'
export type WidthToken = 'full'

export interface BoxStyleProps {
  display?: DisplayToken
  flexDirection?: FlexDirectionToken
  flexWrap?: FlexWrapToken
  flex?: FlexToken
  alignItems?: AlignItemsToken
  justifyContent?: JustifyContentToken
  gap?: SpaceToken
  rowGap?: SpaceToken
  columnGap?: SpaceToken
  padding?: SpaceToken
  paddingInline?: SpaceToken
  paddingBlock?: SpaceToken
  margin?: MarginToken
  marginInline?: MarginToken
  marginBlock?: MarginToken
  backgroundColor?: ColorToken
  color?: ColorToken
  borderColor?: ColorToken
  borderWidth?: BorderWidthToken
  borderStyle?: BorderStyleToken
  borderRadius?: RadiusToken
  boxShadow?: ShadowToken
  width?: WidthToken
}

const BOX_STYLE_PROP_MAP: Record<keyof BoxStyleProps, true> = {
  display: true,
  flexDirection: true,
  flexWrap: true,
  flex: true,
  alignItems: true,
  justifyContent: true,
  gap: true,
  rowGap: true,
  columnGap: true,
  padding: true,
  paddingInline: true,
  paddingBlock: true,
  margin: true,
  marginInline: true,
  marginBlock: true,
  backgroundColor: true,
  color: true,
  borderColor: true,
  borderWidth: true,
  borderStyle: true,
  borderRadius: true,
  boxShadow: true,
  width: true,
}

export const BOX_STYLE_PROP_KEYS = new Set(Object.keys(BOX_STYLE_PROP_MAP))

interface BoxOwnProps extends BoxStyleProps {
  as?: BoxElement
  style?: StyleXStyles
  children?: ReactNode
}

export type BoxProps<E extends BoxElement = 'div'> = BoxOwnProps &
  Omit<ComponentPropsWithoutRef<E>, keyof BoxOwnProps | 'className' | 'style'>

export function Box<E extends BoxElement = 'div'>({ as, style, children, ...rest }: BoxProps<E>) {
  const Component = (as ?? 'div') as ElementType
  const styleProps: BoxStyleProps = {}
  const domProps: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(rest)) {
    if (BOX_STYLE_PROP_KEYS.has(key)) {
      styleProps[key as keyof BoxStyleProps] = value as never
    } else {
      domProps[key] = value
    }
  }

  return (
    <Component
      {...stylex.props(
        styleProps.display && displayStyles[styleProps.display],
        styleProps.flexDirection && flexDirectionStyles[styleProps.flexDirection],
        styleProps.flexWrap && flexWrapStyles[styleProps.flexWrap],
        styleProps.flex && flexStyles[styleProps.flex],
        styleProps.alignItems && alignItemsStyles[styleProps.alignItems],
        styleProps.justifyContent && justifyContentStyles[styleProps.justifyContent],
        styleProps.gap && gapStyles[styleProps.gap],
        styleProps.rowGap && rowGapStyles[styleProps.rowGap],
        styleProps.columnGap && columnGapStyles[styleProps.columnGap],
        styleProps.padding && paddingStyles[styleProps.padding],
        styleProps.paddingInline && paddingInlineStyles[styleProps.paddingInline],
        styleProps.paddingBlock && paddingBlockStyles[styleProps.paddingBlock],
        styleProps.margin && marginStyles[styleProps.margin],
        styleProps.marginInline && marginInlineStyles[styleProps.marginInline],
        styleProps.marginBlock && marginBlockStyles[styleProps.marginBlock],
        styleProps.backgroundColor && backgroundColorStyles[styleProps.backgroundColor],
        styleProps.color && colorStyles[styleProps.color],
        styleProps.borderColor && borderColorStyles[styleProps.borderColor],
        styleProps.borderWidth && borderWidthStyles[styleProps.borderWidth],
        styleProps.borderStyle && borderStyleStyles[styleProps.borderStyle],
        styleProps.borderRadius && borderRadiusStyles[styleProps.borderRadius],
        styleProps.boxShadow && boxShadowStyles[styleProps.boxShadow],
        styleProps.width && widthStyles[styleProps.width],
        style
      )}
      {...domProps}
    >
      {children}
    </Component>
  )
}
