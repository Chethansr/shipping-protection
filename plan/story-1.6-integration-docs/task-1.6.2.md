# Task 1.6.2: End-to-End User Journey Tests

## Description
Create E2E tests that simulate complete user journeys from cart page through checkout page with all Phase 1 features active.

## Objectives
- Test cart page journey
- Test checkout page journey
- Test cart → checkout transition
- Test with all features enabled
- Test analytics tracking throughout
- Test multiple locales

## Acceptance Criteria
- ✅ Cart page journey complete
- ✅ Checkout page journey complete
- ✅ Cart → checkout tested
- ✅ Analytics events tracked
- ✅ Experiments assigned
- ✅ Retries work if needed
- ✅ Multiple locales tested
- ✅ Tests pass in CI

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## User Journeys
**Journey 1: Cart → Select Protection → Checkout**
1. Load cart page
2. SDK initializes
3. Quote calculated (client-side)
4. User selects protection
5. Navigate to checkout
6. Checkout buttons render
7. Server-side quote calculated
8. User clicks checkout with protection
9. Analytics tracked throughout

**Journey 2: Cart → Decline → Checkout**
1. Load cart page
2. SDK initializes
3. User declines protection
4. Navigate to checkout
5. User clicks checkout without protection
6. Analytics tracked

**Journey 3: Cart → Network Error → Retry → Success**
1. Load cart page
2. Network error on config fetch
3. Retry with backoff
4. Success on retry
5. Quote calculated
6. Analytics logged

## Testing Strategy
- Use Playwright for automation
- Test in multiple browsers
- Test with real timing
- Verify analytics events
- Test error recovery

## Dependencies
- All Phase 1 stories (1.1-1.5)
- E2E infrastructure (task 0.9.1)
- Playwright

