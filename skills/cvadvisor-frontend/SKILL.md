---
name: cvadvisor-frontend
description: Implement, refactor, review, or debug frontend code in the CV Advisor React application. Use for work under src/, including features, shared components, routes, hooks, services, API integration, authentication UI, and frontend architecture; do not use for backend-only changes.
---

# CV Advisor Frontend

Use the repository's canonical frontend guide at [`../../src/README.md`](../../src/README.md). Read it completely before changing files under `src/`.

## Workflow

1. Inspect the requested feature, its consumers, public exports, and current working-tree changes.
2. Classify new code using the placement rules in `src/README.md`: feature, shared, service, or utility.
3. Preserve documented dependency direction and existing behavior unless the request explicitly changes behavior.
4. Keep migration scoped. Maintain a compatibility re-export when legacy consumers still exist.
5. Validate changed files, then run the repository-wide lint, production build, and diff check required by the guide.
6. Report changed behavior, principal files, verification results, remaining warnings, and any compatibility layer left in place.

## Project-specific invariants

- Use the shared Axios instance; do not create a second authenticated client without a distinct policy.
- `useToast()` returns the toast function itself, not an object.
- New business UI belongs in `src/features`; `src/pages/user/_shared` is legacy.
- Shared and service layers must not import from pages or features.
- Do not expose `.env`, tokens, CV data, or personal data in code, logs, or handoff output.
- Do not add a testing requirement until the repository has an actual test runner; use the current validation commands from `src/README.md`.
