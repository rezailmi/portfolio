# TODO: Portable Source Injection

Goal: make `data-direct-edit-source` injection work across frameworks (Next.js + Vite).

- Document how the dev-only Babel plugin is enabled in Next.js (`.babelrc`).
- Add a Vite plugin implementation that injects `data-direct-edit-source` on host JSX elements.
- Provide Vite setup examples for `@vitejs/plugin-react` using the same Babel plugin.
- Confirm dev-only gating so production builds do not include source attributes.
- Add a short troubleshooting section for missing file locations.
