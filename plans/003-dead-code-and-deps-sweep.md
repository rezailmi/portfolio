# Plan 003: Remove dead UI components, orphaned dependencies, and leftover package scaffolding

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4b1efd5..HEAD -- components/ui package.json packages`
> If files changed since this plan was written, re-run the step-1 importer
> check before deleting anything; on a mismatch (a "dead" file gained an
> importer), treat it as a STOP condition for that file.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `4b1efd5`, 2026-07-02

## Why this matters

This repo started from a v0 scaffold and carries a large amount of generated code that nothing uses: 15 files in `components/ui/` have zero importers, and they are the only thing keeping ~11 production dependencies (recharts, embla-carousel, cmdk, vaul, sonner, react-hook-form, zod, and more) in `package.json`. None of this ships in the client bundle (tree-shaking handles that), but it inflates installs, the lockfile, `bun audit` noise, and — most costly — the maintenance surface: one dead file (`components/ui/use-mobile.tsx`) is a divergent copy of a live hook and is a real trap if someone imports the wrong path. There is also an empty leftover `packages/direct-edit/` directory from before that package was extracted to npm as `made-refine`, and a dead `generateSitemapUrls()` duplicated by `next-sitemap.config.js`.

## Current state

- **Dead `components/ui/` files (verified zero importers across `app/ components/ lib/ hooks/`, including intra-`ui/` imports, at commit `4b1efd5`)**: `alert.tsx`, `aspect-ratio.tsx`, `badge.tsx`, `carousel.tsx`, `chart.tsx`, `command.tsx`, `drawer.tsx`, `form.tsx`, `input-otp.tsx`, `pagination.tsx`, `resizable.tsx`, `sonner.tsx`, `table.tsx`, `textarea.tsx`, `use-mobile.tsx`.
  - Note: `app/base/page.tsx` is a component gallery importing 21 `ui/` modules, but none of the 15 above — verified.
  - Keep `sheet.tsx` and `skeleton.tsx` — they are imported by `components/ui/sidebar.tsx`.
  - `components/ui/use-mobile.tsx` is a drifted duplicate of the live `hooks/use-mobile.tsx` (different initial state `undefined` vs `false`, `window.innerWidth` vs `mql.matches`). The live one is imported by `components/ui/sidebar.tsx:8`.
- **Dependencies orphaned once those files are gone** (each verified imported ONLY by a file in the delete list, or by nothing):
  - `react-hook-form`, `@hookform/resolvers` (ui/form.tsx), `zod` (nothing), `recharts` (ui/chart.tsx), `embla-carousel-react` (ui/carousel.tsx), `cmdk` (ui/command.tsx), `input-otp` (ui/input-otp.tsx), `vaul` (ui/drawer.tsx), `react-resizable-panels` (ui/resizable.tsx), `sonner` (ui/sonner.tsx).
  - `prismjs` — zero JS imports anywhere; syntax highlighting comes from `rehype-prism-plus` (which bundles `refractor`, not `prismjs`) in `components/layout-content.tsx:4,30`, and `app/globals.css` defines its own `--code-background` with no Prism theme import. Treat with extra care (step 4).
- **`packages/direct-edit/`** — contains only `.gitignore` plus untracked `dist/` and `node_modules/`; no source. Consumers import from the published `made-refine` package (`app/layout.tsx:20`, `app/edit/page.tsx:3`). `package.json` has no `workspaces` field.
- **`lib/content.ts:138-153`** — `generateSitemapUrls()` is exported but never imported; `next-sitemap.config.js` reimplements the same logic independently.
- `package.json:2` — project is still named `"my-v0-project"`.

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Install   | `bun install`                      | exit 0, lockfile updated |
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0              |
| Lint      | `bun lint`                         | exit 0              |
| Build     | `./node_modules/.bin/next build`   | succeeds            |

Do NOT run `bun run build` (postbuild regenerates tracked `public/sitemap*.xml`).

## Scope

**In scope**:
- Deleting the 15 listed `components/ui/` files
- Deleting `packages/direct-edit/` (directory)
- `package.json` (dependency removals + `name` field), `bun.lock` (via `bun install`)
- `lib/content.ts` (only the `generateSitemapUrls` function removal)

**Out of scope**:
- `components/ui/sheet.tsx`, `skeleton.tsx`, and every other `ui/` file not on the list
- `app/base/page.tsx` — the gallery route stays (maintainer decision pending)
- `made-refine`, `@radix-ui/react-slot` deps — Slot is still used by live files (`ui/button.tsx`, `ui/breadcrumb.tsx`, `ui/sidebar.tsx`); plan 007 handles it
- `next-sitemap.config.js` — the live sitemap implementation
- Any other function in `lib/content.ts` (plan 004 owns that file's behavior)

## Git workflow

- Branch: `advisor/003-dead-code-sweep`
- Commit style: `chore: remove unused ui components and orphaned dependencies`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Re-verify each file is still unimported

```bash
cd /Users/rezailmi/Developer/portfolio
for f in alert aspect-ratio badge carousel chart command drawer form input-otp pagination resizable sonner table textarea use-mobile; do
  hits=$(grep -rln "components/ui/$f'\|components/ui/$f\"" app components lib hooks --include='*.tsx' --include='*.ts' | grep -v "components/ui/$f.tsx")
  echo "$f: ${hits:-DEAD}"
done
```

**Verify**: every line prints `DEAD`. Any file with a hit: leave it in place, note it in the report, continue with the rest.

### Step 2: Delete the dead files and the empty package

`git rm` the 15 `components/ui/` files that verified DEAD, and remove `packages/direct-edit/` entirely (`git rm -r packages/direct-edit` for tracked files, then delete the remaining untracked `dist/`/`node_modules/`; if `packages/` is then empty, remove it).

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 3: Remove `generateSitemapUrls` from `lib/content.ts`

Delete lines 137–153 (the `// Sitemap generation function` comment and the `generateSitemapUrls` function). First confirm it is unimported: `grep -rn "generateSitemapUrls" app components lib hooks next-sitemap.config.js` → only the definition itself.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 4: Remove orphaned dependencies

From `package.json` dependencies remove: `react-hook-form`, `@hookform/resolvers`, `zod`, `recharts`, `embla-carousel-react`, `cmdk`, `input-otp`, `vaul`, `react-resizable-panels`, `sonner`, `prismjs`. Also change `"name": "my-v0-project"` to `"name": "portfolio"`. Run `bun install`.

For `prismjs` specifically, before removing confirm: `grep -rn "prismjs\|prism-" app components lib --include='*.css' --include='*.ts' --include='*.tsx' | grep -v rehype` → no matches (verified true at planning time).

**Verify**: `bun install` exit 0; `./node_modules/.bin/tsc --noEmit` → exit 0.

### Step 5: Full build + visual smoke

`./node_modules/.bin/next build` → succeeds. Then `bun dev` and confirm: home page renders (code blocks on a note page still syntax-highlighted — visit any `/notes/<slug>` with a code block to confirm the prismjs removal was safe), sidebar works on mobile width (the live `useIsMobile` path).

**Verify**: build exit 0; syntax highlighting visually present on a note with a code block.

## Test plan

No test framework. The typecheck + build + the step-5 syntax-highlighting check are the gates.

## Done criteria

- [ ] All 15 files deleted (or individually reported as newly-imported and skipped)
- [ ] `packages/` no longer contains `direct-edit`
- [ ] The 11 dependencies are gone from `package.json`; `bun.lock` regenerated
- [ ] `grep -rn "generateSitemapUrls" .` (excluding node_modules, .next) → no matches
- [ ] `./node_modules/.bin/tsc --noEmit`, `bun lint`, `./node_modules/.bin/next build` all exit 0
- [ ] Code blocks still highlighted on note pages
- [ ] `plans/README.md` status row updated

## STOP conditions

- Any step-1 check shows a file gained an importer since planning.
- Removing `prismjs` breaks code-block highlighting (restore that one dep, report).
- `bun install` fails after dependency removal.
- Typecheck reveals a transitive type usage of a removed package outside `components/ui/`.

## Maintenance notes

- Reviewers: this PR should be pure deletion + `package.json`/lockfile churn; any hunk that *adds* logic is out of scope.
- If shadcn components are needed later, re-add them via the shadcn CLI against a Base UI registry rather than restoring these Radix-era files.
- Plan 007 (asChild → render migration) assumes `ui/form.tsx` is gone; run this plan first.
