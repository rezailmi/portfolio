'use client'

import * as React from 'react'
import { DirectEditPanelInner } from './panel'
import { DirectEditToolbarInner } from './toolbar'
import { stylesToTailwind } from './utils'
import type { SpacingPropertyKey, BorderRadiusPropertyKey, SizingPropertyKey, CSSPropertyValue, SizingValue } from './types'

function createValue(num: number, unit: 'px' | 'rem' | '%' | '' = 'px'): CSSPropertyValue {
  return { numericValue: num, unit, raw: `${num}${unit}` }
}

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

const ELEMENT_INFO = {
  tagName: 'div',
  id: 'demo-element',
  classList: ['flex', 'shrink-0', 'items-center', 'gap-4', 'p-4', 'rounded-lg', 'border', 'bg-background'],
  isFlexContainer: true,
  isFlexItem: true,
  parentElement: true,
  hasChildren: true,
}

export function DirectEditDemo() {
  const [spacing, setSpacing] = React.useState({
    paddingTop: createValue(16),
    paddingRight: createValue(16),
    paddingBottom: createValue(16),
    paddingLeft: createValue(16),
    marginTop: createValue(0),
    marginRight: createValue(0),
    marginBottom: createValue(0),
    marginLeft: createValue(0),
    gap: createValue(16),
  })

  const [borderRadius, setBorderRadius] = React.useState({
    borderTopLeftRadius: createValue(8),
    borderTopRightRadius: createValue(8),
    borderBottomRightRadius: createValue(8),
    borderBottomLeftRadius: createValue(8),
  })

  const [flex, setFlex] = React.useState({
    flexDirection: 'row' as const,
    justifyContent: 'flex-start',
    alignItems: 'center',
  })

  const [sizing, setSizing] = React.useState({
    width: { mode: 'fit' as const, value: createValue(300) },
    height: { mode: 'fit' as const, value: createValue(100) },
  })

  const [pendingStyles, setPendingStyles] = React.useState<Record<string, string>>({})
  const [editModeActive, setEditModeActive] = React.useState(false)

  const handleUpdateSpacing = (key: SpacingPropertyKey, value: CSSPropertyValue) => {
    setSpacing((prev) => ({ ...prev, [key]: value }))
    setPendingStyles((prev) => ({ ...prev, [camelToKebab(key)]: value.raw }))
  }

  const handleUpdateBorderRadius = (key: BorderRadiusPropertyKey, value: CSSPropertyValue) => {
    setBorderRadius((prev) => ({ ...prev, [key]: value }))
    setPendingStyles((prev) => ({ ...prev, [camelToKebab(key)]: value.raw }))
  }

  const handleUpdateFlex = (key: 'flexDirection' | 'justifyContent' | 'alignItems', value: string) => {
    setFlex((prev) => ({ ...prev, [key]: value }))
    setPendingStyles((prev) => ({ ...prev, [camelToKebab(key)]: value }))
  }

  const handleUpdateSizing = (key: SizingPropertyKey, value: SizingValue) => {
    setSizing((prev) => ({ ...prev, [key]: value }))
    const cssValue = value.mode === 'fill' ? '100%' : value.mode === 'fit' ? 'fit-content' : value.value.raw
    setPendingStyles((prev) => ({ ...prev, [key]: cssValue }))
  }

  const handleReset = () => {
    setSpacing({
      paddingTop: createValue(16),
      paddingRight: createValue(16),
      paddingBottom: createValue(16),
      paddingLeft: createValue(16),
      marginTop: createValue(0),
      marginRight: createValue(0),
      marginBottom: createValue(0),
      marginLeft: createValue(0),
      gap: createValue(16),
    })
    setBorderRadius({
      borderTopLeftRadius: createValue(8),
      borderTopRightRadius: createValue(8),
      borderBottomRightRadius: createValue(8),
      borderBottomLeftRadius: createValue(8),
    })
    setFlex({
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    })
    setSizing({
      width: { mode: 'fit', value: createValue(300) },
      height: { mode: 'fit', value: createValue(100) },
    })
    setPendingStyles({})
  }

  const handleCopyTailwind = async () => {
    const tailwindClasses = stylesToTailwind(pendingStyles)
    await navigator.clipboard.writeText(tailwindClasses)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-2xl font-bold">Direct Edit Panel</h1>
        <p className="mb-8 text-muted-foreground">
          Interactive showcase of the visual editing panel UI with mock data.
        </p>

        <div className="mb-8 flex justify-center">
          <DirectEditToolbarInner
            editModeActive={editModeActive}
            onToggleEditMode={() => setEditModeActive(!editModeActive)}
            usePortal={false}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <DirectEditPanelInner
            elementInfo={ELEMENT_INFO}
            computedSpacing={spacing}
            computedBorderRadius={borderRadius}
            computedFlex={flex}
            computedSizing={sizing}
            pendingStyles={pendingStyles}
            onSelectParent={() => {}}
            onUpdateSpacing={handleUpdateSpacing}
            onUpdateBorderRadius={handleUpdateBorderRadius}
            onUpdateFlex={handleUpdateFlex}
            onUpdateSizing={handleUpdateSizing}
            onReset={handleReset}
            onCopyTailwind={handleCopyTailwind}
          />

          <div className="space-y-6">
            <div>
              <h2 className="mb-3 text-sm font-medium">Live Preview</h2>
              <div
                className="bg-background border flex"
                style={{
                  padding: `${spacing.paddingTop.raw} ${spacing.paddingRight.raw} ${spacing.paddingBottom.raw} ${spacing.paddingLeft.raw}`,
                  borderRadius: `${borderRadius.borderTopLeftRadius.raw} ${borderRadius.borderTopRightRadius.raw} ${borderRadius.borderBottomRightRadius.raw} ${borderRadius.borderBottomLeftRadius.raw}`,
                  gap: spacing.gap.raw,
                  flexDirection: flex.flexDirection,
                  justifyContent: flex.justifyContent,
                  alignItems: flex.alignItems,
                }}
              >
                <div className="size-12 rounded bg-blue-500/20 border border-blue-500/30" />
                <div className="size-12 rounded bg-green-500/20 border border-green-500/30" />
                <div className="size-12 rounded bg-purple-500/20 border border-purple-500/30" />
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-medium">Pending Styles</h2>
              <pre className="rounded-lg border bg-background p-4 text-xs min-h-[60px]">
                {Object.keys(pendingStyles).length > 0
                  ? JSON.stringify(pendingStyles, null, 2)
                  : '// Make changes to see pending styles'}
              </pre>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-medium">Tailwind Classes</h2>
              <code className="block rounded-lg border bg-background p-4 text-xs min-h-[40px]">
                {Object.keys(pendingStyles).length > 0
                  ? stylesToTailwind(pendingStyles)
                  : '// Tailwind classes will appear here'}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
