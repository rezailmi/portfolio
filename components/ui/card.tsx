import { font, leading, space, shadow, weight, tracking } from '@/lib/constants.stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import * as stylex from '@stylexjs/stylex'

import { colors, radius } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  action: {
    alignSelf: 'start',
    gridColumnStart: '2',
    gridRowEnd: '3',
    gridRowStart: '1',
    justifySelf: 'end',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: radius.xl,
    boxShadow: shadow.sm,
    color: colors.cardForeground,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--card-spacing, 1.5rem)',
    paddingBottom: 'var(--card-spacing, 1.5rem)',
    paddingTop: 'var(--card-spacing, 1.5rem)',
  },
  content: {
    paddingInline: 'var(--card-spacing, 1.5rem)',
  },
  description: {
    color: colors.mutedForeground,
    fontSize: font.sm,
    lineHeight: leading.sm,
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    paddingInline: 'var(--card-spacing, 1.5rem)',
  },
  header: {
    alignItems: 'start',
    display: 'grid',
    gap: space.fine,
    gridTemplateColumns: '1fr auto',
    gridTemplateRows: 'auto auto',
    paddingInline: 'var(--card-spacing, 1.5rem)',
  },
  title: {
    fontWeight: weight.semibold,
    letterSpacing: tracking.tight,
    lineHeight: 1,
  },
})

type DivProps = React.ComponentProps<'div'>

function makeSlot(slot: string, style: StyleXStyles) {
  function Slot({ className, style: styleProp, ...props }: DivProps) {
    return (
      <div
        data-slot={slot}
        {...stylex.props(style, customClassName(className), styleProp as StyleXStyles)}
        {...props}
      />
    )
  }
  Slot.displayName = slot
  return Slot
}

const Card = ({
  className,
  style,
  size = 'default',
  ...props
}: DivProps & { size?: 'default' | 'sm' }) => (
  <div
    {...stylex.props(styles.card, customClassName(className), style as StyleXStyles)}
    data-size={size}
    data-slot="card"
    {...props}
  />
)

const CardHeader = makeSlot('card-header', styles.header)
const CardTitle = makeSlot('card-title', styles.title)
const CardDescription = makeSlot('card-description', styles.description)
const CardAction = makeSlot('card-action', styles.action)
const CardContent = makeSlot('card-content', styles.content)
const CardFooter = makeSlot('card-footer', styles.footer)

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
