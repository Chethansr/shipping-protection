# Task 1.2.4: setExperiment() API

## Description
Implement the setExperiment() public API method that allows forced variant assignment for testing and QA purposes.

## Objectives
- Implement setExperiment(experimentId, variant) method
- Override Growthbook variant assignment
- Track forced variants
- Support QA testing workflows
- Handle invalid inputs

## Acceptance Criteria
- ✅ setExperiment() accepts experiment ID and variant
- ✅ Variant assignment overridden
- ✅ Forced variants tracked in analytics
- ✅ Invalid inputs handled gracefully
- ✅ Multiple experiments supported
- ✅ Zero-throw guarantee
- ✅ 90%+ test coverage

## API Signature
```typescript
setExperiment(experimentId: string, variant: string): void
```

## Usage Example
```javascript
// Force specific variant for testing
Narvar.Secure.setExperiment('widget-redesign', 'variant-b');
```

## Testing Strategy
- Test with valid experiment/variant
- Test with invalid inputs
- Test multiple experiments
- Test analytics tracking
- Test variant override works

## Dependencies
- Public API (story 0.6)
- Growthbook service (task 1.2.1)
- Analytics (story 1.1)

