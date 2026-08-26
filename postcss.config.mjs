const useWebpack = process.argv.includes('--webpack')

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
