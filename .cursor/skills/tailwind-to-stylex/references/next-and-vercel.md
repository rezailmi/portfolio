# Next.js 16, StyleX, and Vercel

These failures are from rezailmi/portfolio (Next 16, `@stylexswc/nextjs-plugin`, Vercel). They are not in the public shadcn-labs converter.

## Next 16 default is Turbopack

`next dev` and `next build` use Turbopack unless you pass `--webpack`.

The default export of `@stylexswc/nextjs-plugin` injects `webpack()`. Next 16 then fails:

```
ERROR: This build is using Turbopack, with a webpack config and no turbopack config.
```

Two honest fixes:

1. **Ship webpack** (this portfolio): `next dev --webpack` and `next build --webpack`. Default export of `@stylexswc/nextjs-plugin`. Import `@stylexswc/webpack-plugin/stylex.css` once in the root layout.
2. **Ship Turbopack**: default-import `@stylexswc/nextjs-plugin/turbopack`, add `@stylexswc/postcss-plugin`, and put `@stylex;` in a CSS file the app imports. The PostCSS plugin replaces `@stylex;` with atomic rules.

## Forbidden workaround

Do **not** add empty `turbopack: {}` to `next.config` to silence the error.

That lets Turbopack succeed. It does **not** extract StyleX CSS. The HTML will contain hashed classes (`xc8icb0`, …) and the CSS file will contain only globals. The page looks unstyled.

## Branch the config if both exist

This is the split that shipped (Next 16 + `@stylexswc/nextjs-plugin` 0.18.x). The turbopack entry is a **default export**, not `{ withStylex }`.

```ts
import stylexPlugin from '@stylexswc/nextjs-plugin'
import stylexTurbopack from '@stylexswc/nextjs-plugin/turbopack'

const useWebpack = process.argv.includes('--webpack')

const stylexOptions = {
  rsOptions: {
    dev: process.env.NODE_ENV !== 'production',
    include: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
    aliases: { '@/*': [path.join(__dirname, '*')] },
    unstable_moduleResolution: { type: 'commonJS' as const },
  },
  useCSSLayers: true,
}

export default useWebpack
  ? stylexPlugin(stylexOptions)(nextConfig)
  : stylexTurbopack(stylexOptions)(nextConfig)
```

PostCSS StyleX only when **not** `--webpack`. Branch on `process.argv`, not `process.env.TURBOPACK`:

```js
const useWebpack = process.argv.includes('--webpack')

export default {
  plugins: {
    ...(!useWebpack ? { '@stylexswc/postcss-plugin': { /* same include + rsOptions */ } } : {}),
    autoprefixer: {},
  },
}
```

Two extractors emit duplicate CSS. An unset `TURBOPACK` env when `postcss.config` loads means classes in HTML and no rules in CSS.

## PostCSS env trap

If PostCSS StyleX is gated on `process.env.TURBOPACK` and that env is unset when `postcss.config` is evaluated, extraction never runs.

Prove extraction by searching the emitted CSS chunk for a class from the rendered HTML (`<body class="xc8icb0 …">` must appear as `.xc8icb0` in the CSS).

## Layers

With `useCSSLayers: true`, StyleX atoms land in `@layer priority4`. Put the UA / preflight reset in `@layer priority1`. Unlayered reset loses.

## Vercel build command

`package.json`:

```json
"build": "next build --webpack"
```

`vercel.json` must run that script:

```json
{
  "installCommand": "bun install",
  "buildCommand": "bun run build"
}
```

The Vercel dashboard / framework default is `next build`. That drops `--webpack`. On Next 16 you either hit the webpack-hook error or (if you added empty `turbopack: {}`) a successful unstyled deploy.

Pin `buildCommand` to the same command humans run. Do not assume the dashboard inherits `package.json` `build`.

## Memory

Do **not** set `NODE_OPTIONS='--max-old-space-size=6144'` on a Vercel build to “help StyleX”. On a small builder the process can fail to start in about a minute. Fix extraction and lockfiles first. Raise memory only after a clean OOM in the build log.

## Local build vs sitemap dirt

`npm run build` / `bun run build` may run `postbuild` (next-sitemap) and rewrite tracked `public/sitemap*.xml`. Prefer:

```bash
./node_modules/.bin/next build --webpack
```

when you only need a compile. Restore `AGENTS.md` if Next rewrites it (`git checkout -- AGENTS.md`). Do not commit that rewrite.

## Allowed origins

`next dev` may reject `127.0.0.1` unless `allowedDevOrigins` is set. Use `http://localhost:<port>` for parity dumps and screenshots.

## Prove the preview CSS

After a StyleX production build:

1. Open the HTML for `/`
2. Copy a StyleX class from `body` or a known node
3. Search `.next/static/chunks/*.css` (or the deployed CSS URL) for that class

Class names without rules means Turbopack-without-PostCSS or a failed webpack extract. Do not debug component styles until this passes.
