export interface ElementInfo {
  tagName: string
  id: string | null
  classList: string[]
  isFlexContainer: boolean
  isFlexItem: boolean
  parentElement: HTMLElement | null
}

export interface CSSPropertyValue {
  numericValue: number
  unit: 'px' | 'rem' | '%' | ''
  raw: string
}

export interface SpacingProperties {
  paddingTop: CSSPropertyValue
  paddingRight: CSSPropertyValue
  paddingBottom: CSSPropertyValue
  paddingLeft: CSSPropertyValue
  marginTop: CSSPropertyValue
  marginRight: CSSPropertyValue
  marginBottom: CSSPropertyValue
  marginLeft: CSSPropertyValue
  gap: CSSPropertyValue
}

export interface BorderRadiusProperties {
  borderTopLeftRadius: CSSPropertyValue
  borderTopRightRadius: CSSPropertyValue
  borderBottomRightRadius: CSSPropertyValue
  borderBottomLeftRadius: CSSPropertyValue
}

export interface FlexProperties {
  display: string
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  justifyContent: string
  alignItems: string
}

export interface DirectEditState {
  isOpen: boolean
  selectedElement: HTMLElement | null
  elementInfo: ElementInfo | null
  computedSpacing: SpacingProperties | null
  computedBorderRadius: BorderRadiusProperties | null
  computedFlex: FlexProperties | null
  originalStyles: Record<string, string>
  pendingStyles: Record<string, string>
  editModeActive: boolean
}

export type SpacingPropertyKey = keyof SpacingProperties
export type BorderRadiusPropertyKey = keyof BorderRadiusProperties
export type FlexPropertyKey = keyof FlexProperties
