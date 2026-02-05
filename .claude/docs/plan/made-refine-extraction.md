# Plan: Extract direct-edit as `made-refine` npm Package

## Progress

| Phase | Status | Commit |
|-------|--------|--------|
| Phase 1: Consolidate into Package | **Complete** | `be00a16` |
| Phase 2: Create New Repository | **Complete** | `24c441b` |
| Phase 3: Documentation | **Complete** | `c7899bf` |
| Phase 4: Update Monorepo | **Complete** | - |

**Last updated**: 2026-02-05
**Repository**: https://github.com/rezailmi/made-refine

---

## Overview

Extract the `packages/direct-edit/` visual CSS editor into a standalone npm package called `made-refine` for distribution to other apps.

## Decisions

- **Package name**: `made-refine`
- **Distribution**: Traditional npm package
- **Versioning**: `0.x.x-beta.x` with beta tag until stable
- **Framework support**: Next.js + Vite from the start
- **Monorepo integration**: Clean separation via npm install

## Current State

**Extraction complete.** The monorepo now consumes `made-refine` as an npm dependency:
- Installed: `made-refine@0.1.0-beta.3`
- Preload script: `public/made-refine-preload.js` (copied from npm package)
- Removed: `/packages/direct-edit/`, `/babel/direct-edit-source.cjs`, workspaces config
- Build verified: `bun run build` succeeds

## Extraction Steps

### Phase 1: Consolidate into Package ✅

1. **Move Babel plugin into package** ✅
   - [x] Copy `/babel/direct-edit-source.cjs` → `/packages/direct-edit/babel/index.cjs`
   - [x] Update exclusion regex: `/packages/direct-edit/` → `/node_modules/made-refine/`
   - [x] Add export: `"./babel": { "require": "./babel/index.cjs" }`

2. **Create Vite plugin** ✅
   - [x] Create `/packages/direct-edit/vite/index.ts`
   - [x] Auto-inject preload script in dev mode
   - [x] Add types at `/packages/direct-edit/vite/index.d.ts`
   - [x] Add export: `"./vite": { "types": "./vite/index.d.ts", "import": "./dist/vite.mjs" }`

3. **Update tsup.config.ts** ✅
   - [x] Remove `copyPreloadAssetPlugin` (monorepo-specific)
   - [x] Add IIFE preload export at `./preload.iife`
   - [x] Add vite plugin build target

4. **Update package.json** ✅
   - [x] Rename to `made-refine`
   - [x] Set version to `0.1.0-beta.1`
   - [x] Add `"./babel"`, `"./vite"`, `"./preload.iife"` exports
   - [x] Add `"babel"` and `"vite"` to `files` array
   - [x] Update repository URLs (done in Phase 2)

5. **Update monorepo .babelrc** ✅
   - [x] Change plugin path from `./babel/direct-edit-source.cjs` to `direct-edit/babel`

### Phase 2: Create New Repository ✅

1. [x] Create GitHub repo: `made-refine`
2. [x] Copy package contents + consolidated babel plugin
3. [x] Add GitHub Actions workflow:
   - CI: build, typecheck on push/PR
   - Publish: `npm publish --tag beta` on release
4. [x] Update package.json with repository URLs
5. [x] Verify build and CI passes

**Note**: Add `NPM_TOKEN` secret to repo before first release.

### Phase 3: Documentation ✅

1. [x] Add beta warning to README
2. [x] Add detailed Next.js setup section (Babel plugin + preload script + component)
3. [x] Add detailed Vite setup section (vite.config.ts with plugin + component)
4. [x] Add troubleshooting section (source locations, styles, common errors)
5. [x] Update all references from `direct-edit` to `made-refine`
6. [x] Streamline exports and features documentation

### Phase 4: Update Monorepo ✅

1. [x] Remove `/packages/direct-edit/` directory
2. [x] Remove `/babel/direct-edit-source.cjs`
3. [x] Remove empty `/packages/` and `/babel/` directories
4. [x] Remove `workspaces` config and `prebuild` script from `package.json`
5. [x] Install: `bun add made-refine@beta`
6. [x] Update `components/direct-edit.tsx` imports to `made-refine`
7. [x] Update `components/editable-area.tsx` imports to `made-refine`
8. [x] Update `app/edit/page.tsx` imports to `made-refine`
9. [x] Update `.babelrc` to use `made-refine/babel`
10. [x] Update `app/layout.tsx` preload script path to `/made-refine-preload.js`
11. [x] Copy preload script: `cp node_modules/made-refine/dist/preload/preload.js public/made-refine-preload.js`
12. [x] Verify build: `bun run build` succeeds

## Notes

- The preload script at `public/made-refine-preload.js` should be updated when upgrading `made-refine`:
  ```bash
  cp node_modules/made-refine/dist/preload/preload.js public/made-refine-preload.js
  ```
- The ESLint warning on the preload script (unused variable) is expected for IIFE bundles
