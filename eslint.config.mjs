import nextConfig from 'eslint-config-next'
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: ['packages/*/dist/**'],
  },
  ...nextConfig,
  ...coreWebVitals,
  ...typescript,
  {
    // Disable new strict React hooks rules that were not enforced before
    // These can be addressed in a separate refactoring task
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
    },
  },
]

export default eslintConfig
