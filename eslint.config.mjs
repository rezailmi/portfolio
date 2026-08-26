import nextConfig from 'eslint-config-next'
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'
import stylex from '@stylexjs/eslint-plugin'

const eslintConfig = [
  {
    ignores: ['packages/*/dist/**'],
  },
  ...nextConfig,
  ...coreWebVitals,
  ...typescript,
  {
    plugins: {
      '@stylexjs': stylex,
    },
    rules: {
      '@stylexjs/valid-styles': 'error',
      '@stylexjs/valid-shorthands': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
    },
  },
]

export default eslintConfig
