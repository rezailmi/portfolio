import * as React from 'react'
import { createPortal } from 'react-dom'
import { useDirectEdit } from './provider'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  createTooltipHandle,
} from './ui/tooltip'
import { cn } from './cn'
import type { SpacingPropertyKey, BorderRadiusPropertyKey, CSSPropertyValue } from './types'
import { Slider } from './ui/slider'
import {
  X,
  GripVertical,
  RotateCcw,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowDown,
  ChevronsLeftRightEllipsis,
  Grid2x2,
  Columns2,
  SquareMousePointer,
} from 'lucide-react'

const STORAGE_KEY = 'direct-edit-panel-position'
const SECTIONS_KEY = 'direct-edit-sections-state'
const PANEL_WIDTH = 300
const PANEL_HEIGHT = 560

interface Position {
  x: number
  y: number
}

function getInitialPosition(): Position {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0 }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Fall through to default
    }
  }

  return {
    x: window.innerWidth - PANEL_WIDTH - 20,
    y: window.innerHeight - PANEL_HEIGHT - 20,
  }
}

function getInitialSections(): Record<string, boolean> {
  if (typeof window === 'undefined') {
    return { padding: true, radius: true, flex: true }
  }

  const stored = localStorage.getItem(SECTIONS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Fall through to default
    }
  }

  return { padding: true, radius: true, flex: true }
}

interface PaddingInputsProps {
  values: {
    top: CSSPropertyValue
    right: CSSPropertyValue
    bottom: CSSPropertyValue
    left: CSSPropertyValue
  }
  onChange: (key: SpacingPropertyKey, value: CSSPropertyValue) => void
}

function PaddingInputs({ values, onChange }: PaddingInputsProps) {
  const [individual, setIndividual] = React.useState(false)
  const [unit, setUnit] = React.useState<'px' | 'rem' | '%'>('px')

  const handleChange = (sides: ('top' | 'right' | 'bottom' | 'left')[], numericValue: number) => {
    const newValue: CSSPropertyValue = {
      numericValue,
      unit,
      raw: `${numericValue}${unit}`,
    }

    for (const side of sides) {
      const key = `padding${side.charAt(0).toUpperCase() + side.slice(1)}` as SpacingPropertyKey
      onChange(key, newValue)
    }
  }

  const cycleUnit = () => {
    const units: ('px' | 'rem' | '%')[] = ['px', 'rem', '%']
    const currentIndex = units.indexOf(unit)
    setUnit(units[(currentIndex + 1) % units.length])
  }

  const horizontalValue =
    values.left.numericValue === values.right.numericValue
      ? values.left.numericValue
      : values.left.numericValue
  const verticalValue =
    values.top.numericValue === values.bottom.numericValue
      ? values.top.numericValue
      : values.top.numericValue

  if (individual) {
    return (
      <div className="space-y-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
              ↑
            </span>
            <Input
              type="number"
              value={values.top?.numericValue ?? 0}
              onChange={(e) => handleChange(['top'], parseFloat(e.target.value) || 0)}
              className="h-7 pl-5 pr-2 text-center text-xs tabular-nums"
              title="Top"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
              →
            </span>
            <Input
              type="number"
              value={values.right?.numericValue ?? 0}
              onChange={(e) => handleChange(['right'], parseFloat(e.target.value) || 0)}
              className="h-7 pl-5 pr-2 text-center text-xs tabular-nums"
              title="Right"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
              ↓
            </span>
            <Input
              type="number"
              value={values.bottom?.numericValue ?? 0}
              onChange={(e) => handleChange(['bottom'], parseFloat(e.target.value) || 0)}
              className="h-7 pl-5 pr-2 text-center text-xs tabular-nums"
              title="Bottom"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
              ←
            </span>
            <Input
              type="number"
              value={values.left?.numericValue ?? 0}
              onChange={(e) => handleChange(['left'], parseFloat(e.target.value) || 0)}
              className="h-7 pl-5 pr-2 text-center text-xs tabular-nums"
              title="Left"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={cycleUnit}
            title={`Unit: ${unit}`}
          >
            <span className="text-[10px] font-mono">{unit}</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="size-7 shrink-0"
            onClick={() => setIndividual(false)}
            title="Combined mode"
          >
            <Columns2 className="size-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex-1">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground font-mono">
          ↔
        </span>
        <Input
          type="number"
          value={horizontalValue}
          onChange={(e) => handleChange(['left', 'right'], parseFloat(e.target.value) || 0)}
          className="h-7 pl-6 pr-2 text-center text-xs tabular-nums"
          title="Horizontal (left & right)"
        />
      </div>
      <div className="relative flex-1">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground font-mono">
          ↕
        </span>
        <Input
          type="number"
          value={verticalValue}
          onChange={(e) => handleChange(['top', 'bottom'], parseFloat(e.target.value) || 0)}
          className="h-7 pl-6 pr-2 text-center text-xs tabular-nums"
          title="Vertical (top & bottom)"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0"
        onClick={cycleUnit}
        title={`Unit: ${unit}`}
      >
        <span className="text-[10px] font-mono">{unit}</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0"
        onClick={() => setIndividual(true)}
        title="Individual mode"
      >
        <Grid2x2 className="size-3" />
      </Button>
    </div>
  )
}

interface BorderRadiusInputsProps {
  values: {
    topLeft: CSSPropertyValue
    topRight: CSSPropertyValue
    bottomRight: CSSPropertyValue
    bottomLeft: CSSPropertyValue
  }
  onChange: (key: BorderRadiusPropertyKey, value: CSSPropertyValue) => void
}

function BorderRadiusInputs({ values, onChange }: BorderRadiusInputsProps) {
  const [individual, setIndividual] = React.useState(false)
  const [unit, setUnit] = React.useState<'px' | 'rem' | '%'>('px')

  const handleChange = (
    corners: ('topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft')[],
    numericValue: number
  ) => {
    const newValue: CSSPropertyValue = {
      numericValue,
      unit,
      raw: `${numericValue}${unit}`,
    }

    for (const corner of corners) {
      const key = `border${corner.charAt(0).toUpperCase() + corner.slice(1)}Radius` as BorderRadiusPropertyKey
      onChange(key, newValue)
    }
  }

  const cycleUnit = () => {
    const units: ('px' | 'rem' | '%')[] = ['px', 'rem', '%']
    const currentIndex = units.indexOf(unit)
    setUnit(units[(currentIndex + 1) % units.length])
  }

  const allSame =
    values.topLeft.numericValue === values.topRight.numericValue &&
    values.topRight.numericValue === values.bottomRight.numericValue &&
    values.bottomRight.numericValue === values.bottomLeft.numericValue
  const uniformValue = allSame ? values.topLeft.numericValue : values.topLeft.numericValue

  if (individual) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <div className="relative flex-1">
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
              ◜
            </span>
            <Input
              type="number"
              value={values.topLeft?.numericValue ?? 0}
              onChange={(e) => handleChange(['topLeft'], parseFloat(e.target.value) || 0)}
              className="h-7 pl-5 pr-1 text-center text-xs tabular-nums"
              title="Top Left"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
              ◝
            </span>
            <Input
              type="number"
              value={values.topRight?.numericValue ?? 0}
              onChange={(e) => handleChange(['topRight'], parseFloat(e.target.value) || 0)}
              className="h-7 pl-5 pr-1 text-center text-xs tabular-nums"
              title="Top Right"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
              ◟
            </span>
            <Input
              type="number"
              value={values.bottomRight?.numericValue ?? 0}
              onChange={(e) => handleChange(['bottomRight'], parseFloat(e.target.value) || 0)}
              className="h-7 pl-5 pr-1 text-center text-xs tabular-nums"
              title="Bottom Right"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">
              ◞
            </span>
            <Input
              type="number"
              value={values.bottomLeft?.numericValue ?? 0}
              onChange={(e) => handleChange(['bottomLeft'], parseFloat(e.target.value) || 0)}
              className="h-7 pl-5 pr-1 text-center text-xs tabular-nums"
              title="Bottom Left"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={cycleUnit}
            title={`Unit: ${unit}`}
          >
            <span className="text-[10px] font-mono">{unit}</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="size-7 shrink-0"
            onClick={() => setIndividual(false)}
            title="Combined mode"
          >
            <Columns2 className="size-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Slider
        value={uniformValue}
        onValueChange={(val) =>
          handleChange(
            ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'],
            typeof val === 'number' ? val : val[0]
          )
        }
        max={48}
        step={1}
        className="flex-1"
      />
      <Input
        type="number"
        value={uniformValue}
        onChange={(e) =>
          handleChange(
            ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'],
            parseFloat(e.target.value) || 0
          )
        }
        className="h-7 w-14 px-2 text-center text-xs tabular-nums"
      />
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0"
        onClick={cycleUnit}
        title={`Unit: ${unit}`}
      >
        <span className="text-[10px] font-mono">{unit}</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0"
        onClick={() => setIndividual(true)}
        title="Individual mode"
      >
        <Grid2x2 className="size-3" />
      </Button>
    </div>
  )
}

interface AlignmentGridProps {
  justifyContent: string
  alignItems: string
  onChange: (justify: string, align: string) => void
}

function AlignmentGrid({ justifyContent, alignItems, onChange }: AlignmentGridProps) {
  const justifyValues = ['flex-start', 'center', 'flex-end']
  const alignValues = ['flex-start', 'center', 'flex-end']

  const normalizeJustify = (val: string) => {
    if (val === 'start') return 'flex-start'
    if (val === 'end') return 'flex-end'
    return val
  }

  const normalizeAlign = (val: string) => {
    if (val === 'start') return 'flex-start'
    if (val === 'end') return 'flex-end'
    return val
  }

  const currentJustify = normalizeJustify(justifyContent)
  const currentAlign = normalizeAlign(alignItems)

  const tooltipHandle = createTooltipHandle<{ justify: string; align: string }>()

  return (
    <TooltipProvider delayDuration={300} closeDelay={150}>
      <div className="grid grid-cols-3 gap-1 rounded-md border bg-muted/30 p-1.5">
        {alignValues.map((align) =>
          justifyValues.map((justify) => {
            const isActive = currentJustify === justify && currentAlign === align
            return (
              <TooltipTrigger
                key={`${justify}-${align}`}
                handle={tooltipHandle}
                payload={{ justify, align }}
                render={
                  <button
                    type="button"
                    className={cn(
                      'flex size-6 items-center justify-center rounded transition-colors',
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-background hover:bg-muted-foreground/10'
                    )}
                    onClick={() => onChange(justify, align)}
                  >
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        isActive ? 'bg-white' : 'bg-muted-foreground/40'
                      )}
                    />
                  </button>
                }
              />
            )
          })
        )}
      </div>
      <Tooltip handle={tooltipHandle}>
        {({ payload }) => (
          <TooltipPortal>
            <TooltipPositioner side="bottom" sideOffset={8} className="fixed z-[99999]">
              <TooltipPopup className="overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2">
                justify: {payload?.justify}, align: {payload?.align}
              </TooltipPopup>
            </TooltipPositioner>
          </TooltipPortal>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

interface GapInputProps {
  value: CSSPropertyValue
  onChange: (value: CSSPropertyValue) => void
}

function GapInput({ value, onChange }: GapInputProps) {
  const [unit, setUnit] = React.useState<'px' | 'rem' | '%'>(value.unit || 'px')

  const handleChange = (numericValue: number) => {
    onChange({
      numericValue,
      unit,
      raw: `${numericValue}${unit}`,
    })
  }

  const cycleUnit = () => {
    const units: ('px' | 'rem' | '%')[] = ['px', 'rem', '%']
    const currentIndex = units.indexOf(unit)
    const newUnit = units[(currentIndex + 1) % units.length]
    setUnit(newUnit)
    onChange({
      numericValue: value.numericValue,
      unit: newUnit,
      raw: `${value.numericValue}${newUnit}`,
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        value={value.numericValue}
        onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
        className="h-7 w-14 px-2 text-xs tabular-nums"
      />
      <Button variant="ghost" size="icon" className="size-7" onClick={cycleUnit} title={`Unit: ${unit}`}>
        <span className="text-[10px] font-mono">{unit}</span>
      </Button>
    </div>
  )
}

interface CollapsibleSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function CollapsibleSection({ title, isOpen, onToggle, children }: CollapsibleSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex w-full items-center justify-between border-b px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/50">
        {title}
        {isOpen ? (
          <ChevronDown className="size-3.5 text-muted-foreground" />
        ) : (
          <ChevronUp className="size-3.5 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[ending-style]:animate-accordion-up data-[starting-style]:animate-accordion-down">
        <div className="px-3 py-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function DirectEditPanelContent() {
  const {
    isOpen,
    closePanel,
    elementInfo,
    computedSpacing,
    computedBorderRadius,
    computedFlex,
    updateSpacingProperty,
    updateBorderRadiusProperty,
    updateFlexProperty,
    resetToOriginal,
    copyAsTailwind,
    pendingStyles,
    selectParent,
    selectElement,
    editModeActive,
  } = useDirectEdit()

  const [position, setPosition] = React.useState<Position>(getInitialPosition)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState<Position>({ x: 0, y: 0 })
  const [copied, setCopied] = React.useState(false)
  const [sections, setSections] = React.useState<Record<string, boolean>>(getInitialSections)
  const panelRef = React.useRef<HTMLDivElement>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!panelRef.current) return

    const rect = panelRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return

    const newX = Math.max(0, Math.min(window.innerWidth - PANEL_WIDTH, e.clientX - dragOffset.x))
    const newY = Math.max(0, Math.min(window.innerHeight - PANEL_HEIGHT, e.clientY - dragOffset.y))

    setPosition({ x: newX, y: newY })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return

    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(position))
  }

  const handleCopy = async () => {
    await copyAsTailwind()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleSection = (key: string) => {
    setSections((prev) => {
      const newSections = { ...prev, [key]: !prev[key] }
      localStorage.setItem(SECTIONS_KEY, JSON.stringify(newSections))
      return newSections
    })
  }

  React.useEffect(() => {
    function handleResize() {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - PANEL_WIDTH - 20),
        y: Math.min(prev.y, window.innerHeight - PANEL_HEIGHT - 20),
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isOpen || !computedSpacing) return null

  const hasPendingChanges = Object.keys(pendingStyles).length > 0

  return createPortal(
    <>
      {editModeActive && (
        <div
          className="fixed inset-0 z-[99990] cursor-crosshair"
          onClick={(e) => {
            e.preventDefault()
            const overlay = e.currentTarget
            overlay.style.pointerEvents = 'none'
            const elementUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
            overlay.style.pointerEvents = 'auto'

            if (elementUnder && elementUnder !== document.body && elementUnder !== document.documentElement) {
              selectElement(elementUnder)
            }
          }}
        />
      )}

      <div
        ref={panelRef}
        className={cn(
          'fixed z-[99999] flex flex-col overflow-hidden rounded-lg border bg-background shadow-xl',
          isDragging && 'cursor-grabbing select-none'
        )}
        style={{
          left: position.x,
          top: position.y,
          width: PANEL_WIDTH,
          maxHeight: PANEL_HEIGHT,
        }}
      >
        <div
          className="flex shrink-0 cursor-grab items-center gap-2 border-b bg-muted/50 px-3 py-2 active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <GripVertical className="size-4 text-muted-foreground" />
          <span className="flex-1 text-sm font-medium">Direct Edit</span>
          <Button variant="ghost" size="icon" className="size-6" onClick={closePanel}>
            <X className="size-4" />
          </Button>
        </div>

        {elementInfo && (
          <div className="shrink-0 border-b px-3 py-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <code className="text-sm font-semibold text-foreground">
                  &lt;{elementInfo.tagName}&gt;
                </code>
                {elementInfo.id && (
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">#{elementInfo.id}</div>
                )}
                {elementInfo.classList.length > 0 && (
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    .{elementInfo.classList.slice(0, 3).join(' .')}
                    {elementInfo.classList.length > 3 && ` +${elementInfo.classList.length - 3}`}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={selectParent}
                disabled={!elementInfo.parentElement}
                className="size-7 shrink-0"
                title="Select Parent"
              >
                <SquareMousePointer className="size-3.5" />
              </Button>
            </div>
            <div className="mt-1.5 flex gap-1.5">
              {elementInfo.isFlexContainer && (
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                  Flex Container
                </span>
              )}
              {elementInfo.isFlexItem && (
                <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-600 dark:text-purple-400">
                  Flex Item
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <CollapsibleSection
            title="Padding"
            isOpen={sections.padding ?? true}
            onToggle={() => toggleSection('padding')}
          >
            <PaddingInputs
              values={{
                top: computedSpacing.paddingTop,
                right: computedSpacing.paddingRight,
                bottom: computedSpacing.paddingBottom,
                left: computedSpacing.paddingLeft,
              }}
              onChange={updateSpacingProperty}
            />
          </CollapsibleSection>

          {computedBorderRadius && (
            <CollapsibleSection
              title="Radius"
              isOpen={sections.radius ?? true}
              onToggle={() => toggleSection('radius')}
            >
              <BorderRadiusInputs
                values={{
                  topLeft: computedBorderRadius.borderTopLeftRadius,
                  topRight: computedBorderRadius.borderTopRightRadius,
                  bottomRight: computedBorderRadius.borderBottomRightRadius,
                  bottomLeft: computedBorderRadius.borderBottomLeftRadius,
                }}
                onChange={updateBorderRadiusProperty}
              />
            </CollapsibleSection>
          )}

          {elementInfo?.isFlexContainer && computedFlex && (
            <CollapsibleSection
              title="Flex"
              isOpen={sections.flex ?? true}
              onToggle={() => toggleSection('flex')}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">Direction</span>
                  <div className="flex gap-1">
                    <Button
                      variant={computedFlex.flexDirection === 'row' ? 'default' : 'outline'}
                      size="icon"
                      className="size-7"
                      onClick={() => updateFlexProperty('flexDirection', 'row')}
                      title="Row"
                    >
                      <ArrowRight className="size-3.5" />
                    </Button>
                    <Button
                      variant={computedFlex.flexDirection === 'column' ? 'default' : 'outline'}
                      size="icon"
                      className="size-7"
                      onClick={() => updateFlexProperty('flexDirection', 'column')}
                      title="Column"
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Align</span>
                    <AlignmentGrid
                      justifyContent={computedFlex.justifyContent}
                      alignItems={computedFlex.alignItems}
                      onChange={(justify, align) => {
                        updateFlexProperty('justifyContent', justify)
                        updateFlexProperty('alignItems', align)
                      }}
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground">Distribute</span>
                    <div className="mt-1 flex flex-col gap-1">
                      {[
                        { value: 'space-between', label: 'Between' },
                        { value: 'space-around', label: 'Around' },
                        { value: 'space-evenly', label: 'Evenly' },
                      ].map(({ value, label }) => (
                        <Button
                          key={value}
                          variant={computedFlex.justifyContent === value ? 'default' : 'ghost'}
                          size="sm"
                          className="h-6 justify-start px-2 text-[10px]"
                          onClick={() => updateFlexProperty('justifyContent', value)}
                        >
                          <ChevronsLeftRightEllipsis className="mr-1 size-3" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">Gap</span>
                  <GapInput
                    value={computedSpacing.gap}
                    onChange={(value) => updateSpacingProperty('gap', value)}
                  />
                </div>
              </div>
            </CollapsibleSection>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t bg-muted/30 px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToOriginal}
            disabled={!hasPendingChanges}
            className="text-xs"
          >
            <RotateCcw className="mr-1 size-3" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!hasPendingChanges}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="mr-1 size-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-1 size-3" />
                Copy Tailwind
              </>
            )}
          </Button>
        </div>
      </div>
    </>,
    document.body
  )
}

export function DirectEditPanel() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <DirectEditPanelContent />
}
