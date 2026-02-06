"use client"

import { useState } from "react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Accordion
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

// Alert Dialog
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

// Avatar
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Checkbox
import { Checkbox } from '@/components/ui/checkbox'

// Collapsible
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

// Dialog
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

// Dropdown Menu
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu'

// Hover Card
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'

// Label
import { Label } from '@/components/ui/label'
import { Field } from '@base-ui/react/field'

// Popover
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

// Progress
import { Progress } from '@/components/ui/progress'

// Radio Group
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// Separator
import { Separator } from '@/components/ui/separator'

// Slider
import { Slider } from '@/components/ui/slider'

// Switch
import { Switch } from '@/components/ui/switch'

// Tabs
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// Toggle
import { Toggle } from '@/components/ui/toggle'

// Toggle Group
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// Tooltip
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

// Icons
import { ChevronDown, Bold, Italic, Underline } from 'lucide-react'

// Utils
import { cn } from '@/lib/utils'

// Color tokens data
const colorGroups = [
  {
    title: "Core UI",
    description: "Base colors for backgrounds and surfaces",
    colors: [
      { name: "Background", variable: "--background", className: "bg-background" },
      { name: "Foreground", variable: "--foreground", className: "bg-foreground" },
      { name: "Card", variable: "--card", className: "bg-card" },
      { name: "Popover", variable: "--popover", className: "bg-popover" },
      { name: "Border", variable: "--border", className: "bg-border" },
      { name: "Input", variable: "--input", className: "bg-input" },
      { name: "Ring", variable: "--ring", className: "bg-ring" },
    ]
  },
  {
    title: "Semantic Colors",
    description: "Primary, secondary, and state colors",
    colors: [
      { name: "Primary", variable: "--primary", className: "bg-primary" },
      { name: "Primary FG", variable: "--primary-foreground", className: "bg-primary-foreground" },
      { name: "Secondary", variable: "--secondary", className: "bg-secondary" },
      { name: "Muted", variable: "--muted", className: "bg-muted" },
      { name: "Muted FG", variable: "--muted-foreground", className: "bg-muted-foreground" },
      { name: "Accent", variable: "--accent", className: "bg-accent" },
      { name: "Destructive", variable: "--destructive", className: "bg-destructive" },
    ]
  },
  {
    title: "Chart Colors",
    description: "Data visualization palette",
    colors: [
      { name: "Chart 1", variable: "--chart-1", className: "bg-chart-1" },
      { name: "Chart 2", variable: "--chart-2", className: "bg-chart-2" },
      { name: "Chart 3", variable: "--chart-3", className: "bg-chart-3" },
      { name: "Chart 4", variable: "--chart-4", className: "bg-chart-4" },
      { name: "Chart 5", variable: "--chart-5", className: "bg-chart-5" },
    ]
  },
  {
    title: "Sidebar",
    description: "Navigation sidebar colors",
    colors: [
      { name: "Background", variable: "--sidebar-background", className: "bg-sidebar" },
      { name: "Foreground", variable: "--sidebar-foreground", className: "bg-sidebar-foreground" },
      { name: "Primary", variable: "--sidebar-primary", className: "bg-sidebar-primary" },
      { name: "Accent", variable: "--sidebar-accent", className: "bg-sidebar-accent" },
      { name: "Border", variable: "--sidebar-border", className: "bg-sidebar-border" },
    ]
  },
]

export default function BasePage() {
  // State for interactive components
  const [sliderValue, setSliderValue] = useState([50])
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(false)
  const [radioValue, setRadioValue] = useState("option1")
  const [showNotifications, setShowNotifications] = useState(true)
  const [showStatusBar, setShowStatusBar] = useState(false)
  const [dropdownRadio, setDropdownRadio] = useState("top")

  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12 md:py-16">
      {/* Page header */}
      <div className="mb-12 sm:mb-16">
        <h1 className="text-base font-medium sm:text-lg">Base UI Components</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Internal test page showcasing all Base UI components
        </p>
      </div>

      {/* Component sections */}
      <div className="space-y-12 sm:space-y-16">
        {/* 1. Colors */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Colors</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Design system color tokens that adapt to light and dark themes
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-8">
              {colorGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium">{group.title}</h3>
                    <p className="text-xs text-muted-foreground">{group.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {group.colors.map((color) => (
                      <Popover key={color.variable}>
                        <PopoverTrigger
                          render={
                            <button className="flex w-full flex-col items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted">
                              <div
                                className={cn(
                                  "h-8 w-full rounded-md border shadow-xs",
                                  color.className
                                )}
                              />
                              <span className="text-center text-xs text-muted-foreground">
                                {color.name}
                              </span>
                            </button>
                          }
                        />
                        <PopoverContent className="w-auto p-3">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{color.name}</p>
                            <code className="block rounded bg-muted px-2 py-1 text-xs">
                              {color.variable}
                            </code>
                            <code className="block rounded bg-muted px-2 py-1 text-xs">
                              hsl(var({color.variable}))
                            </code>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Separator */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Separator</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Visually or semantically separates content
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm">Horizontal separator</p>
                <Separator className="my-4" />
                <p className="text-sm">Content below separator</p>
              </div>
              <div className="flex h-20 items-center space-x-4">
                <div className="flex-1 text-sm">Left content</div>
                <Separator orientation="vertical" />
                <div className="flex-1 text-sm">Right content</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Label */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Label</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Renders an accessible label associated with controls
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <Field.Root className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Field.Control render={<Input id="name" placeholder="Enter your name" />} />
              </Field.Root>
              <Field.Root className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Field.Control render={<Input id="email" type="email" placeholder="Enter your email" />} />
              </Field.Root>
            </div>
          </div>
        </section>

        {/* 3. Avatar */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Avatar</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              An image element with a fallback for representing the user
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <Avatar className="h-10 w-10">
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <Avatar className="h-16 w-16">
                <AvatarFallback>XL</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </section>

        {/* 4. Checkbox */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Checkbox</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A control that allows the user to toggle between checked and not checked
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <Field.Root>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="checkbox-demo"
                    checked={checkboxChecked}
                    onCheckedChange={(checked) => setCheckboxChecked(checked === true)}
                  />
                  <Label htmlFor="checkbox-demo" className="cursor-pointer">
                    {checkboxChecked ? "Checked" : "Unchecked"}
                  </Label>
                </div>
              </Field.Root>
              <Field.Root>
                <div className="flex items-center space-x-2">
                  <Checkbox id="checkbox-disabled" disabled />
                  <Label htmlFor="checkbox-disabled" className="cursor-not-allowed opacity-50">
                    Disabled checkbox
                  </Label>
                </div>
              </Field.Root>
            </div>
          </div>
        </section>

        {/* 5. Switch */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Switch</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A control that allows the user to toggle between on and off
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="switch-demo"
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                />
                <Field.Root>
                  <Label htmlFor="switch-demo" className="cursor-pointer">
                    {switchChecked ? "On" : "Off"}
                  </Label>
                </Field.Root>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch-disabled" disabled />
                <Field.Root>
                  <Label htmlFor="switch-disabled" className="cursor-not-allowed opacity-50">
                    Disabled switch
                  </Label>
                </Field.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Radio Group */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Radio Group</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A set of checkable buttons where only one can be checked at a time
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <RadioGroup value={radioValue} onValueChange={(value) => setRadioValue(value as string)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="option1" />
                <Field.Root>
                  <Label htmlFor="option1" className="cursor-pointer">
                    Option 1
                  </Label>
                </Field.Root>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="option2" />
                <Field.Root>
                  <Label htmlFor="option2" className="cursor-pointer">
                    Option 2
                  </Label>
                </Field.Root>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="option3" />
                <Field.Root>
                  <Label htmlFor="option3" className="cursor-pointer">
                    Option 3
                  </Label>
                </Field.Root>
              </div>
            </RadioGroup>
          </div>
        </section>

        {/* 7. Slider */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Slider</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              An input where the user selects a value from within a given range
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <Field.Root className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Value: {sliderValue[0]}</Label>
                </div>
                <Slider
                  value={sliderValue}
                  onValueChange={(value) => setSliderValue(Array.isArray(value) ? value : [value])}
                  max={100}
                  step={1}
                />
              </div>
            </Field.Root>
          </div>
        </section>

        {/* 8. Progress */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Progress</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Displays an indicator showing the completion progress
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <Field.Root className="space-y-2">
                <Label>0%</Label>
                <Progress value={0} />
              </Field.Root>
              <Field.Root className="space-y-2">
                <Label>33%</Label>
                <Progress value={33} />
              </Field.Root>
              <Field.Root className="space-y-2">
                <Label>66%</Label>
                <Progress value={66} />
              </Field.Root>
              <Field.Root className="space-y-2">
                <Label>100%</Label>
                <Progress value={100} />
              </Field.Root>
            </div>
          </div>
        </section>

        {/* 9. Toggle */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Toggle</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A two-state button that can be either on or off
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <Toggle aria-label="Toggle bold">
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle aria-label="Toggle italic">
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle aria-label="Toggle underline">
                <Underline className="h-4 w-4" />
              </Toggle>
            </div>
          </div>
        </section>

        {/* 10. Toggle Group */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Toggle Group</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A set of two-state buttons that can be toggled on or off
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Field.Root>
                  <Label>Toggle group example</Label>
                </Field.Root>
                <ToggleGroup>
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Toggle underline">
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Accordion */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Accordion</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A vertically stacked set of interactive headings that reveal content
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Base UI?</AccordionTrigger>
                <AccordionContent>
                  Base UI is a library of unstyled, accessible React components for building user
                  interfaces.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does it work?</AccordionTrigger>
                <AccordionContent>
                  Base UI provides headless components that you can style with any CSS solution you
                  prefer.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Why use Base UI?</AccordionTrigger>
                <AccordionContent>
                  It offers full control over styling while providing robust accessibility and
                  behavior out of the box.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* 12. Collapsible */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Collapsible</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              An interactive component which expands/collapses a panel
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <span className="text-sm font-medium">Can I use this in my project?</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Yes! Base UI is free and open source. You can use it in any project, personal or
                  commercial.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>

        {/* 13. Tabs */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Tabs</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A set of layered sections of content that display one panel at a time
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Account</TabsTrigger>
                <TabsTrigger value="tab2">Password</TabsTrigger>
                <TabsTrigger value="tab3">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Account settings and profile information.
                </p>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Change your password and security settings.
                </p>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  General application settings and preferences.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* 14. Tooltip */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Tooltip</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A popup that displays information related to an element when focused or hovered
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger render={<Button>Another tooltip</Button>} />
                  <TooltipContent side="bottom">
                    <p>Tooltip positioned at bottom</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </section>

        {/* 15. Hover Card */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Hover Card</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              For sighted users to preview content available behind a link
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <HoverCard>
              <HoverCardTrigger className="cursor-pointer underline">
                Hover over me
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Base UI</h4>
                  <p className="text-sm text-muted-foreground">
                    A library of unstyled, accessible React components.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </section>

        {/* 16. Popover */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Popover</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Displays rich content in a portal, triggered by a button
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <Popover>
              <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the dimensions for the layer.
                  </p>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Field.Root>
                        <Label htmlFor="width">Width</Label>
                        <Field.Control render={<Input id="width" defaultValue="100%" className="col-span-2 h-8" />} />
                      </Field.Root>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Field.Root>
                        <Label htmlFor="height">Height</Label>
                        <Field.Control render={<Input id="height" defaultValue="25px" className="col-span-2 h-8" />} />
                      </Field.Root>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* 17. Dialog */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Dialog</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A window overlaid on either the primary window or another dialog
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <Dialog>
              <DialogTrigger render={<Button>Open Dialog</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Field.Root>
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Field.Control render={<Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />} />
                    </Field.Root>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Field.Root>
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Field.Control render={<Input id="username" defaultValue="@peduarte" className="col-span-3" />} />
                    </Field.Root>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* 18. Alert Dialog */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Alert Dialog</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A modal dialog that interrupts the user with important content
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive">Delete Account</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and
                    remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        {/* 19. Dropdown Menu */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-base font-medium">Dropdown Menu</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Displays a menu to the user triggered by a button
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showNotifications}
                  onCheckedChange={setShowNotifications}
                >
                  Show Notifications
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showStatusBar}
                  onCheckedChange={setShowStatusBar}
                >
                  Show Status Bar
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={dropdownRadio} onValueChange={(value) => setDropdownRadio(value as string)}>
                    <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More Tools</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Save Page As...</DropdownMenuItem>
                    <DropdownMenuItem>Create Shortcut...</DropdownMenuItem>
                    <DropdownMenuItem>Name Window...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
      </div>
    </div>
  )
}
