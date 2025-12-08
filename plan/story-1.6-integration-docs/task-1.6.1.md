# Task 1.6.1: Full Integration Tests

## Description
Create comprehensive integration tests that exercise all Phase 1 features together: analytics, experiments, resilience, buttons, and translations.

## Objectives
- Test analytics + experiments integration
- Test resilience + retry logic
- Test buttons + checkout flow
- Test translations + localization
- Test all features combined
- Test failure scenarios

## Acceptance Criteria
- ✅ Analytics tracks experiment assignments
- ✅ Retries work with analytics logging
- ✅ Checkout buttons emit tracked events
- ✅ Translations work in all components
- ✅ All features work together
- ✅ Cross-feature scenarios tested
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Integration Scenarios
1. **Analytics + Experiments**: User assigned to experiment, tracked
2. **Resilience + Analytics**: Network error, retry, success logged
3. **Buttons + Analytics**: Checkout click tracked
4. **Translations + Experiments**: Feature flag controls language
5. **Full flow**: Init → Feature load → Retry → Success → Analytics

## Testing Strategy
- Test feature combinations
- Test cross-feature data flow
- Test error handling across features
- Mock external services

## Dependencies
- Analytics (story 1.1)
- Growthbook (story 1.2)
- Resilience (story 1.3)
- Checkout buttons (story 1.4)
- Translations (story 1.5)

