# Plan 005: Align @types/react and @types/react-dom with the React 19 runtime

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4b1efd5..HEAD -- package.json`
> If the @types versions already changed, STOP — this plan may be done.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED (the bump may surface previously-masked type errors that must be fixed)
- **Depends on**: none (run BEFORE plans 006/007 so their refactors typecheck against honest types; running after plan 003 shrinks the fallout surface)
- **Category**: bug
- **Planned at**: commit `4b1efd5`, 2026-07-02

## Why this matters

The runtime is React 19.2 but the type packages are v18 (`package.json`: `"react": "^19.2.3"` vs `"@types/react": "^18.3.27"`, `"@types/react-dom": "^18.3.7"`). Typechecking therefore validates app code against the wrong React API surface: React-19 features (ref-as-prop, `use()`, updated hook signatures) are mistyped or missing, and `skipLibCheck: true` in `tsconfig.json` hides the resulting conflicts inside node_modules (Base UI, next-mdx-remote and other deps ship React-19 types). `tsc --noEmit` passing today is partially fictional. This is a correctness-of-tooling fix: after it, the compiler actually checks what runs.

## Current state

- `package.json` devDependencies: `"@types/react": "^18.3.27"`, `"@types/react-dom": "^18.3.7"`; dependencies: `"react": "^19.2.3"`, `"react-dom": "^19.2.3"`.
- `tsconfig.json` has `"skipLibCheck": true` (keep it — standard for Next projects).
- Baseline: `./node_modules/.bin/tsc --noEmit` exits 0 at commit `4b1efd5`.
- Known cast sites that may interact with the bump: `components/lettermark.tsx:66,70` (`as unknown as EventListener`), benign DOM casts in `components/scary-numbers.tsx:200`.
- `components/ui/*` uses `React.forwardRef` heavily (~36 sites) — still valid in React 19 types, just no longer required. Do NOT refactor them in this plan.

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Install   | `bun install`                      | exit 0              |
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0              |
| Lint      | `bun lint`                         | exit 0              |
| Build     | `./node_modules/.bin/next build`   | succeeds            |

Do NOT run `bun run build` (postbuild regenerates tracked `public/sitemap*.xml`).

## Scope

**In scope**:
- `package.json` (the two @types lines), `bun.lock`
- Minimal type-error fixes surfaced by the bump, in any `app/`, `components/`, `hooks/`, `lib/` file — smallest change that restores type-correctness, e.g. adjusting a `ReactNode` annotation or a ref type

**Out of scope**:
- Refactoring `forwardRef` usage to React-19 style (works fine, separate concern)
- Upgrading React itself, Next, or any other dependency
- Loosening `tsconfig.json` (do not add `skipLibCheck` exceptions, `any`, or `@ts-expect-error` to make errors go away — see STOP conditions)

## Git workflow

- Branch: `advisor/005-react-types-v19`
- Commit style: `chore: align @types/react with React 19 runtime`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Bump the type packages

In `package.json`, set `"@types/react": "^19"` and `"@types/react-dom": "^19"`, then `bun install`.

**Verify**: `bun install` exit 0; `bun pm ls | grep @types/react` shows 19.x resolutions (or inspect `bun.lock`).

### Step 2: Typecheck and fix fallout

Run `./node_modules/.bin/tsc --noEmit`. For each error: fix it with the smallest honest change (correct the annotation, adjust the ref type, use `React.JSX.Element` where `JSX.Element` broke, etc.). Common React-19 type-bump fallout: implicit-children assumptions, `useRef()` now requiring an initial argument in some overloads, event-handler type narrowing.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0 with no new suppression comments: `git diff | grep -c "@ts-ignore\|@ts-expect-error\| as any"` → 0.

### Step 3: Build and lint

**Verify**: `./node_modules/.bin/next build` → exit 0; `bun lint` → exit 0.

## Test plan

No test framework. Typecheck + build are the gates. List every file you had to touch in step 2 in the final report — that list is the measure of how much type fiction existed.

## Done criteria

- [ ] `@types/react` and `@types/react-dom` resolve to 19.x
- [ ] `./node_modules/.bin/tsc --noEmit` exits 0
- [ ] No new `@ts-ignore` / `@ts-expect-error` / `as any` introduced (`git diff` check above)
- [ ] `./node_modules/.bin/next build` and `bun lint` exit 0
- [ ] `plans/README.md` status row updated

## STOP conditions

- More than ~15 files error after the bump (the fallout is larger than estimated — report the error list instead of fixing en masse).
- An error can only be silenced with `any`/`@ts-expect-error` — report it; that error is telling us something about a real API misuse.
- Errors originate inside `components/ui/` files scheduled for deletion by plan 003 — if plan 003 hasn't run, note them and fix minimally; don't refactor doomed files.

## Maintenance notes

- Keep the @types major in lockstep with the React major from now on; add it to the checklist for any future React upgrade.
- The memory that motivated this ("React 19 with React 18 types creates silent type errors") is resolved by this plan — plans 006/007 rely on honest types.
