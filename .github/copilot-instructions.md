# CV Advisor Platform - AI Coding Guidelines

You are an expert React developer assisting in building the CV Advisor Platform. Always follow these architectural rules strictly.

## 1. Project Architecture (Feature-Based + Atomic Design)
- **Feature Folders:** The `src/pages/user/` directory is divided by features (`home`, `jobs`, `cv`, `profile`). Keep page-specific components inside their respective feature folders.
- **Shared Folder (`_shared`):** Reusable resources (hooks, constants, types, components) MUST be placed in `src/pages/user/_shared/`.
- **Atomic Design:** UI components in `_shared/components/` must be categorized into `atoms` (smallest blocks), `molecules` (combined atoms), and `organisms` (complex sections).

## 2. Coding Standards & Logic Separation
- **No API Calls in Components:** NEVER use `fetch` or `axios` directly inside UI components. All API calls must go through the Service Layer (`src/services/user/`).
- **Custom Hooks:** Abstract complex business logic, state management, and API calls into Custom Hooks (e.g., `useJobs`, `useCVAnalysis`).
- **Functional Components:** Use arrow functions for components: `const ComponentName = ({ prop1 }) => { ... }`.
- **Error Handling:** Hooks should catch API errors and expose them. Components should only render the error UI.

## 3. Import & Export Rules
- **Barrel Exports:** Always use `index.js` to export modules. 
- **Clean Imports:** Import from the folder level, not the deep file level. 
  - ✅ DO: `import { JobCard } from '../_shared/components/molecules';`
  - ❌ DON'T: `import JobCard from '../_shared/components/molecules/JobCard';`

## 4. Types and Constants
- Avoid hardcoding values in UI components. 
- Put configuration objects, status colors, and API endpoints in `_shared/constants/`.
- Use JSDoc for type definitions in `_shared/types/` (e.g., `/** @typedef {Object} IJob */`).

## 5. Instructions for Generating Code
- Before writing code, analyze whether a component should be generic (put in `_shared`) or specific (put in feature folder).
- Always check if a custom hook is more appropriate before adding complex `useEffect` or `useState` chains in a component.