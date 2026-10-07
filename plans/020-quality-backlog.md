# Plan 020: Post-audit quality backlog

> Status after the 2026-10-06 maintainability pass on `cursor/portfolio-quality-pass-d0ee`.
> Earlier plans 001–019 in `plans/README.md` are DONE. This file is the remaining backlog.

## Already landed in this pass

- Bun-only lockfile (`package-lock.json` removed, ignored; `packageManager` set)
- Canonical `SITE_ORIGIN` in `lib/site.ts` (metadata + content + sitemap env parity)
- Agent docs brought in line with StyleX / Base UI `render` / Bun
- Unused v0 `public/placeholder*` assets removed
- StyleX lint warnings cleared on MDX prose + gallery card/tabs
- `_content/notes/.gitkeep` so the notes content root exists
- `/edit` wrapped with `DirectEditProvider` via `components/edit-demo.tsx`
- `/base` excluded from sitemap; `made-refine` dynamic import compile-time gated for production
- Dead code removed: unused `FeatureFlagsProvider`, `NavProjects` (always hidden), `empty-state`, `lib/utils` `cn()`

## Recommended next (operator picks)

| Priority | Item | Why | Risk |
|----------|------|-----|------|
| P1 | Decide fate of `/base` + 31 gallery-only `components/ui/*` files | Largest maintenance surface; nothing in the product shell imports them | MEDIUM (deletes playground used for StyleX visual checks) |
| P1 | Revisit ScrollArea-as-main-scroller in `app/layout.tsx` | Breaks native scroll restoration / hash scrolling | HIGH (layout redesign) |
| P2 | Split or tame `components/scary-numbers.tsx` (~865 lines) | Hard to change safely; zero tests | HIGH (drag math) |
| P2 | Upstream: `DirectEditDemo` in made-refine 0.3.0 still needs `DirectEditProvider` (wrap stays in `components/edit-demo.tsx`) | Package bug; remove local wrap when fixed | LOW |
| P3 | Align deploy env to one name (`NEXT_PUBLIC_SITE_URL` preferred) | Both names still accepted | LOW |
| P3 | Delete or refresh stale `plan/code-quality-review.md` | Wrong Next 16 `params` guidance (Promise is correct) | LOW |
| P3 | Optional Vitest smoke for content validation | `assertFrontmatter` is load-bearing | LOW |

## Explicitly not recommended now

- Bundle-shaving the sidebar/tooltip shell for a few KB
- Mass `forwardRef` cleanup in generated `components/ui/`
- Adding forms stack (RHF/Zod) back without a product form
