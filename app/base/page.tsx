'use client'

import { useState, type ReactNode } from 'react'
import * as stylex from '@stylexjs/stylex'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { Label } from '@/components/ui/label'
import { Field } from '@base-ui/react/field'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { ChevronDown, Bold, Italic, Underline } from 'lucide-react'
import { colors, radius } from '@/lib/tokens.stylex'

const SM = '@media (min-width: 40rem)'
const MD = '@media (min-width: 48rem)'
const LG = '@media (min-width: 64rem)'

const styles = stylex.create({
  page: {
    flex: 1,
    marginInline: 'auto',
    maxWidth: '42rem',
    paddingBlock: '2rem',
    paddingInline: '1rem',
    [SM]: {
      paddingBlock: '3rem',
      paddingInline: '1.5rem',
    },
    [MD]: {
      paddingBlock: '4rem',
    },
  },
  header: {
    marginBottom: '3rem',
    [SM]: {
      marginBottom: '4rem',
    },
  },
  pageTitle: {
    fontSize: '1rem',
    fontWeight: 500,
    [SM]: {
      fontSize: '1.125rem',
    },
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
    [SM]: {
      fontSize: '1rem',
    },
  },
  mutedSm: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
  },
  mutedXs: {
    color: colors.mutedForeground,
    fontSize: '0.75rem',
  },
  swatchLabel: {
    textAlign: 'center',
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    [SM]: {
      gap: '4rem',
    },
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '0.75rem',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '1.5rem',
  },
  stack8: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  stack4: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  stack3: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  stack2: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  colorGrid: {
    display: 'grid',
    gap: '0.75rem',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    [SM]: {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
    [LG]: {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
  swatchButton: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.muted,
    },
    borderRadius: radius.md,
    borderWidth: 0,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.5rem',
    transition: 'background-color 150ms',
    width: '100%',
  },
  swatch: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: '0 1px 2px rgb(0 0 0 / 0.05)',
    height: '2rem',
    width: '100%',
  },
  popover: {
    padding: '0.75rem',
    width: 'auto',
  },
  code: {
    backgroundColor: colors.muted,
    borderRadius: radius.sm,
    display: 'block',
    fontSize: '0.75rem',
    paddingBlock: '0.25rem',
    paddingInline: '0.5rem',
  },
  textSm: {
    fontSize: '0.875rem',
  },
  sepBlock: {
    marginBlock: '1rem',
  },
  split: {
    alignItems: 'center',
    display: 'flex',
    gap: '1rem',
    height: '5rem',
  },
  flex1: {
    flex: 1,
    fontSize: '0.875rem',
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
  },
  row4: {
    alignItems: 'center',
    display: 'flex',
    gap: '1rem',
  },
  pointer: {
    cursor: 'pointer',
  },
  disabledLabel: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  between: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  icon: {
    height: '1rem',
    width: '1rem',
  },
  avatar8: { height: '2rem', width: '2rem' },
  avatar10: { height: '2.5rem', width: '2.5rem' },
  avatar12: { height: '3rem', width: '3rem' },
  avatar16: { height: '4rem', width: '4rem' },
  collapseTrigger: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  collapseBody: {
    marginTop: '0.5rem',
  },
  tabPanel: {
    marginTop: '1rem',
  },
  hoverTrigger: {
    cursor: 'pointer',
    textDecorationLine: 'underline',
  },
  wide: {
    width: '20rem',
  },
  menu: {
    width: '14rem',
  },
  formGrid: {
    display: 'grid',
    gap: '1rem',
    paddingBlock: '1rem',
  },
  formRow: {
    alignItems: 'center',
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
  dimRow: {
    alignItems: 'center',
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
  right: {
    textAlign: 'right',
  },
  inputSpan2: {
    gridColumn: 'span 2',
    height: '2rem',
  },
  inputSpan3: {
    gridColumn: 'span 3',
  },
  medium: {
    fontWeight: 500,
  },
  headingTight: {
    fontWeight: 500,
    lineHeight: 1,
  },
  semibold: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
})

const colorGroups = [
  {
    title: 'Core UI',
    description: 'Base colors for backgrounds and surfaces',
    colors: [
      { name: 'Background', variable: '--background' },
      { name: 'Foreground', variable: '--foreground' },
      { name: 'Card', variable: '--card' },
      { name: 'Popover', variable: '--popover' },
      { name: 'Border', variable: '--border' },
      { name: 'Input', variable: '--input' },
      { name: 'Ring', variable: '--ring' },
    ],
  },
  {
    title: 'Semantic Colors',
    description: 'Primary, secondary, and state colors',
    colors: [
      { name: 'Primary', variable: '--primary' },
      { name: 'Primary FG', variable: '--primary-foreground' },
      { name: 'Secondary', variable: '--secondary' },
      { name: 'Muted', variable: '--muted' },
      { name: 'Muted FG', variable: '--muted-foreground' },
      { name: 'Accent', variable: '--accent' },
      { name: 'Destructive', variable: '--destructive' },
    ],
  },
  {
    title: 'Chart Colors',
    description: 'Data visualization palette',
    colors: [
      { name: 'Chart 1', variable: '--chart-1' },
      { name: 'Chart 2', variable: '--chart-2' },
      { name: 'Chart 3', variable: '--chart-3' },
      { name: 'Chart 4', variable: '--chart-4' },
      { name: 'Chart 5', variable: '--chart-5' },
    ],
  },
  {
    title: 'Sidebar',
    description: 'Navigation sidebar colors',
    colors: [
      { name: 'Background', variable: '--sidebar-background' },
      { name: 'Foreground', variable: '--sidebar-foreground' },
      { name: 'Primary', variable: '--sidebar-primary' },
      { name: 'Accent', variable: '--sidebar-accent' },
      { name: 'Border', variable: '--sidebar-border' },
    ],
  },
]

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section {...stylex.props(styles.section)}>
      <div>
        <h2 {...stylex.props(styles.heading)}>{title}</h2>
        <p {...stylex.props(styles.muted)}>{description}</p>
      </div>
      <div {...stylex.props(styles.card)}>{children}</div>
    </section>
  )
}

export default function BasePage() {
  const [sliderValue, setSliderValue] = useState([50])
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [showNotifications, setShowNotifications] = useState(true)
  const [showStatusBar, setShowStatusBar] = useState(false)
  const [dropdownRadio, setDropdownRadio] = useState('top')

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.header)}>
        <h1 {...stylex.props(styles.pageTitle)}>Base UI Components</h1>
        <p {...stylex.props(styles.muted)}>Internal test page showcasing all Base UI components</p>
      </div>

      <div {...stylex.props(styles.sections)}>
        <Section
          title="Colors"
          description="Design system color tokens that adapt to light and dark themes"
        >
          <div {...stylex.props(styles.stack8)}>
            {colorGroups.map((group) => (
              <div key={group.title} {...stylex.props(styles.stack3)}>
                <div>
                  <h3 {...stylex.props(styles.medium, styles.textSm)}>{group.title}</h3>
                  <p {...stylex.props(styles.mutedXs)}>{group.description}</p>
                </div>
                <div {...stylex.props(styles.colorGrid)}>
                  {group.colors.map((color) => (
                    <Popover key={color.variable}>
                      <PopoverTrigger
                        render={
                          <button {...stylex.props(styles.swatchButton)}>
                            <div
                              {...stylex.props(styles.swatch)}
                              style={{ backgroundColor: `var(${color.variable})` }}
                            />
                            <span {...stylex.props(styles.mutedXs, styles.swatchLabel)}>{color.name}</span>
                          </button>
                        }
                      />
                      <PopoverContent className={stylex.props(styles.popover).className}>
                        <div {...stylex.props(styles.stack2)}>
                          <p {...stylex.props(styles.medium, styles.textSm)}>{color.name}</p>
                          <code {...stylex.props(styles.code)}>{color.variable}</code>
                          <code {...stylex.props(styles.code)}>hsl(var({color.variable}))</code>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Separator" description="Visually or semantically separates content">
          <div {...stylex.props(styles.stack4)}>
            <div>
              <p {...stylex.props(styles.textSm)}>Horizontal separator</p>
              <Separator className={stylex.props(styles.sepBlock).className} />
              <p {...stylex.props(styles.textSm)}>Content below separator</p>
            </div>
            <div {...stylex.props(styles.split)}>
              <div {...stylex.props(styles.flex1)}>Left content</div>
              <Separator orientation="vertical" />
              <div {...stylex.props(styles.flex1)}>Right content</div>
            </div>
          </div>
        </Section>

        <Section title="Label" description="Renders an accessible label associated with controls">
          <div {...stylex.props(styles.stack4)}>
            <Field.Root {...stylex.props(styles.stack2)}>
              <Label htmlFor="name">Name</Label>
              <Field.Control render={<Input id="name" placeholder="Enter your name" />} />
            </Field.Root>
            <Field.Root {...stylex.props(styles.stack2)}>
              <Label htmlFor="email">Email</Label>
              <Field.Control
                render={<Input id="email" type="email" placeholder="Enter your email" />}
              />
            </Field.Root>
          </div>
        </Section>

        <Section
          title="Avatar"
          description="An image element with a fallback for representing the user"
        >
          <div {...stylex.props(styles.row4)}>
            <Avatar className={stylex.props(styles.avatar8).className}>
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar className={stylex.props(styles.avatar10).className}>
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar className={stylex.props(styles.avatar12).className}>
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <Avatar className={stylex.props(styles.avatar16).className}>
              <AvatarFallback>XL</AvatarFallback>
            </Avatar>
          </div>
        </Section>

        <Section
          title="Checkbox"
          description="A control that allows the user to toggle between checked and not checked"
        >
          <div {...stylex.props(styles.stack4)}>
            <Field.Root>
              <div {...stylex.props(styles.row)}>
                <Checkbox
                  id="checkbox-demo"
                  checked={checkboxChecked}
                  onCheckedChange={(checked) => setCheckboxChecked(checked === true)}
                />
                <Label htmlFor="checkbox-demo" className={stylex.props(styles.pointer).className}>
                  {checkboxChecked ? 'Checked' : 'Unchecked'}
                </Label>
              </div>
            </Field.Root>
            <Field.Root>
              <div {...stylex.props(styles.row)}>
                <Checkbox id="checkbox-disabled" disabled />
                <Label
                  htmlFor="checkbox-disabled"
                  className={stylex.props(styles.disabledLabel).className}
                >
                  Disabled checkbox
                </Label>
              </div>
            </Field.Root>
          </div>
        </Section>

        <Section
          title="Switch"
          description="A control that allows the user to toggle between on and off"
        >
          <div {...stylex.props(styles.stack4)}>
            <div {...stylex.props(styles.row)}>
              <Switch
                id="switch-demo"
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
              />
              <Field.Root>
                <Label htmlFor="switch-demo" className={stylex.props(styles.pointer).className}>
                  {switchChecked ? 'On' : 'Off'}
                </Label>
              </Field.Root>
            </div>
            <div {...stylex.props(styles.row)}>
              <Switch id="switch-disabled" disabled />
              <Field.Root>
                <Label
                  htmlFor="switch-disabled"
                  className={stylex.props(styles.disabledLabel).className}
                >
                  Disabled switch
                </Label>
              </Field.Root>
            </div>
          </div>
        </Section>

        <Section
          title="Radio Group"
          description="A set of checkable buttons where only one can be checked at a time"
        >
          <RadioGroup value={radioValue} onValueChange={(value) => setRadioValue(value as string)}>
            <div {...stylex.props(styles.row)}>
              <RadioGroupItem value="option1" id="option1" />
              <Field.Root>
                <Label htmlFor="option1" className={stylex.props(styles.pointer).className}>
                  Option 1
                </Label>
              </Field.Root>
            </div>
            <div {...stylex.props(styles.row)}>
              <RadioGroupItem value="option2" id="option2" />
              <Field.Root>
                <Label htmlFor="option2" className={stylex.props(styles.pointer).className}>
                  Option 2
                </Label>
              </Field.Root>
            </div>
            <div {...stylex.props(styles.row)}>
              <RadioGroupItem value="option3" id="option3" />
              <Field.Root>
                <Label htmlFor="option3" className={stylex.props(styles.pointer).className}>
                  Option 3
                </Label>
              </Field.Root>
            </div>
          </RadioGroup>
        </Section>

        <Section
          title="Slider"
          description="An input where the user selects a value from within a given range"
        >
          <Field.Root {...stylex.props(styles.stack4)}>
            <div {...stylex.props(styles.stack2)}>
              <div {...stylex.props(styles.between)}>
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
        </Section>

        <Section title="Progress" description="Displays an indicator showing the completion progress">
          <div {...stylex.props(styles.stack4)}>
            <Field.Root {...stylex.props(styles.stack2)}>
              <Label>0%</Label>
              <Progress value={0} />
            </Field.Root>
            <Field.Root {...stylex.props(styles.stack2)}>
              <Label>33%</Label>
              <Progress value={33} />
            </Field.Root>
            <Field.Root {...stylex.props(styles.stack2)}>
              <Label>66%</Label>
              <Progress value={66} />
            </Field.Root>
            <Field.Root {...stylex.props(styles.stack2)}>
              <Label>100%</Label>
              <Progress value={100} />
            </Field.Root>
          </div>
        </Section>

        <Section title="Toggle" description="A two-state button that can be either on or off">
          <div {...stylex.props(styles.row)}>
            <Toggle aria-label="Toggle bold">
              <Bold {...stylex.props(styles.icon)} />
            </Toggle>
            <Toggle aria-label="Toggle italic">
              <Italic {...stylex.props(styles.icon)} />
            </Toggle>
            <Toggle aria-label="Toggle underline">
              <Underline {...stylex.props(styles.icon)} />
            </Toggle>
          </div>
        </Section>

        <Section
          title="Toggle Group"
          description="A set of two-state buttons that can be toggled on or off"
        >
          <div {...stylex.props(styles.stack4)}>
            <div {...stylex.props(styles.stack2)}>
              <Field.Root>
                <Label>Toggle group example</Label>
              </Field.Root>
              <ToggleGroup>
                <ToggleGroupItem value="bold" aria-label="Toggle bold">
                  <Bold {...stylex.props(styles.icon)} />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic">
                  <Italic {...stylex.props(styles.icon)} />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Toggle underline">
                  <Underline {...stylex.props(styles.icon)} />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </Section>

        <Section
          title="Accordion"
          description="A vertically stacked set of interactive headings that reveal content"
        >
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
        </Section>

        <Section
          title="Collapsible"
          description="An interactive component which expands/collapses a panel"
        >
          <Collapsible>
            <CollapsibleTrigger className={stylex.props(styles.collapseTrigger).className}>
              <span {...stylex.props(styles.medium, styles.textSm)}>
                Can I use this in my project?
              </span>
              <ChevronDown {...stylex.props(styles.icon)} />
            </CollapsibleTrigger>
            <CollapsibleContent className={stylex.props(styles.collapseBody).className}>
              <p {...stylex.props(styles.mutedSm)}>
                Yes! Base UI is free and open source. You can use it in any project, personal or
                commercial.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </Section>

        <Section
          title="Tabs"
          description="A set of layered sections of content that display one panel at a time"
        >
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
              <TabsTrigger value="tab3">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className={stylex.props(styles.tabPanel).className}>
              <p {...stylex.props(styles.mutedSm)}>Account settings and profile information.</p>
            </TabsContent>
            <TabsContent value="tab2" className={stylex.props(styles.tabPanel).className}>
              <p {...stylex.props(styles.mutedSm)}>Change your password and security settings.</p>
            </TabsContent>
            <TabsContent value="tab3" className={stylex.props(styles.tabPanel).className}>
              <p {...stylex.props(styles.mutedSm)}>General application settings and preferences.</p>
            </TabsContent>
          </Tabs>
        </Section>

        <Section
          title="Tooltip"
          description="A popup that displays information related to an element when focused or hovered"
        >
          <div {...stylex.props(styles.row4)}>
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
        </Section>

        <Section
          title="Hover Card"
          description="For sighted users to preview content available behind a link"
        >
          <HoverCard>
            <HoverCardTrigger className={stylex.props(styles.hoverTrigger).className}>
              Hover over me
            </HoverCardTrigger>
            <HoverCardContent className={stylex.props(styles.wide).className}>
              <div {...stylex.props(styles.stack2)}>
                <h4 {...stylex.props(styles.semibold)}>Base UI</h4>
                <p {...stylex.props(styles.mutedSm)}>
                  A library of unstyled, accessible React components.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Section>

        <Section
          title="Popover"
          description="Displays rich content in a portal, triggered by a button"
        >
          <Popover>
            <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
            <PopoverContent className={stylex.props(styles.wide).className}>
              <div {...stylex.props(styles.stack2)}>
                <h4 {...stylex.props(styles.headingTight)}>Dimensions</h4>
                <p {...stylex.props(styles.mutedSm)}>Set the dimensions for the layer.</p>
                <div {...stylex.props(styles.stack2)}>
                  <div {...stylex.props(styles.dimRow)}>
                    <Field.Root>
                      <Label htmlFor="width">Width</Label>
                      <Field.Control
                        render={
                          <Input
                            id="width"
                            defaultValue="100%"
                            className={stylex.props(styles.inputSpan2).className}
                          />
                        }
                      />
                    </Field.Root>
                  </div>
                  <div {...stylex.props(styles.dimRow)}>
                    <Field.Root>
                      <Label htmlFor="height">Height</Label>
                      <Field.Control
                        render={
                          <Input
                            id="height"
                            defaultValue="25px"
                            className={stylex.props(styles.inputSpan2).className}
                          />
                        }
                      />
                    </Field.Root>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </Section>

        <Section
          title="Dialog"
          description="A window overlaid on either the primary window or another dialog"
        >
          <Dialog>
            <DialogTrigger render={<Button>Open Dialog</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div {...stylex.props(styles.formGrid)}>
                <div {...stylex.props(styles.formRow)}>
                  <Field.Root>
                    <Label htmlFor="dialog-name" className={stylex.props(styles.right).className}>
                      Name
                    </Label>
                    <Field.Control
                      render={
                        <Input
                          id="dialog-name"
                          defaultValue="Pedro Duarte"
                          className={stylex.props(styles.inputSpan3).className}
                        />
                      }
                    />
                  </Field.Root>
                </div>
                <div {...stylex.props(styles.formRow)}>
                  <Field.Root>
                    <Label htmlFor="username" className={stylex.props(styles.right).className}>
                      Username
                    </Label>
                    <Field.Control
                      render={
                        <Input
                          id="username"
                          defaultValue="@peduarte"
                          className={stylex.props(styles.inputSpan3).className}
                        />
                      }
                    />
                  </Field.Root>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section
          title="Alert Dialog"
          description="A modal dialog that interrupts the user with important content"
        >
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive">Delete Account</Button>} />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>

        <Section title="Dropdown Menu" description="Displays a menu to the user triggered by a button">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
            <DropdownMenuContent className={stylex.props(styles.menu).className}>
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
              <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
                Show Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={dropdownRadio}
                  onValueChange={(value) => setDropdownRadio(value as string)}
                >
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
        </Section>
      </div>
    </div>
  )
}
