// `next dev` forks its server without CLI args, so argv can't identify the bundler
const useWebpack = !process.env.TURBOPACK

const config = {
  plugins: {
    ...(!useWebpack
      ? {
          '@stylexswc/postcss-plugin': {
            include: [
              'app/**/*.{ts,tsx}',
              'components/**/*.{ts,tsx}',
              'lib/**/*.{ts,tsx}',
              'hooks/**/*.{ts,tsx}',
            ],
            rsOptions: {
              aliases: {
                '@/*': ['./*'],
              },
              dev: process.env.NODE_ENV !== 'production',
              unstable_moduleResolution: {
                type: 'commonJS',
              },
            },
            useCSSLayers: true,
          },
        }
      : {}),
    autoprefixer: {},
  },
}

export default config
