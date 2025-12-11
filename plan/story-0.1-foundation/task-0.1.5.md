# Task 0.1.5: Hello World Component

## Description
Create a simple "Hello World" web component using Lit to verify the entire build pipeline, Lit integration, and browser rendering. This component serves as a sanity check for the foundation before building complex components.

## Objectives
- Build a basic Lit web component
- Register as custom element
- Verify Shadow DOM works
- Test browser rendering in demo page
- Confirm build pipeline produces working output

## Acceptance Criteria
- ✅ Component renders "Hello from Narvar Secure!" in browser
- ✅ Custom element registered as `<narvar-hello>`
- ✅ Shadow DOM isolation works
- ✅ Component updates reactively to property changes
- ✅ Build output is CSP-compliant
- ✅ Component has basic test coverage
- ✅ Demo HTML page loads component successfully

## Validation Steps
1. Build the project: `npm run build`
2. Open demo page in browser
3. Verify "Hello from Narvar Secure!" appears
4. Inspect element to confirm Shadow DOM
5. Check browser console for CSP violations (should be none)
6. Run tests: `npm test`

## Dependencies
- Lit library
- Project scaffolding (task 0.1.1)
