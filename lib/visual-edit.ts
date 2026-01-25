// Type definitions and CSS parsing utilities for visual edit tool

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

export interface VisualEditState {
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

export function parsePropertyValue(value: string): CSSPropertyValue {
  const raw = value.trim()
  const match = raw.match(/^(-?\d*\.?\d+)(px|rem|%)?$/)

  if (match) {
    return {
      numericValue: parseFloat(match[1]),
      unit: (match[2] as CSSPropertyValue['unit']) || 'px',
      raw,
    }
  }

  // Default fallback for auto, inherit, etc.
  return {
    numericValue: 0,
    unit: 'px',
    raw,
  }
}

export function formatPropertyValue(value: CSSPropertyValue): string {
  if (value.raw === 'auto' || value.raw === 'inherit' || value.raw === 'initial') {
    return value.raw
  }
  return `${value.numericValue}${value.unit}`
}

export function getComputedStyles(element: HTMLElement): {
  spacing: SpacingProperties
  borderRadius: BorderRadiusProperties
  flex: FlexProperties
} {
  const computed = window.getComputedStyle(element)

  return {
    spacing: {
      paddingTop: parsePropertyValue(computed.paddingTop),
      paddingRight: parsePropertyValue(computed.paddingRight),
      paddingBottom: parsePropertyValue(computed.paddingBottom),
      paddingLeft: parsePropertyValue(computed.paddingLeft),
      marginTop: parsePropertyValue(computed.marginTop),
      marginRight: parsePropertyValue(computed.marginRight),
      marginBottom: parsePropertyValue(computed.marginBottom),
      marginLeft: parsePropertyValue(computed.marginLeft),
      gap: parsePropertyValue(computed.gap || '0px'),
    },
    borderRadius: {
      borderTopLeftRadius: parsePropertyValue(computed.borderTopLeftRadius),
      borderTopRightRadius: parsePropertyValue(computed.borderTopRightRadius),
      borderBottomRightRadius: parsePropertyValue(computed.borderBottomRightRadius),
      borderBottomLeftRadius: parsePropertyValue(computed.borderBottomLeftRadius),
    },
    flex: {
      display: computed.display,
      flexDirection: computed.flexDirection as FlexProperties['flexDirection'],
      justifyContent: computed.justifyContent,
      alignItems: computed.alignItems,
    },
  }
}

export function getOriginalInlineStyles(element: HTMLElement): Record<string, string> {
  const styles: Record<string, string> = {}
  const relevantProps = [
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'padding',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'margin',
    'gap',
    'border-radius',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'display',
    'flex-direction',
    'justify-content',
    'align-items',
  ]

  for (const prop of relevantProps) {
    const value = element.style.getPropertyValue(prop)
    if (value) {
      styles[prop] = value
    }
  }

  return styles
}

// Map of CSS property to Tailwind class prefix
const tailwindClassMap: Record<string, { prefix: string; scale: Record<number, string> }> = {
  'padding-top': {
    prefix: 'pt',
    scale: { 0: '0', 1: 'px', 2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8' },
  },
  'padding-right': {
    prefix: 'pr',
    scale: { 0: '0', 1: 'px', 2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8' },
  },
  'padding-bottom': {
    prefix: 'pb',
    scale: { 0: '0', 1: 'px', 2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8' },
  },
  'padding-left': {
    prefix: 'pl',
    scale: { 0: '0', 1: 'px', 2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8' },
  },
  'margin-top': {
    prefix: 'mt',
    scale: { 0: '0', 1: 'px', 2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8' },
  },
  'margin-right': {
    prefix: 'mr',
    scale: { 0: '0', 1: 'px', 2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8' },
  },
  'margin-bottom': {
    prefix: 'mb',
    scale: { 0: '0', 1: 'px', 2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8' },
  },
  'margin-left': {
    prefix: 'ml',
    scale: { 0: '0', 1: 'px', 2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8' },
  },
  gap: {
    prefix: 'gap',
    scale: { 0: '0', 1: 'px', 2: '0.5', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8' },
  },
  'border-radius': {
    prefix: 'rounded',
    scale: { 0: 'none', 2: 'sm', 4: '', 6: 'md', 8: 'lg', 12: 'xl', 16: '2xl', 24: '3xl', 9999: 'full' },
  },
  'border-top-left-radius': {
    prefix: 'rounded-tl',
    scale: { 0: 'none', 2: 'sm', 4: '', 6: 'md', 8: 'lg', 12: 'xl', 16: '2xl', 24: '3xl', 9999: 'full' },
  },
  'border-top-right-radius': {
    prefix: 'rounded-tr',
    scale: { 0: 'none', 2: 'sm', 4: '', 6: 'md', 8: 'lg', 12: 'xl', 16: '2xl', 24: '3xl', 9999: 'full' },
  },
  'border-bottom-right-radius': {
    prefix: 'rounded-br',
    scale: { 0: 'none', 2: 'sm', 4: '', 6: 'md', 8: 'lg', 12: 'xl', 16: '2xl', 24: '3xl', 9999: 'full' },
  },
  'border-bottom-left-radius': {
    prefix: 'rounded-bl',
    scale: { 0: 'none', 2: 'sm', 4: '', 6: 'md', 8: 'lg', 12: 'xl', 16: '2xl', 24: '3xl', 9999: 'full' },
  },
}

const flexDirectionMap: Record<string, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
}

const justifyContentMap: Record<string, string> = {
  'flex-start': 'justify-start',
  'flex-end': 'justify-end',
  center: 'justify-center',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
  'space-evenly': 'justify-evenly',
  start: 'justify-start',
  end: 'justify-end',
}

const alignItemsMap: Record<string, string> = {
  'flex-start': 'items-start',
  'flex-end': 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
  start: 'items-start',
  end: 'items-end',
}

function findClosestScale(value: number, scale: Record<number, string>): string {
  const keys = Object.keys(scale).map(Number).sort((a, b) => a - b)
  let closest = keys[0]

  for (const key of keys) {
    if (Math.abs(key - value) < Math.abs(closest - value)) {
      closest = key
    }
  }

  return scale[closest]
}

export function stylesToTailwind(styles: Record<string, string>): string {
  const classes: string[] = []

  for (const [prop, value] of Object.entries(styles)) {
    // Handle spacing properties
    if (tailwindClassMap[prop]) {
      const parsed = parsePropertyValue(value)
      if (parsed.unit === 'px') {
        const mapping = tailwindClassMap[prop]
        const scaleValue = findClosestScale(parsed.numericValue, mapping.scale)
        classes.push(`${mapping.prefix}-${scaleValue}`)
      } else {
        classes.push(`${tailwindClassMap[prop].prefix}-[${value}]`)
      }
      continue
    }

    // Handle flex properties
    if (prop === 'flex-direction' && flexDirectionMap[value]) {
      classes.push(flexDirectionMap[value])
      continue
    }

    if (prop === 'justify-content' && justifyContentMap[value]) {
      classes.push(justifyContentMap[value])
      continue
    }

    if (prop === 'align-items' && alignItemsMap[value]) {
      classes.push(alignItemsMap[value])
      continue
    }

    if (prop === 'display') {
      if (value === 'flex') classes.push('flex')
      else if (value === 'inline-flex') classes.push('inline-flex')
      else if (value === 'grid') classes.push('grid')
      else if (value === 'block') classes.push('block')
      else if (value === 'inline-block') classes.push('inline-block')
      else if (value === 'none') classes.push('hidden')
      continue
    }
  }

  return classes.join(' ')
}

// Mapping from camelCase property names to CSS kebab-case
export const propertyToCSSMap: Record<SpacingPropertyKey, string> = {
  paddingTop: 'padding-top',
  paddingRight: 'padding-right',
  paddingBottom: 'padding-bottom',
  paddingLeft: 'padding-left',
  marginTop: 'margin-top',
  marginRight: 'margin-right',
  marginBottom: 'margin-bottom',
  marginLeft: 'margin-left',
  gap: 'gap',
}

export const borderRadiusPropertyToCSSMap: Record<BorderRadiusPropertyKey, string> = {
  borderTopLeftRadius: 'border-top-left-radius',
  borderTopRightRadius: 'border-top-right-radius',
  borderBottomRightRadius: 'border-bottom-right-radius',
  borderBottomLeftRadius: 'border-bottom-left-radius',
}

export const flexPropertyToCSSMap: Record<FlexPropertyKey, string> = {
  display: 'display',
  flexDirection: 'flex-direction',
  justifyContent: 'justify-content',
  alignItems: 'align-items',
}

export function getElementInfo(element: HTMLElement): ElementInfo {
  const computed = window.getComputedStyle(element)
  const parentElement = element.parentElement

  // Check if element is a flex container
  const isFlexContainer = computed.display === 'flex' || computed.display === 'inline-flex'

  // Check if element is a flex item (parent is a flex container)
  let isFlexItem = false
  if (parentElement) {
    const parentComputed = window.getComputedStyle(parentElement)
    isFlexItem = parentComputed.display === 'flex' || parentComputed.display === 'inline-flex'
  }

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || null,
    classList: Array.from(element.classList),
    isFlexContainer,
    isFlexItem,
    parentElement,
  }
}

// Dimension display utilities for selection overlay

interface DimensionDisplay {
  width: string
  height: string
}

function isFitSizing(element: HTMLElement, dimension: 'width' | 'height'): boolean {
  const computed = window.getComputedStyle(element)
  const inlineValue = element.style[dimension]

  // Check if explicitly set to auto
  if (inlineValue === 'auto') return true

  // Check computed value patterns that indicate "fit" sizing
  const computedValue = computed[dimension]

  // If there's no explicit inline width/height and parent is flex, likely fit
  if (!inlineValue) {
    const parent = element.parentElement
    if (parent) {
      const parentComputed = window.getComputedStyle(parent)
      if (parentComputed.display === 'flex' || parentComputed.display === 'inline-flex') {
        // Flex items without explicit size are "fit"
        const flexBasis = computed.flexBasis
        const flexGrow = computed.flexGrow
        if (flexBasis === 'auto' && flexGrow === '0') {
          return true
        }
      }
    }

    // Check for common auto-sizing indicators
    if (dimension === 'width') {
      // Block elements without explicit width take 100% of parent
      if (computed.display === 'block' && !inlineValue) {
        return false // It's not "fit", it's full width
      }
      // Inline-block, flex, etc. without explicit width are "fit"
      if (
        computed.display === 'inline-block' ||
        computed.display === 'inline-flex' ||
        computed.display === 'inline'
      ) {
        return true
      }
    }

    if (dimension === 'height') {
      // Most elements without explicit height are content-fit
      return !inlineValue
    }
  }

  // Check for fit-content
  if (computedValue.includes('fit-content') || computedValue.includes('max-content')) {
    return true
  }

  return false
}

export function getDimensionDisplay(element: HTMLElement): DimensionDisplay {
  const rect = element.getBoundingClientRect()
  const width = Math.round(rect.width)
  const height = Math.round(rect.height)

  const widthIsFit = isFitSizing(element, 'width')
  const heightIsFit = isFitSizing(element, 'height')

  return {
    width: widthIsFit ? `Fit ${width}` : `${width}`,
    height: heightIsFit ? `Fit ${height}` : `${height}`,
  }
}
