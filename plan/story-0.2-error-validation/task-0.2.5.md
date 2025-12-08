# Task 0.2.5: Safe Wrapper Integration

## Description
Update safe wrapper functions (safeFetch, safeJsonParse, safeJsonStringify) to return Result<T, WidgetError> instead of Result<T, Error>. Create error boundaries for component rendering failures.

## Objectives
- Update safeFetch to return WidgetError
- Update safeJsonParse/Stringify to return WidgetError
- Create error boundary utility for components
- Map native errors to WidgetError categories
- Integration tests for error flows

## Acceptance Criteria
- ✅ All safe wrappers return Result<T, WidgetError>
- ✅ Network errors are categorized correctly
- ✅ JSON errors include helpful context
- ✅ Error boundary catches render errors
- ✅ Original error information preserved
- ✅ Integration tests cover error propagation
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Testing Strategy
- Test safeFetch returns NetworkError on timeout
- Test safeFetch returns NetworkError on 404
- Test safeJsonParse returns WidgetError
- Test safeRender catches component errors
- Test end-to-end error flow: fetch → parse → validate

## Dependencies
- WidgetError types (task 0.2.1)
- Error factory (task 0.2.2)
- Safe wrappers (task 0.1.3)
- Result types (task 0.1.2)
