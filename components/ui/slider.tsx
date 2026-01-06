"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Control className="flex w-full touch-none select-none items-center py-3">
      <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-secondary">
        <SliderPrimitive.Indicator className="h-full rounded-full bg-primary" />
        <SliderPrimitive.Thumb className="h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Track>
    </SliderPrimitive.Control>
  </SliderPrimitive.Root>
))
Slider.displayName = "Slider"

export { Slider }
