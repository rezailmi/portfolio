'use client'

import * as React from 'react'
import type {
  VisualEditState,
  SpacingPropertyKey,
  BorderRadiusPropertyKey,
  FlexPropertyKey,
  CSSPropertyValue,
} from '@/lib/visual-edit'
import {
  getComputedStyles,
  getOriginalInlineStyles,
  getElementInfo,
  formatPropertyValue,
  propertyToCSSMap,
  borderRadiusPropertyToCSSMap,
  flexPropertyToCSSMap,
  stylesToTailwind,
} from '@/lib/visual-edit'

interface VisualEditContextValue extends VisualEditState {
  selectElement: (element: HTMLElement) => void
  selectParent: () => void
  closePanel: () => void
  updateSpacingProperty: (key: SpacingPropertyKey, value: CSSPropertyValue) => void
  updateBorderRadiusProperty: (key: BorderRadiusPropertyKey, value: CSSPropertyValue) => void
  updateFlexProperty: (key: FlexPropertyKey, value: string) => void
  resetToOriginal: () => void
  copyAsTailwind: () => Promise<void>
  toggleEditMode: () => void
}

const VisualEditContext = React.createContext<VisualEditContextValue | null>(null)

export function useVisualEdit(): VisualEditContextValue {
  const context = React.useContext(VisualEditContext)
  if (!context) {
    throw new Error('useVisualEdit must be used within a VisualEditProvider')
  }
  return context
}

export function VisualEditProvider({ children }: { children: React.ReactNode }) {
  // Skip rendering the provider in production
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>
  }

  return <VisualEditProviderInner>{children}</VisualEditProviderInner>
}

function VisualEditProviderInner({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<VisualEditState>({
    isOpen: false,
    selectedElement: null,
    elementInfo: null,
    computedSpacing: null,
    computedBorderRadius: null,
    computedFlex: null,
    originalStyles: {},
    pendingStyles: {},
    editModeActive: false,
  })

  const selectElement = React.useCallback((element: HTMLElement) => {
    const { spacing, borderRadius, flex } = getComputedStyles(element)
    const originalStyles = getOriginalInlineStyles(element)
    const elementInfo = getElementInfo(element)

    setState((prev) => ({
      isOpen: true,
      selectedElement: element,
      elementInfo,
      computedSpacing: spacing,
      computedBorderRadius: borderRadius,
      computedFlex: flex,
      originalStyles,
      pendingStyles: {},
      // Keep edit mode active when selecting elements
      editModeActive: prev.editModeActive,
    }))
  }, [])

  const closePanel = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      // Keep edit mode active when closing panel (user may want to select another element)
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

  const updateSpacingProperty = React.useCallback(
    (key: SpacingPropertyKey, value: CSSPropertyValue) => {
      if (!state.selectedElement) return

      const cssProperty = propertyToCSSMap[key]
      const cssValue = formatPropertyValue(value)

      // Apply inline style for real-time preview
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

      // Apply inline style for real-time preview
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

      // Apply inline style for real-time preview
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

  const resetToOriginal = React.useCallback(() => {
    if (!state.selectedElement) return

    // Remove all pending styles
    const allCSSProps = [
      ...Object.values(propertyToCSSMap),
      ...Object.values(borderRadiusPropertyToCSSMap),
      ...Object.values(flexPropertyToCSSMap),
    ]

    for (const prop of allCSSProps) {
      state.selectedElement.style.removeProperty(prop)
    }

    // Restore original inline styles
    for (const [prop, value] of Object.entries(state.originalStyles)) {
      state.selectedElement.style.setProperty(prop, value)
    }

    // Re-read computed styles
    const { spacing, borderRadius, flex } = getComputedStyles(state.selectedElement)

    setState((prev) => ({
      ...prev,
      computedSpacing: spacing,
      computedBorderRadius: borderRadius,
      computedFlex: flex,
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

  // Handle keyboard shortcuts
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Toggle edit mode with Cmd+. or Ctrl+.
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        toggleEditMode()
        return
      }

      // Handle Escape key
      if (e.key === 'Escape') {
        if (state.isOpen) {
          // If panel is open, close it
          closePanel()
        } else if (state.editModeActive) {
          // If edit mode is active but panel is closed, deactivate edit mode
          toggleEditMode()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isOpen, state.editModeActive, closePanel, toggleEditMode])

  const contextValue: VisualEditContextValue = {
    ...state,
    selectElement,
    selectParent,
    closePanel,
    updateSpacingProperty,
    updateBorderRadiusProperty,
    updateFlexProperty,
    resetToOriginal,
    copyAsTailwind,
    toggleEditMode,
  }

  return <VisualEditContext.Provider value={contextValue}>{children}</VisualEditContext.Provider>
}
