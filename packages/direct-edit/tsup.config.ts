import { defineConfig } from 'tsup'
import type { Plugin } from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function generateCss() {
  const source = fs.readFileSync(path.resolve(__dirname, 'src/styles.css'), 'utf8')

  const result = await postcss([
    tailwindcss({
      config: path.resolve(__dirname, 'tailwind.config.js'),
    }),
    autoprefixer(),
  ]).process(source, { from: path.resolve(__dirname, 'src/styles.css') })

  return result.css
}

function cssInjectPlugin(): Plugin {
  return {
    name: 'css-inject',
    setup(build) {
      build.onResolve({ filter: /^virtual:direct-edit-styles$/ }, (args) => {
        return {
          path: args.path,
          namespace: 'virtual-css',
        }
      })

      build.onLoad({ filter: /.*/, namespace: 'virtual-css' }, async () => {
        const css = await generateCss()

        // Wrap CSS in a layer and prepend to head (before app styles)
        // so it has lower specificity than the app's Tailwind utilities
        const wrappedCss = `@layer direct-edit {\n${css}\n}`

        return {
          contents: `
const css = ${JSON.stringify(wrappedCss)};
export function injectStyles() {
  if (typeof document !== 'undefined') {
    let style = document.getElementById('direct-edit-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'direct-edit-styles';
      style.textContent = css;
      // Prepend to head so app styles take precedence
      document.head.insertBefore(style, document.head.firstChild);
    }
  }
}
injectStyles();
export default css;
`,
          loader: 'js',
        }
      })

      build.onResolve({ filter: /\.css$/ }, (args) => {
        if (args.path.includes('styles.css')) {
          return {
            path: 'virtual:direct-edit-styles',
            namespace: 'virtual-css',
          }
        }
        return null
      })
    },
  }
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildPlugins: [cssInjectPlugin()],
  banner: {
    js: '"use client";',
  },
})
