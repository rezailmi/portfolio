'use client'

import * as React from 'react'
import { DirectEditPanelInner, stylesToTailwind } from 'direct-edit'
import type { SpacingPropertyKey, BorderRadiusPropertyKey, CSSPropertyValue } from 'direct-edit'

function createValue(num: number, unit: 'px' | 'rem' | '%' | '' = 'px'): CSSPropertyValue {
  return { numericValue: num, unit, raw: `${num}${unit}` }
}

export default function EditPage() {
  const [spacing, setSpacing] = React.useState({
    paddingTop: createValue(16),
    paddingRight: createValue(16),
    paddingBottom: createValue(16),
    paddingLeft: createValue(16),
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

  const [pendingStyles, setPendingStyles] = React.useState<Record<string, string>>({})

  const handleUpdateSpacing = (key: SpacingPropertyKey, value: CSSPropertyValue) => {
    setSpacing((prev) => ({ ...prev, [key]: value }))
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    setPendingStyles((prev) => ({ ...prev, [cssKey]: value.raw }))
  }

  const handleUpdateBorderRadius = (key: BorderRadiusPropertyKey, value: CSSPropertyValue) => {
    setBorderRadius((prev) => ({ ...prev, [key]: value }))
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    setPendingStyles((prev) => ({ ...prev, [cssKey]: value.raw }))
  }

  const handleUpdateFlex = (key: 'flexDirection' | 'justifyContent' | 'alignItems', value: string) => {
    setFlex((prev) => ({ ...prev, [key]: value }))
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    setPendingStyles((prev) => ({ ...prev, [cssKey]: value }))
  }

  const handleReset = () => {
    setSpacing({
      paddingTop: createValue(16),
      paddingRight: createValue(16),
      paddingBottom: createValue(16),
      paddingLeft: createValue(16),
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
    setPendingStyles({})
  }

  const handleCopyTailwind = async () => {
    const tailwindClasses = stylesToTailwind(pendingStyles)
    await navigator.clipboard.writeText(tailwindClasses)
  }

  const elementInfo = {
    tagName: 'div',
    id: 'demo-element',
    classList: ['flex', 'items-center', 'gap-4'],
    isFlexContainer: true,
    isFlexItem: false,
    parentElement: true,
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-2xl font-bold">Direct Edit Panel</h1>
        <p className="mb-8 text-muted-foreground">
          Interactive showcase of the visual editing panel UI with mock data.
        </p>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <DirectEditPanelInner
            elementInfo={elementInfo}
            computedSpacing={spacing}
            computedBorderRadius={borderRadius}
            computedFlex={flex}
            pendingStyles={pendingStyles}
            onUpdateSpacing={handleUpdateSpacing}
            onUpdateBorderRadius={handleUpdateBorderRadius}
            onUpdateFlex={handleUpdateFlex}
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

            {Object.keys(pendingStyles).length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-medium">Pending Styles</h2>
                <pre className="rounded-lg border bg-background p-4 text-xs">
                  {JSON.stringify(pendingStyles, null, 2)}
                </pre>
              </div>
            )}

            {Object.keys(pendingStyles).length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-medium">Tailwind Classes</h2>
                <code className="block rounded-lg border bg-background p-4 text-xs">
                  {stylesToTailwind(pendingStyles)}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
