'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { useVisualEdit } from '@/components/visual-edit-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { SpacingPropertyKey, CSSPropertyValue } from '@/lib/visual-edit'
import {
  X,
  GripVertical,
  RotateCcw,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  Link2,
  Link2Off,
  ArrowRight,
  ArrowDown,
  ChevronsLeftRightEllipsis,
} from 'lucide-react'

const STORAGE_KEY = 'visual-edit-panel-position'
const SECTIONS_KEY = 'visual-edit-sections-state'
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
    return { padding: true, margin: true, flex: true }
  }

  const stored = localStorage.getItem(SECTIONS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Fall through to default
    }
  }

  return { padding: true, margin: true, flex: true }
}

// Compact spacing input component with linked/unlinked modes
interface CompactSpacingInputsProps {
  type: 'padding' | 'margin'
  values: {
    top: CSSPropertyValue
    right: CSSPropertyValue
    bottom: CSSPropertyValue
    left: CSSPropertyValue
  }
  onChange: (key: SpacingPropertyKey, value: CSSPropertyValue) => void
}

function CompactSpacingInputs({ type, values, onChange }: CompactSpacingInputsProps) {
  const [linked, setLinked] = React.useState(false)
  const [unit, setUnit] = React.useState<'px' | 'rem' | '%'>('px')

  const sides = [
    { key: 'top' as const, icon: '↑', label: 'Top' },
    { key: 'right' as const, icon: '→', label: 'Right' },
    { key: 'bottom' as const, icon: '↓', label: 'Bottom' },
    { key: 'left' as const, icon: '←', label: 'Left' },
  ]

  const handleChange = (side: 'top' | 'right' | 'bottom' | 'left', numericValue: number) => {
    const propertyKey = `${type}${side.charAt(0).toUpperCase() + side.slice(1)}` as SpacingPropertyKey
    const newValue: CSSPropertyValue = {
      numericValue,
      unit,
      raw: `${numericValue}${unit}`,
    }

    if (linked) {
      // Update all sides
      for (const s of sides) {
        const key = `${type}${s.key.charAt(0).toUpperCase() + s.key.slice(1)}` as SpacingPropertyKey
        onChange(key, newValue)
      }
    } else {
      onChange(propertyKey, newValue)
    }
  }

  const cycleUnit = () => {
    const units: ('px' | 'rem' | '%')[] = ['px', 'rem', '%']
    const currentIndex = units.indexOf(unit)
    setUnit(units[(currentIndex + 1) % units.length])
  }

  return (
    <div className="flex items-center gap-1">
      {sides.map(({ key, icon, label }) => (
        <div key={key} className="group relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground opacity-60">
            {icon}
          </span>
          <Input
            type="number"
            value={values[key]?.numericValue ?? 0}
            onChange={(e) => handleChange(key, parseFloat(e.target.value) || 0)}
            className="h-7 w-11 px-1 text-center text-xs tabular-nums"
            title={label}
          />
        </div>
      ))}
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
        variant={linked ? 'secondary' : 'ghost'}
        size="icon"
        className="size-7 shrink-0"
        onClick={() => setLinked(!linked)}
        title={linked ? 'Unlink sides' : 'Link sides'}
      >
        {linked ? <Link2 className="size-3" /> : <Link2Off className="size-3" />}
      </Button>
    </div>
  )
}

// 3x3 Alignment grid component
interface AlignmentGridProps {
  justifyContent: string
  alignItems: string
  onChange: (justify: string, align: string) => void
}

function AlignmentGrid({ justifyContent, alignItems, onChange }: AlignmentGridProps) {
  const justifyValues = ['flex-start', 'center', 'flex-end']
  const alignValues = ['flex-start', 'center', 'flex-end']

  // Normalize values
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

  return (
    <TooltipProvider delayDuration={0}>
      <div className="grid grid-cols-3 gap-1 rounded-md border bg-muted/30 p-1.5">
        {alignValues.map((align) =>
          justifyValues.map((justify) => {
            const isActive = currentJustify === justify && currentAlign === align
            return (
              <Tooltip key={`${justify}-${align}`}>
                <TooltipTrigger
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
                <TooltipContent side="bottom">
                  justify: {justify}, align: {align}
                </TooltipContent>
              </Tooltip>
            )
          })
        )}
      </div>
    </TooltipProvider>
  )
}

// Gap input component
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
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={cycleUnit}
        title={`Unit: ${unit}`}
      >
        <span className="text-[10px] font-mono">{unit}</span>
      </Button>
    </div>
  )
}

// Collapsible section component
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

function VisualEditPanelContent() {
  const {
    isOpen,
    closePanel,
    elementInfo,
    computedSpacing,
    computedFlex,
    updateSpacingProperty,
    updateFlexProperty,
    resetToOriginal,
    copyAsTailwind,
    pendingStyles,
    selectParent,
    selectElement,
    editModeActive,
  } = useVisualEdit()

  const [position, setPosition] = React.useState<Position>(getInitialPosition)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState<Position>({ x: 0, y: 0 })
  const [copied, setCopied] = React.useState(false)
  const [sections, setSections] = React.useState<Record<string, boolean>>(getInitialSections)
  const panelRef = React.useRef<HTMLDivElement>(null)

  // Handle dragging
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

    // Save position to localStorage
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

  // Reset position on window resize
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
      {/* Interaction blocker overlay - active when edit mode is on */}
      {editModeActive && (
        <div
          className="fixed inset-0 z-[99990] cursor-crosshair"
          onClick={(e) => {
            e.preventDefault()
            // Find element under cursor (excluding this overlay)
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
        {/* Header with drag handle */}
        <div
          className="flex shrink-0 cursor-grab items-center gap-2 border-b bg-muted/50 px-3 py-2 active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <GripVertical className="size-4 text-muted-foreground" />
          <span className="flex-1 text-sm font-medium">Visual Edit</span>
          <Button variant="ghost" size="icon" className="size-6" onClick={closePanel}>
            <X className="size-4" />
          </Button>
        </div>

        {/* Element info section */}
        {elementInfo && (
          <div className="shrink-0 border-b px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <code className="text-sm font-semibold text-foreground">
                    &lt;{elementInfo.tagName}&gt;
                  </code>
                  {elementInfo.id && (
                    <span className="text-xs text-muted-foreground">#{elementInfo.id}</span>
                  )}
                </div>
                {elementInfo.classList.length > 0 && (
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    .{elementInfo.classList.slice(0, 3).join(' .')}
                    {elementInfo.classList.length > 3 && ` +${elementInfo.classList.length - 3}`}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={selectParent}
                disabled={!elementInfo.parentElement}
                className="h-7 shrink-0 px-2 text-xs"
              >
                <ChevronUp className="mr-1 size-3" />
                Parent
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

        {/* Collapsible Sections */}
        <div className="flex-1 overflow-y-auto">
          {/* Padding Section */}
          <CollapsibleSection
            title="Padding"
            isOpen={sections.padding ?? true}
            onToggle={() => toggleSection('padding')}
          >
            <CompactSpacingInputs
              type="padding"
              values={{
                top: computedSpacing.paddingTop,
                right: computedSpacing.paddingRight,
                bottom: computedSpacing.paddingBottom,
                left: computedSpacing.paddingLeft,
              }}
              onChange={updateSpacingProperty}
            />
          </CollapsibleSection>

          {/* Margin Section */}
          <CollapsibleSection
            title="Margin"
            isOpen={sections.margin ?? true}
            onToggle={() => toggleSection('margin')}
          >
            <CompactSpacingInputs
              type="margin"
              values={{
                top: computedSpacing.marginTop,
                right: computedSpacing.marginRight,
                bottom: computedSpacing.marginBottom,
                left: computedSpacing.marginLeft,
              }}
              onChange={updateSpacingProperty}
            />
          </CollapsibleSection>

          {/* Flex Section (conditional) */}
          {elementInfo?.isFlexContainer && computedFlex && (
            <CollapsibleSection
              title="Flex"
              isOpen={sections.flex ?? true}
              onToggle={() => toggleSection('flex')}
            >
              <div className="space-y-3">
                {/* Direction */}
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

                {/* Alignment Grid */}
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

                  {/* Distribute dropdown */}
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

                {/* Gap */}
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

        {/* Footer actions */}
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

// Only render in development
export function VisualEditPanel() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (process.env.NODE_ENV !== 'development' || !mounted) {
    return null
  }

  return <VisualEditPanelContent />
}
