# Plan 007: Converge on Base UI's render prop and remove @radix-ui/react-slot

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 4b1efd5..HEAD -- components/ui/button.tsx components/ui/breadcrumb.tsx components/ui/sidebar.tsx components/app-sidebar.tsx components/breadcrumb.tsx components/nav-main.tsx components/nav-projects.tsx`
> Note: `components/app-sidebar.tsx` had an uncommitted 1-line local edit at
> planning time — do not revert the user's change; work around it. On any
> other structural mismatch with "Current state", STOP.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: MED — Slot→render changes ref/prop-merging mechanics; needs manual keyboard/visual verification
- **Depends on**: plans/003-dead-code-and-deps-sweep.md (deletes `ui/form.tsx`, a Slot importer — running 003 first shrinks this migration); plans/005-react-types-v19.md recommended first
- **Category**: tech-debt
- **Planned at**: commit `4b1efd5`, 2026-07-02

## Why this matters

This codebase's documented convention (CLAUDE.md, `.claude/docs/base-ui-patterns.md`) is Base UI composition via the `render` prop — `asChild` is explicitly called out as the wrong (Radix) pattern. Yet 25 `asChild` sites remain, powered by `@radix-ui/react-slot`, because three shadcn wrappers (`Button`, `BreadcrumbLink`, `SidebarMenuButton`) still implement `asChild` themselves. **This is not a bug** — the Slot dependency is installed and wired, everything works — but two mutually-exclusive composition idioms coexist (`components/nav-projects.tsx` uses both within 10 lines), which misleads contributors and AI agents about the canonical pattern and keeps a Radix dependency alive in a deliberately-Base-UI codebase. This plan migrates the wrappers to a `render` prop and deletes the dependency.

## Current state

- The Slot importers (after plan 003 deletes `ui/form.tsx`): 
  - `components/ui/button.tsx:2` — `import { Slot } from "@radix-ui/react-slot"`; lines 39–44: `asChild?: boolean`, `const Comp = asChild ? Slot : "button"`.
  - `components/ui/breadcrumb.tsx:2,45-48` — same pattern in `BreadcrumbLink`: `const Comp = asChild ? Slot : "a"`.
  - `components/ui/sidebar.tsx:4` — Slot import; `SidebarMenuButton` (~line 549): `const Comp = asChild ? Slot : 'button'`, result composed into a Base UI tooltip via `<TooltipTrigger render={button} />` (~line 575).
- App-level `asChild` consumers (4 sites):
  - `components/nav-main.tsx:29` — `<SidebarMenuButton asChild isActive={...} tooltip={...}><Link href={...}>...</Link></SidebarMenuButton>`
  - `components/nav-projects.tsx:41` — `<SidebarMenuButton asChild><a href={...}>...</a></SidebarMenuButton>` (note `render` used correctly 8 lines below at `:48-55` on `DropdownMenuTrigger`)
  - `components/app-sidebar.tsx:62` — `<SidebarMenuButton size="lg" asChild className="...">` (this file has an uncommitted local edit — preserve it)
  - `components/breadcrumb.tsx:49-51` — `<BreadcrumbLink asChild><Link href={href}>{displayText}</Link></BreadcrumbLink>`
- Remaining `asChild` sites live inside `components/ui/` implementations and `app/base/page.tsx` (the component gallery) — find them with `grep -rn "asChild" app components`.
- Base UI provides a `useRender` hook (`@base-ui/react/use-render`) purpose-built for giving custom components a `render` prop; consult its docs (Context7 or https://base-ui.com/react/utils/use-render) before writing the wrapper change.
- Repo exemplar of the target idiom: `app/layout.tsx:57` — `<TooltipTrigger render={<SidebarTrigger className="-ml-0.5 sm:-ml-1" />} />`.

## Commands you will need

| Purpose   | Command                            | Expected on success |
|-----------|------------------------------------|---------------------|
| Typecheck | `./node_modules/.bin/tsc --noEmit` | exit 0              |
| Lint      | `bun lint`                         | exit 0              |
| Build     | `./node_modules/.bin/next build`   | succeeds            |
| Dev       | `bun dev` (port 3020)              | manual verification |

## Suggested executor toolkit

- Read `.claude/docs/base-ui-patterns.md` in this repo before starting — it is the authoritative local convention doc.
- If a Context7/docs tool is available, fetch Base UI `useRender` documentation; the exact prop-merging semantics matter.

## Scope

**In scope**:
- `components/ui/button.tsx`, `components/ui/breadcrumb.tsx`, `components/ui/sidebar.tsx` (the three Slot-based wrappers)
- `components/nav-main.tsx`, `components/nav-projects.tsx`, `components/app-sidebar.tsx`, `components/breadcrumb.tsx` (the four consumers)
- `app/base/page.tsx` (gallery — update any `asChild` demos to `render`)
- Any other `asChild` consumer surfaced by grep inside `components/ui/`
- `package.json` (remove `@radix-ui/react-slot`), `bun.lock`

**Out of scope**:
- Base UI-backed `ui/` components that already use `render` correctly
- Behavior/visual changes of any kind — this is idiom convergence only
- The uncommitted user edit in `components/app-sidebar.tsx` — do not revert it

## Git workflow

- Branch: `advisor/007-aschild-to-render`
- Commit per wrapper (button, breadcrumb, sidebar) so regressions bisect cleanly; style: `refactor: migrate Button from asChild to Base UI render prop`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Inventory

`grep -rn "asChild" app components --include='*.tsx'` — record the full list. Expect ~25 sites at planning time (21 in `components/ui/`, 4 app-level); plan 003's deletions will have reduced this.

**Verify**: inventory recorded; every site is attributable to one of the three wrappers (or is a dead file scheduled for deletion — if plan 003 hasn't run, STOP and run it first).

### Step 2: Migrate `Button`

Replace the `asChild`/Slot mechanism in `components/ui/button.tsx` with a `render` prop using Base UI's `useRender` (preserve `buttonVariants`, `variant`/`size` props, ref forwarding, and the default `"button"` element). Migrate every `<Button asChild>` consumer found in step 1 to `<Button render={<a .../>} />` form.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0; `grep -n "asChild\|react-slot" components/ui/button.tsx` → no matches.

### Step 3: Migrate `BreadcrumbLink`, then `SidebarMenuButton`

Same treatment. For `SidebarMenuButton` keep the tooltip composition intact: the rendered element is already passed to `<TooltipTrigger render={button} />`, which must continue to receive the fully-composed element. Update the four app consumers:

```tsx
// components/nav-main.tsx — target shape
<SidebarMenuButton
  isActive={item.isActive}
  tooltip={item.title}
  render={
    <Link href={item.url}>
      <item.icon />
      <span>{item.title}</span>
    </Link>
  }
/>
```

and analogously for `nav-projects.tsx:41`, `app-sidebar.tsx:62`, `breadcrumb.tsx:49`.

**Verify**: `./node_modules/.bin/tsc --noEmit` → exit 0 after each wrapper; commit per wrapper.

### Step 4: Remove the dependency

`grep -rn "asChild\|@radix-ui/react-slot" app components` → zero matches. Remove `@radix-ui/react-slot` from `package.json`; `bun install`.

**Verify**: `bun install` exit 0; `./node_modules/.bin/next build` → exit 0.

### Step 5: Manual interaction verification (required — MED risk lives here)

With `bun dev` on localhost:3020, verify each migrated surface:
- Sidebar nav items (Home/Notes/Works/About): render as links, navigate correctly, show active state, tooltip appears when the sidebar is collapsed (collapse via Cmd/Ctrl+B), icon+label layout unchanged.
- Breadcrumb links: navigate, hover style unchanged.
- Keyboard: Tab reaches sidebar items and breadcrumb links; Enter activates them.
- `/base` gallery page renders without errors.

**Verify**: all checks pass; note any visual diff in the report.

## Test plan

No test framework. Step 5's manual checklist is the test plan; every item must be explicitly reported pass/fail.

## Done criteria

- [ ] `grep -rn "asChild" app components` → no matches
- [ ] `grep -rn "react-slot" .` (excluding node_modules, .next, bun.lock history) → no matches; dependency removed
- [ ] `./node_modules/.bin/tsc --noEmit`, `bun lint`, `./node_modules/.bin/next build` all exit 0
- [ ] Step-5 manual checklist fully reported
- [ ] `plans/README.md` status row updated

## STOP conditions

- Base UI's `useRender` version in the installed `@base-ui/react` lacks the API the docs describe (check the installed version's exports before writing code).
- Ref forwarding or prop merging (className/event handlers) behaves differently in a way you cannot make transparent — e.g. the sidebar tooltip stops positioning correctly. Revert that wrapper's commit and report.
- The migration requires touching how `TooltipTrigger`/`DropdownMenuTrigger` consume the composed element (out of the wrappers' contract).

## Maintenance notes

- After this lands, `asChild` appearing in any PR is a red flag — consider an ESLint `no-restricted-syntax` rule as a follow-up (deferred: not worth tooling until it recurs).
- The CLAUDE.md warning about asChild remains accurate and becomes fully enforced by reality.
- Memory note for future sessions: the pre-existing 25 `asChild` sites were functional (Slot was installed) — this plan removes the idiom split, it does not fix a bug.
