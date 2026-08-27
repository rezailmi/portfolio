import { font, leading, space, shadow } from '@/lib/constants.stylex'
import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { colors, radius } from '@/lib/tokens.stylex'
import { customClassName } from '@/lib/utils.stylex'

const styles = stylex.create({
  root: {
    '::placeholder': { color: colors.mutedForeground },
    backgroundColor: colors.background,
    borderColor: colors.input,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: {
      ':focus-visible': `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
      default: shadow.none,
    },
    color: colors.foreground,
    cursor: { ':disabled': 'not-allowed', default: 'auto' },
    display: 'flex',
    fieldSizing: 'content',
    fontSize: font.sm,
    lineHeight: leading.sm,
    minHeight: '5rem',
    opacity: { ':disabled': 0.5, default: 1 },
    outline: 'none',
    paddingBlock: space.sm,
    paddingInline: space.md,
    width: '100%',
  },
})

const Textarea = ({ className, style, ...props }: React.ComponentProps<'textarea'>) => (
  <textarea
    {...stylex.props(styles.root, customClassName(className), style as StyleXStyles)}
    data-slot="textarea"
    {...props}
  />
)

export { Textarea }
