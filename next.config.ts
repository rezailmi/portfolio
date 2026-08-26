import type { NextConfig } from 'next'
import path from 'path'
import stylexPlugin from '@stylexswc/nextjs-plugin'
import stylexTurbopack from '@stylexswc/nextjs-plugin/turbopack'

const useWebpack = process.argv.includes('--webpack')

const stylexOptions = {
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
      type: 'commonJS' as const,
    },
  },
  useCSSLayers: true,
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default useWebpack
  ? stylexPlugin(stylexOptions)(nextConfig)
  : stylexTurbopack(stylexOptions)(nextConfig)
