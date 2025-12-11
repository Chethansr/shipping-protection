# Task 0.1.1: Project Scaffolding

## Description
Set up the project structure with Vite build system, TypeScript configuration, Vitest testing framework, bundle size monitoring, and a CSP compliance test page. Configure modern browser targets and establish the development workflow.

## Objectives
- Initialize Vite-based TypeScript project
- Configure Vitest for unit testing
- Set up size-limit for bundle monitoring
- Create .browserslistrc for target browser support
- Build CSP test page to validate compliance

## Acceptance Criteria
- ✅ `npm run dev` starts development server
- ✅ `npm run build` produces IIFE bundle in dist/
- ✅ `npm test` runs Vitest test suite
- ✅ `npm run size` checks bundle size limits
- ✅ CSP test page loads without console errors
- ✅ TypeScript strict mode enabled
- ✅ No source maps in production build
- ✅ Build output is CSP-compliant (no eval, no inline scripts)

## Testing Strategy
- Verify dev server starts and hot-reload works
- Build production bundle and inspect output
- Load CSP test page in browser (no console errors)
- Run size-limit to establish baseline

## Dependencies
- vite
- typescript
- vitest
- size-limit
- @size-limit/preset-small-lib
