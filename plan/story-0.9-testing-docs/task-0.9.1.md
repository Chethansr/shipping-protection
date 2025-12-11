# Task 0.9.1: E2E Test Suite

## Description
Create comprehensive end-to-end tests using Playwright. Test all user flows from initialization through quote calculation and protection selection.

## Objectives
- Set up Playwright test infrastructure
- Test initialization flow
- Test render flow with cart data
- Test widget variants (toggle, checkbox)
- Test user interactions
- Test error scenarios
- Test event emission

## Acceptance Criteria
- ✅ Playwright configured and working
- ✅ Initialization test passes
- ✅ Render with cart data test passes
- ✅ Toggle variant interaction test passes
- ✅ Checkbox variant interaction test passes
- ✅ Quote calculation test passes
- ✅ Error handling test passes
- ✅ Event emission test passes
- ✅ Tests run in CI

## Test Scenarios
1. **Happy path**: Init → Render → Calculate → Select → Add event
2. **Declination**: Init → Render → Calculate → Decline → Remove event
3. **Recalculation**: Init → Render → Cart change → Recalculate
4. **Error path**: Init with invalid config → Error event
5. **Variants**: Test both toggle and checkbox
6. **Loading states**: Verify loading indicators

## Testing Strategy
- Use Playwright for browser automation
- Test in Chrome, Firefox, Safari
- Test real DOM interactions
- Test event listeners
- Verify Shadow DOM rendering

## Dependencies
- Playwright library
- All Phase 0 functionality (stories 0.1-0.8)

