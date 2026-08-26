# Lockfiles, dirty node_modules, and CI

The Vercel red after a Tailwind → StyleX kitchen-sink wave on rezailmi/portfolio was not StyleX. It was lockfile vs local `node_modules`.

## The failure

`package.json` said `"@base-ui/react": "^1.1.0"`.  
`bun.lock` pinned **1.1.0**.  
Local `node_modules` had **1.7.0** (npm / loose resolve from an earlier install).

Wrappers imported `@base-ui/react/drawer` and `@base-ui/react/otp-field`. Those subpaths do not exist on 1.1.0 (Drawer shipped in 1.2.0; OTP Field is later).

Local `bun run build` passed (used 1.7.0).  
Vercel `bun install` + build failed:

```
Module not found: Package path ./drawer is not exported from package .../@base-ui/react
Module not found: Package path ./otp-field is not exported from package .../@base-ui/react
```

Fix: pin `"@base-ui/react": "^1.7.0"` (or the version you actually wrote against) and refresh **the lockfile the host installs**. This project needed both `bun.lock` and `package-lock.json` because humans mix tools.

## Rule

The preview is a clean install of the committed lockfile.

```bash
rm -rf node_modules
<bun|npm|pnpm|yarn> install
<build command the host runs>
```

If that fails, Vercel fails. Do not treat a dirty workspace as green.

## Stale lockfile after a StyleX edit

A Tailwind → StyleX `package.json` edit can leave the lockfile listing Tailwind packages and missing StyleX. Refresh the lockfile the host uses (`bun install` when `installCommand` is `bun install`).

Check the workspace entry in `bun.lock` / the npm lock `packages` node. If it still names `tailwindcss` and not `@stylexjs/stylex`, the lockfile is stale.

## Pin what you import

Before adding a Base UI / Radix / shadcn wrapper:

1. Read the installed package's `exports` map
2. Confirm the lockfile version, not `node_modules`
3. Pin a range that includes those exports

`^1.1.0` is not “use latest 1.x on Vercel”. It is “resolve 1.1.0 from this lockfile until you bump the lockfile”.

## Two lockfiles

If the repo has `bun.lock` and `package-lock.json`, update both when you bump a dependency. Vercel follows `installCommand`. A teammate's `npm install` will fight you if `package-lock.json` stays on 1.1.0.

## CI classification

When preview is red:

1. Read the install + compile log, not the Vercel “Ready / Error” badge alone
2. `Module not found` / `Package path ./x is not exported` → lockfile / version, not StyleX
3. Turbopack + webpack hook error → `next.config` / `buildCommand`
4. Page loads with hashed classes and no paint → CSS extraction (next-and-vercel.md)
5. Do not raise `NODE_OPTIONS` heap until the log shows OOM

## Local postbuild

`bun run build` may rewrite `public/sitemap.xml`. That is not a product change. Leave it unstaged unless the sitemap is the task.

Next may rewrite tracked `AGENTS.md`. Restore it. Do not commit the rewrite.
