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
  relaxed: 1.625,
  lg: '1.75rem',
  xl: '1.75rem',
  xl2: '2rem',
})

export const space = stylex.defineConsts({
  none: '0',
  '2xs': '0.125rem',
  xs: '0.25rem',
  fine: '0.375rem',
  sm: '0.5rem',
  sm2: '0.625rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.75rem',
  '4xl': '2rem',
  '5xl': '2.5rem',
  '6xl': '3rem',
  '7xl': '4rem',
})

export const shadow = stylex.defineConsts({
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
})

export const zIndex = stylex.defineConsts({
  behind: -1,
  base: 10,
  raised: 20,
  overlay: 50,
  popover: 99999,
})

export const weight = stylex.defineConsts({
  normal: 400,
  medium: 500,
  semibold: 600,
})

export const tracking = stylex.defineConsts({
  tight: '-0.025em',
  wide: '0.05em',
})
