import type {
  CSSPropertyValue,
  SpacingProperties,
  BorderRadiusProperties,
  FlexProperties,
  SizingProperties,
  SizingValue,
  SizingMode,
  SpacingPropertyKey,
  BorderRadiusPropertyKey,
  FlexPropertyKey,
  SizingPropertyKey,
  ElementInfo,
} from './types'

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
    'width',
    'height',
  ]

  for (const prop of relevantProps) {
    const value = element.style.getPropertyValue(prop)
    if (value) {
      styles[prop] = value
    }
  }

  return styles
}

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

    if (prop === 'width') {
      if (value === '100%') classes.push('w-full')
      else if (value === 'fit-content') classes.push('w-fit')
      else if (value === 'auto') classes.push('w-auto')
      else classes.push(`w-[${value}]`)
      continue
    }

    if (prop === 'height') {
      if (value === '100%') classes.push('h-full')
      else if (value === 'fit-content') classes.push('h-fit')
      else if (value === 'auto') classes.push('h-auto')
      else classes.push(`h-[${value}]`)
      continue
    }
  }

  return classes.join(' ')
}

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

export const sizingPropertyToCSSMap: Record<SizingPropertyKey, string> = {
  width: 'width',
  height: 'height',
}

export function detectSizingMode(
  element: HTMLElement,
  dimension: 'width' | 'height'
): SizingMode {
  const computed = window.getComputedStyle(element)
  const inlineValue = element.style[dimension]

  if (inlineValue === '100%') return 'fill'
  if (inlineValue === 'auto' || inlineValue === 'fit-content') return 'fit'

  const computedValue = computed[dimension]

  if (computedValue === '100%') return 'fill'
  if (
    computedValue === 'auto' ||
    computedValue === 'fit-content' ||
    computedValue === 'max-content'
  ) {
    return 'fit'
  }

  const parent = element.parentElement
  if (parent) {
    const parentComputed = window.getComputedStyle(parent)
    if (parentComputed.display === 'flex' || parentComputed.display === 'inline-flex') {
      const flexGrow = computed.flexGrow
      if (flexGrow !== '0') {
        return 'fill'
      }
    }
  }

  if (dimension === 'width') {
    if (computed.display === 'block' && !inlineValue) {
      return 'fill'
    }
    if (
      computed.display === 'inline-block' ||
      computed.display === 'inline-flex' ||
      computed.display === 'inline'
    ) {
      return 'fit'
    }
  }

  if (dimension === 'height') {
    if (!inlineValue) {
      return 'fit'
    }
  }

  return 'fixed'
}

export function getSizingValue(element: HTMLElement, dimension: 'width' | 'height'): SizingValue {
  const mode = detectSizingMode(element, dimension)
  const rect = element.getBoundingClientRect()
  const numericValue = Math.round(dimension === 'width' ? rect.width : rect.height)

  return {
    mode,
    value: {
      numericValue,
      unit: 'px',
      raw: `${numericValue}px`,
    },
  }
}

export function getComputedSizing(element: HTMLElement): SizingProperties {
  return {
    width: getSizingValue(element, 'width'),
    height: getSizingValue(element, 'height'),
  }
}

export function sizingValueToCSS(sizing: SizingValue): string {
  switch (sizing.mode) {
    case 'fill':
      return '100%'
    case 'fit':
      return 'fit-content'
    case 'fixed':
      return `${sizing.value.numericValue}${sizing.value.unit}`
  }
}

export function sizingToTailwind(dimension: 'width' | 'height', sizing: SizingValue): string {
  const prefix = dimension === 'width' ? 'w' : 'h'

  switch (sizing.mode) {
    case 'fill':
      return `${prefix}-full`
    case 'fit':
      return `${prefix}-fit`
    case 'fixed':
      return `${prefix}-[${sizing.value.numericValue}${sizing.value.unit}]`
  }
}

export function getElementInfo(element: HTMLElement): ElementInfo {
  const computed = window.getComputedStyle(element)
  const parentElement = element.parentElement

  const isFlexContainer = computed.display === 'flex' || computed.display === 'inline-flex'

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

interface DimensionDisplay {
  width: string
  height: string
}

function isFitSizing(element: HTMLElement, dimension: 'width' | 'height'): boolean {
  const computed = window.getComputedStyle(element)
  const inlineValue = element.style[dimension]

  if (inlineValue === 'auto') return true

  const computedValue = computed[dimension]

  if (!inlineValue) {
    const parent = element.parentElement
    if (parent) {
      const parentComputed = window.getComputedStyle(parent)
      if (parentComputed.display === 'flex' || parentComputed.display === 'inline-flex') {
        const flexBasis = computed.flexBasis
        const flexGrow = computed.flexGrow
        if (flexBasis === 'auto' && flexGrow === '0') {
          return true
        }
      }
    }

    if (dimension === 'width') {
      if (computed.display === 'block' && !inlineValue) {
        return false
      }
      if (
        computed.display === 'inline-block' ||
        computed.display === 'inline-flex' ||
        computed.display === 'inline'
      ) {
        return true
      }
    }

    if (dimension === 'height') {
      return !inlineValue
    }
  }

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

// Measurement calculation utilities

import type { MeasurementLine } from './types'

export function calculateParentMeasurements(element: HTMLElement): MeasurementLine[] {
  const parent = element.parentElement
  if (!parent) return []

  const elementRect = element.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()
  const parentStyles = window.getComputedStyle(parent)

  // Account for parent padding
  const parentPaddingTop = parseFloat(parentStyles.paddingTop) || 0
  const parentPaddingRight = parseFloat(parentStyles.paddingRight) || 0
  const parentPaddingBottom = parseFloat(parentStyles.paddingBottom) || 0
  const parentPaddingLeft = parseFloat(parentStyles.paddingLeft) || 0

  const parentInnerLeft = parentRect.left + parentPaddingLeft
  const parentInnerTop = parentRect.top + parentPaddingTop
  const parentInnerRight = parentRect.right - parentPaddingRight
  const parentInnerBottom = parentRect.bottom - parentPaddingBottom

  const measurements: MeasurementLine[] = []

  // Top measurement
  const topDistance = Math.round(elementRect.top - parentInnerTop)
  if (topDistance > 0) {
    const midX = elementRect.left + elementRect.width / 2
    measurements.push({
      direction: 'vertical',
      x1: midX,
      y1: parentInnerTop,
      x2: midX,
      y2: elementRect.top,
      distance: topDistance,
      labelPosition: { x: midX, y: (parentInnerTop + elementRect.top) / 2 },
    })
  }

  // Bottom measurement
  const bottomDistance = Math.round(parentInnerBottom - elementRect.bottom)
  if (bottomDistance > 0) {
    const midX = elementRect.left + elementRect.width / 2
    measurements.push({
      direction: 'vertical',
      x1: midX,
      y1: elementRect.bottom,
      x2: midX,
      y2: parentInnerBottom,
      distance: bottomDistance,
      labelPosition: { x: midX, y: (elementRect.bottom + parentInnerBottom) / 2 },
    })
  }

  // Left measurement
  const leftDistance = Math.round(elementRect.left - parentInnerLeft)
  if (leftDistance > 0) {
    const midY = elementRect.top + elementRect.height / 2
    measurements.push({
      direction: 'horizontal',
      x1: parentInnerLeft,
      y1: midY,
      x2: elementRect.left,
      y2: midY,
      distance: leftDistance,
      labelPosition: { x: (parentInnerLeft + elementRect.left) / 2, y: midY },
    })
  }

  // Right measurement
  const rightDistance = Math.round(parentInnerRight - elementRect.right)
  if (rightDistance > 0) {
    const midY = elementRect.top + elementRect.height / 2
    measurements.push({
      direction: 'horizontal',
      x1: elementRect.right,
      y1: midY,
      x2: parentInnerRight,
      y2: midY,
      distance: rightDistance,
      labelPosition: { x: (elementRect.right + parentInnerRight) / 2, y: midY },
    })
  }

  return measurements
}

export function calculateElementMeasurements(
  from: HTMLElement,
  to: HTMLElement
): MeasurementLine[] {
  const fromRect = from.getBoundingClientRect()
  const toRect = to.getBoundingClientRect()
  const measurements: MeasurementLine[] = []

  // Check if elements overlap
  const horizontalOverlap =
    fromRect.left < toRect.right && fromRect.right > toRect.left
  const verticalOverlap =
    fromRect.top < toRect.bottom && fromRect.bottom > toRect.top

  // Horizontal measurements (when vertically overlapping)
  if (verticalOverlap) {
    const overlapTop = Math.max(fromRect.top, toRect.top)
    const overlapBottom = Math.min(fromRect.bottom, toRect.bottom)
    const midY = (overlapTop + overlapBottom) / 2

    // From is to the left of To
    if (fromRect.right <= toRect.left) {
      const distance = Math.round(toRect.left - fromRect.right)
      measurements.push({
        direction: 'horizontal',
        x1: fromRect.right,
        y1: midY,
        x2: toRect.left,
        y2: midY,
        distance,
        labelPosition: { x: (fromRect.right + toRect.left) / 2, y: midY },
      })
    }
    // From is to the right of To
    else if (fromRect.left >= toRect.right) {
      const distance = Math.round(fromRect.left - toRect.right)
      measurements.push({
        direction: 'horizontal',
        x1: toRect.right,
        y1: midY,
        x2: fromRect.left,
        y2: midY,
        distance,
        labelPosition: { x: (toRect.right + fromRect.left) / 2, y: midY },
      })
    }
  }

  // Vertical measurements (when horizontally overlapping)
  if (horizontalOverlap) {
    const overlapLeft = Math.max(fromRect.left, toRect.left)
    const overlapRight = Math.min(fromRect.right, toRect.right)
    const midX = (overlapLeft + overlapRight) / 2

    // From is above To
    if (fromRect.bottom <= toRect.top) {
      const distance = Math.round(toRect.top - fromRect.bottom)
      measurements.push({
        direction: 'vertical',
        x1: midX,
        y1: fromRect.bottom,
        x2: midX,
        y2: toRect.top,
        distance,
        labelPosition: { x: midX, y: (fromRect.bottom + toRect.top) / 2 },
      })
    }
    // From is below To
    else if (fromRect.top >= toRect.bottom) {
      const distance = Math.round(fromRect.top - toRect.bottom)
      measurements.push({
        direction: 'vertical',
        x1: midX,
        y1: toRect.bottom,
        x2: midX,
        y2: fromRect.top,
        distance,
        labelPosition: { x: midX, y: (toRect.bottom + fromRect.top) / 2 },
      })
    }
  }

  // If no overlap, show closest edge distances
  if (!horizontalOverlap && !verticalOverlap) {
    // Determine closest corners
    const fromCenterX = fromRect.left + fromRect.width / 2
    const fromCenterY = fromRect.top + fromRect.height / 2
    const toCenterX = toRect.left + toRect.width / 2
    const toCenterY = toRect.top + toRect.height / 2

    // Horizontal distance
    const hDistance = toCenterX > fromCenterX
      ? Math.round(toRect.left - fromRect.right)
      : Math.round(fromRect.left - toRect.right)

    if (hDistance > 0) {
      const startX = toCenterX > fromCenterX ? fromRect.right : fromRect.left
      const endX = toCenterX > fromCenterX ? toRect.left : toRect.right
      const y = (fromCenterY + toCenterY) / 2
      measurements.push({
        direction: 'horizontal',
        x1: startX,
        y1: y,
        x2: endX,
        y2: y,
        distance: hDistance,
        labelPosition: { x: (startX + endX) / 2, y },
      })
    }

    // Vertical distance
    const vDistance = toCenterY > fromCenterY
      ? Math.round(toRect.top - fromRect.bottom)
      : Math.round(fromRect.top - toRect.bottom)

    if (vDistance > 0) {
      const x = (fromCenterX + toCenterX) / 2
      const startY = toCenterY > fromCenterY ? fromRect.bottom : fromRect.top
      const endY = toCenterY > fromCenterY ? toRect.top : toRect.bottom
      measurements.push({
        direction: 'vertical',
        x1: x,
        y1: startY,
        x2: x,
        y2: endY,
        distance: vDistance,
        labelPosition: { x, y: (startY + endY) / 2 },
      })
    }
  }

  return measurements
}
