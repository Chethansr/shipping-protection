# Task 0.2.2: Error Factory and Type Guards

## Description
Create factory functions for constructing WidgetError instances and type guards for identifying error categories and retry eligibility. The factory should provide a clean API for error creation throughout the SDK.

## Objectives
- Implement createError factory for each error category
- Create isRetryable type guard (NETWORK_ERROR only in MVP)
- Create categorizeError to convert unknown errors
- Implement category-specific type guards
- Extract useful information from Error objects

## Acceptance Criteria
- ✅ createConfigError, createNetworkError, createRenderError, createUnknownError work
- ✅ isRetryable returns true only for network errors
- ✅ categorizeError handles Error, string, and unknown types
- ✅ Type guards narrow WidgetError union correctly
- ✅ Factory functions add timestamps automatically
- ✅ 100% test coverage including edge cases

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Testing Strategy
- Test createConfigError includes validation errors
- Test isRetryable identifies network errors
- Test categorizeError handles Error objects
- Test type guards narrow correctly

## Dependencies
- WidgetError types (task 0.2.1)
