import * as stylex from '@stylexjs/stylex'

export const mq = stylex.defineConsts({
  sm: '@media (min-width: 40rem)',
  md: '@media (min-width: 48rem)',
  lg: '@media (min-width: 64rem)',
  reduce: '@media (prefers-reduced-motion: reduce)',
})

export const font = stylex.defineConsts({
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  xl2: '1.5rem',
})

export const leading = stylex.defineConsts({
  xs: '1rem',
  sm: '1.25rem',
  base: '1.5rem',
  lg: '1.75rem',
  xl: '1.75rem',
  xl2: '2rem',
})
