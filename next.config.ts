import type { NextConfig } from 'next'
import path from 'path'
import stylexPlugin from '@stylexswc/nextjs-plugin'

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default stylexPlugin({
  rsOptions: {
    dev: process.env.NODE_ENV !== 'production',
    include: [
      'app/**/*.{ts,tsx}',
      'components/**/*.{ts,tsx}',
      'lib/**/*.{ts,tsx}',
      'hooks/**/*.{ts,tsx}',
    ],
    aliases: {
      '@/*': [path.join(__dirname, '*')],
    },
    unstable_moduleResolution: {
      type: 'commonJS',
    },
  },
  useCSSLayers: true,
})(nextConfig)
