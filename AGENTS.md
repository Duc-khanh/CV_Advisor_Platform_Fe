# CV Advisor repository instructions

For every frontend task under `src/`, use the local skill at `skills/cvadvisor-frontend/SKILL.md`, then read and follow `src/README.md` before editing. The README is the canonical architecture and delivery guide for this repository.

Key requirements:

- New business UI belongs in `src/features`; cross-feature primitives belong in `src/shared`.
- Preserve the dependency direction documented in `src/README.md`; services and shared code must not import from pages/features.
- Treat `src/pages` and `src/pages/user/_shared` as legacy migration areas, not templates for new code.
- Preserve unrelated user changes and keep refactors scoped to the requested feature.
- Validate changed frontend code with ESLint, then run `npm run lint`, `npm run build`, and `git diff --check` before handoff.
- Report remaining warnings or compatibility files explicitly.
