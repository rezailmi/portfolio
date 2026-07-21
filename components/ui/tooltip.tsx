'use client'

import * as React from 'react'
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'

import { cn } from '@/lib/utils'

const TooltipProvider = ({
  children,
  delay,
  delayDuration = 300,
  closeDelay = 0,
  ...props
}: {
  children: React.ReactNode
  delay?: number
  delayDuration?: number
  closeDelay?: number
}) => (
  <TooltipPrimitive.Provider delay={delay ?? delayDuration} closeDelay={closeDelay} {...props}>
    {children}
  </TooltipPrimitive.Provider>
)

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Popup>,
  Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>, 'side' | 'align'> & {
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
  }
>(({ className, side, align, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      className="fixed z-[99999]"
    >
      <TooltipPrimitive.Popup
        ref={ref}
        className={cn(
          'overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 ease-out-strong data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 motion-reduce:transition-none',
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = "TooltipContent"

const createTooltipHandle = TooltipPrimitive.createHandle
const TooltipPortal = TooltipPrimitive.Portal
const TooltipPositioner = TooltipPrimitive.Positioner
const TooltipPopup = TooltipPrimitive.Popup

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  createTooltipHandle,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
}
