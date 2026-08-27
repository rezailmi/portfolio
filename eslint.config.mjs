import nextConfig from 'eslint-config-next'
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'
import stylex from '@stylexjs/eslint-plugin'
import local from './eslint/plugin.js'

const tokenAllow = {
  allow: [
    'components/computer-wrapper.tsx',
    'components/onboarding-screen.tsx',
    'components/congratulations-message.tsx',
    'components/scary-numbers.tsx',
    'app/opengraph-image.tsx',
    'components/mdx-components.tsx',
    'lib/constants.stylex.ts',
    'lib/tokens.stylex.ts',
    'lib/box-styles.ts',
  ],
}

const layoutAllow = {
  allow: [
    'app/base/page.tsx',
    'app/layout.tsx',
    'app/opengraph-image.tsx',
    'components/computer-wrapper.tsx',
    'components/onboarding-screen.tsx',
    'components/congratulations-message.tsx',
    'components/scary-numbers.tsx',
    'components/mdx-components.tsx',
    'components/theme-toggle.tsx',
    'components/nav-main.tsx',
    'components/nav-projects.tsx',
    'components/blur-transition.tsx',
  ],
  allowPrefixes: ['/components/ui/'],
}

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
      local,
    },
    rules: {
      '@stylexjs/valid-styles': 'error',
      '@stylexjs/valid-shorthands': 'warn',
      'local/no-hardcoded-spacing': ['error', tokenAllow],
      'local/no-hardcoded-colors': ['error', tokenAllow],
      'local/no-classname-box': 'error',
      'local/no-raw-html-layout': ['error', layoutAllow],
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
    },
  },
]

export default eslintConfig
