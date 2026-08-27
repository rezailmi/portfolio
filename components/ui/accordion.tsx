'use client'

import { font, space, weight } from '@/lib/constants.stylex'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { ChevronDownIcon } from 'lucide-react'

import { colors } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  chevron: {
    flexShrink: 0,
    height: '1rem',
    pointerEvents: 'none',
    transition: 'transform 0.2s ease-out',
    width: '1rem',
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
  header: {
    display: 'flex',
    margin: 0,
  },
  item: {
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
  },
  panel: {
    fontSize: font.sm,
    overflow: 'hidden',
    paddingBottom: space.lg,
    paddingTop: 0,
  },
  trigger: {
    alignItems: 'center',
    background: 'none',
    borderWidth: 0,
    color: colors.foreground,
    cursor: {
      ':disabled': 'not-allowed',
      default: 'pointer',
    },
    display: 'flex',
    flex: '1',
    fontWeight: weight.medium,
    justifyContent: 'space-between',
    outline: 'none',
    paddingBottom: space.lg,
    paddingTop: space.lg,
    textAlign: 'start',
    textDecorationLine: { ':hover': 'underline', default: 'none' },
    transition: 'color 0.15s ease-out',
    width: '100%',
  },
})

const Accordion = (props: React.ComponentProps<typeof AccordionPrimitive.Root>) => (
  <AccordionPrimitive.Root data-slot="accordion" {...props} />
)

const AccordionItem = ({
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Item>, 'className'> & {
  className?: string
}) => (
  <AccordionPrimitive.Item
    data-slot="accordion-item"
    {...stylex.props(styles.item, customClassName(className), style as StyleXStyles)}
    {...props}
  />
)

const AccordionTrigger = ({
  className,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Trigger>, 'className'> & {
  className?: string
}) => {
  const header = stylex.props(styles.header)
  return (
    <AccordionPrimitive.Header className={header.className} style={header.style}>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        {...stylex.props(styles.trigger, customClassName(className), style as StyleXStyles)}
        render={(renderProps, state) => (
          <button type="button" {...renderProps}>
            {children}
            <ChevronDownIcon {...stylex.props(styles.chevron, state.open && styles.chevronOpen)} />
          </button>
        )}
        {...props}
      />
    </AccordionPrimitive.Header>
  )
}

const AccordionContent = ({
  className,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Panel>, 'className'> & {
  className?: string
}) => (
  <AccordionPrimitive.Panel
    data-slot="accordion-content"
    {...stylex.props(styles.panel, customClassName(className), style as StyleXStyles)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Panel>
)

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
