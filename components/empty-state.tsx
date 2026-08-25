import type { ReactNode } from 'react'
import * as stylex from '@stylexjs/stylex'
import { colors } from '@/lib/tokens.stylex'

const blurFadeIn = stylex.keyframes({
  from: {
    filter: 'blur(8px)',
    opacity: 0,
  },
  to: {
    filter: 'blur(0px)',
    opacity: 1,
  },
})

const SM = '@media (min-width: 40rem)'

const styles = stylex.create({
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '55svh',
  },
  inner: {
    maxWidth: '24rem',
    paddingInline: '1.5rem',
    width: '100%',
  },
  fade: {
    animationDuration: '0.7s',
    animationFillMode: 'backwards',
    animationName: blurFadeIn,
    animationTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
    },
  },
  illustration: {
    color: colors.foreground,
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: '1.75rem',
  },
  body: {
    color: colors.mutedForeground,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.875rem',
    gap: '0.75rem',
    lineHeight: 1.625,
    marginTop: '0.75rem',
    [SM]: {
      fontSize: '1rem',
    },
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1.5rem',
  },
  svg: {
    marginLeft: '-0.75rem',
    overflow: 'visible',
  },
  sheetBack: {
    fill: colors.muted,
    stroke: `color-mix(in srgb, ${colors.mutedForeground} 40%, transparent)`,
  },
  sheetMid: {
    fill: colors.background,
    stroke: `color-mix(in srgb, ${colors.mutedForeground} 60%, transparent)`,
  },
  sheetFront: {
    fill: colors.background,
    stroke: 'currentColor',
  },
  sheetLines: {
    stroke: `color-mix(in srgb, ${colors.mutedForeground} 70%, transparent)`,
  },
})

interface EmptyStateProps {
  illustration?: ReactNode
  title: string
  children: ReactNode
  actions?: ReactNode
}

export function EmptyState({ illustration, title, children, actions }: EmptyStateProps) {
  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.inner)}>
        {illustration && (
          <div {...stylex.props(styles.fade, styles.illustration)}>{illustration}</div>
        )}
        <h2 {...stylex.props(styles.fade, styles.title)} style={{ animationDelay: '75ms' }}>
          {title}
        </h2>
        <div {...stylex.props(styles.fade, styles.body)} style={{ animationDelay: '150ms' }}>
          {children}
        </div>
        {actions && (
          <div {...stylex.props(styles.fade, styles.actions)} style={{ animationDelay: '225ms' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export function NoteStackIllustration() {
  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      {...stylex.props(styles.svg)}
    >
      <path
        d="M48 56 78 71 48 86 18 71Z"
        {...stylex.props(styles.sheetBack)}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M48 49 78 64 48 79 18 64Z"
        {...stylex.props(styles.sheetMid)}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M48 42 78 57 48 72 18 57Z"
        {...stylex.props(styles.sheetFront)}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <g transform="rotate(-14 48 26)">
        <path
          d="M48 8 76 22 48 36 20 22Z"
          {...stylex.props(styles.sheetFront)}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M36 20.5 54 18M40 25 58 22.5"
          {...stylex.props(styles.sheetLines)}
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
