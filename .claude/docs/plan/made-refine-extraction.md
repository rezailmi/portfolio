# Plan: Extract direct-edit as `made-refine` npm Package

## Progress

| Phase | Status | Commit |
|-------|--------|--------|
| Phase 1: Consolidate into Package | **Complete** | `be00a16` |
| Phase 2: Create New Repository | **Complete** | `24c441b` |
| Phase 3: Documentation | Pending | - |
| Phase 4: Update Monorepo | Pending | - |

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

- Package renamed to `made-refine` at `/packages/direct-edit/`
- Babel plugin consolidated at `/packages/direct-edit/babel/index.cjs`
- Vite plugin created at `/packages/direct-edit/vite/index.ts`
- Exports: `.`, `./utils`, `./preload`, `./styles`, `./babel`, `./vite`, `./preload.iife`
- Build verified: `bun run build` succeeds, `npm pack` includes all files
- Monorepo `.babelrc` updated to use package export

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

### Phase 3: Documentation

Expand README.md:
```markdown
> ⚠️ **Beta**: Under active development. API may change.

## Installation
npm install made-refine@beta

## Next.js Setup
[.babelrc config + preload script instructions]

## Vite Setup
[vite.config.ts with made-refine/vite plugin]

## Troubleshooting
[Missing file locations, common issues]
```

### Phase 4: Update Monorepo

1. Remove `/packages/direct-edit/` directory
2. Remove `/babel/direct-edit-source.cjs`
3. Install: `bun add made-refine@beta`
4. Update `components/direct-edit.tsx` imports
5. Update `.babelrc` to use `made-refine/babel`

## Files to Modify

| File | Action |
|------|--------|
| `packages/direct-edit/package.json` | Rename, add exports, beta version |
| `packages/direct-edit/tsup.config.ts` | Remove monorepo copy, add vite build |
| `babel/direct-edit-source.cjs` | Move to package, update regex |
| `packages/direct-edit/vite/index.ts` | Create Vite plugin |
| `packages/direct-edit/README.md` | Beta warning, Next.js + Vite docs |

## Verification

1. Build: `bun run build` in package
2. Pack test: `npm pack` and inspect tarball
3. Local link: `npm link` → test in fresh Next.js/Vite projects
4. Verify exports: components, babel plugin, vite plugin, preload, styles
5. Test publish: `npm publish --tag beta --dry-run`
