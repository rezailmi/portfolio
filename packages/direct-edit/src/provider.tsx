import * as React from 'react'
import type {
  DirectEditState,
  SpacingPropertyKey,
  BorderRadiusPropertyKey,
  FlexPropertyKey,
  SizingPropertyKey,
  CSSPropertyValue,
  SizingValue,
} from './types'
import {
  getComputedStyles,
  getOriginalInlineStyles,
  getElementInfo,
  formatPropertyValue,
  propertyToCSSMap,
  borderRadiusPropertyToCSSMap,
  flexPropertyToCSSMap,
  sizingPropertyToCSSMap,
  stylesToTailwind,
  getComputedSizing,
  sizingValueToCSS,
} from './utils'

interface DirectEditContextValue extends DirectEditState {
  selectElement: (element: HTMLElement) => void
  selectParent: () => void
  selectChild: () => void
  closePanel: () => void
  updateSpacingProperty: (key: SpacingPropertyKey, value: CSSPropertyValue) => void
  updateBorderRadiusProperty: (key: BorderRadiusPropertyKey, value: CSSPropertyValue) => void
  updateFlexProperty: (key: FlexPropertyKey, value: string) => void
  updateSizingProperty: (key: SizingPropertyKey, value: SizingValue) => void
  resetToOriginal: () => void
  copyAsTailwind: () => Promise<void>
  toggleEditMode: () => void
}

const DirectEditContext = React.createContext<DirectEditContextValue | null>(null)

export function useDirectEdit(): DirectEditContextValue {
  const context = React.useContext(DirectEditContext)
  if (!context) {
    throw new Error('useDirectEdit must be used within a DirectEditProvider')
  }
  return context
}

export function DirectEditProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DirectEditState>({
    isOpen: false,
    selectedElement: null,
    elementInfo: null,
    computedSpacing: null,
    computedBorderRadius: null,
    computedFlex: null,
    computedSizing: null,
    originalStyles: {},
    pendingStyles: {},
    editModeActive: false,
  })

  const selectElement = React.useCallback((element: HTMLElement) => {
    const { spacing, borderRadius, flex } = getComputedStyles(element)
    const sizing = getComputedSizing(element)
    const originalStyles = getOriginalInlineStyles(element)
    const elementInfo = getElementInfo(element)

    setState((prev) => ({
      isOpen: true,
      selectedElement: element,
      elementInfo,
      computedSpacing: spacing,
      computedBorderRadius: borderRadius,
      computedFlex: flex,
      computedSizing: sizing,
      originalStyles,
      pendingStyles: {},
      editModeActive: prev.editModeActive,
    }))
  }, [])

  const closePanel = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  const toggleEditMode = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      editModeActive: !prev.editModeActive,
    }))
  }, [])

  const selectParent = React.useCallback(() => {
    if (state.selectedElement?.parentElement) {
      selectElement(state.selectedElement.parentElement)
    }
  }, [state.selectedElement, selectElement])

  const selectChild = React.useCallback(() => {
    const firstChild = state.selectedElement?.firstElementChild as HTMLElement | null
    if (firstChild) {
      selectElement(firstChild)
    }
  }, [state.selectedElement, selectElement])

  const updateSpacingProperty = React.useCallback(
    (key: SpacingPropertyKey, value: CSSPropertyValue) => {
      if (!state.selectedElement) return

      const cssProperty = propertyToCSSMap[key]
      const cssValue = formatPropertyValue(value)

      state.selectedElement.style.setProperty(cssProperty, cssValue)

      setState((prev) => ({
        ...prev,
        computedSpacing: prev.computedSpacing
          ? {
              ...prev.computedSpacing,
              [key]: value,
            }
          : null,
        pendingStyles: {
          ...prev.pendingStyles,
          [cssProperty]: cssValue,
        },
      }))
    },
    [state.selectedElement]
  )

  const updateBorderRadiusProperty = React.useCallback(
    (key: BorderRadiusPropertyKey, value: CSSPropertyValue) => {
      if (!state.selectedElement) return

      const cssProperty = borderRadiusPropertyToCSSMap[key]
      const cssValue = formatPropertyValue(value)

      state.selectedElement.style.setProperty(cssProperty, cssValue)

      setState((prev) => ({
        ...prev,
        computedBorderRadius: prev.computedBorderRadius
          ? {
              ...prev.computedBorderRadius,
              [key]: value,
            }
          : null,
        pendingStyles: {
          ...prev.pendingStyles,
          [cssProperty]: cssValue,
        },
      }))
    },
    [state.selectedElement]
  )

  const updateFlexProperty = React.useCallback(
    (key: FlexPropertyKey, value: string) => {
      if (!state.selectedElement) return

      const cssProperty = flexPropertyToCSSMap[key]

      state.selectedElement.style.setProperty(cssProperty, value)

      setState((prev) => ({
        ...prev,
        computedFlex: prev.computedFlex
          ? {
              ...prev.computedFlex,
              [key]: value,
            }
          : null,
        pendingStyles: {
          ...prev.pendingStyles,
          [cssProperty]: value,
        },
      }))
    },
    [state.selectedElement]
  )

  const updateSizingProperty = React.useCallback(
    (key: SizingPropertyKey, value: SizingValue) => {
      if (!state.selectedElement) return

      const cssProperty = sizingPropertyToCSSMap[key]
      const cssValue = sizingValueToCSS(value)

      state.selectedElement.style.setProperty(cssProperty, cssValue)

      setState((prev) => ({
        ...prev,
        computedSizing: prev.computedSizing
          ? {
              ...prev.computedSizing,
              [key]: value,
            }
          : null,
        pendingStyles: {
          ...prev.pendingStyles,
          [cssProperty]: cssValue,
        },
      }))
    },
    [state.selectedElement]
  )

  const resetToOriginal = React.useCallback(() => {
    if (!state.selectedElement) return

    const allCSSProps = [
      ...Object.values(propertyToCSSMap),
      ...Object.values(borderRadiusPropertyToCSSMap),
      ...Object.values(flexPropertyToCSSMap),
      ...Object.values(sizingPropertyToCSSMap),
    ]

    for (const prop of allCSSProps) {
      state.selectedElement.style.removeProperty(prop)
    }

    for (const [prop, value] of Object.entries(state.originalStyles)) {
      state.selectedElement.style.setProperty(prop, value)
    }

    const { spacing, borderRadius, flex } = getComputedStyles(state.selectedElement)
    const sizing = getComputedSizing(state.selectedElement)

    setState((prev) => ({
      ...prev,
      computedSpacing: spacing,
      computedBorderRadius: borderRadius,
      computedFlex: flex,
      computedSizing: sizing,
      pendingStyles: {},
    }))
  }, [state.selectedElement, state.originalStyles])

  const copyAsTailwind = React.useCallback(async () => {
    if (!state.pendingStyles || Object.keys(state.pendingStyles).length === 0) {
      return
    }

    const tailwindClasses = stylesToTailwind(state.pendingStyles)
    await navigator.clipboard.writeText(tailwindClasses)
  }, [state.pendingStyles])

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        toggleEditMode()
        return
      }

      if (e.key === 'Escape') {
        if (state.isOpen) {
          closePanel()
        } else if (state.editModeActive) {
          toggleEditMode()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isOpen, state.editModeActive, closePanel, toggleEditMode])

  const contextValue: DirectEditContextValue = {
    ...state,
    selectElement,
    selectParent,
    selectChild,
    closePanel,
    updateSpacingProperty,
    updateBorderRadiusProperty,
    updateFlexProperty,
    updateSizingProperty,
    resetToOriginal,
    copyAsTailwind,
    toggleEditMode,
  }

  return <DirectEditContext.Provider value={contextValue}>{children}</DirectEditContext.Provider>
}
