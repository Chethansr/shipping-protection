# Task 0.5.5: Error Handling and Event Emission

## Description
Implement comprehensive error handling throughout the Coordinator. Catch errors from all subsystems, categorize them appropriately, transition to ERROR state, and emit error events for external monitoring.

## Objectives
- Wrap all async operations in error handlers
- Categorize errors using error factory
- Transition to ERROR state on failures
- Emit narvar:shipping-protection:state:error events
- Provide error recovery guidance
- Log errors appropriately

## Acceptance Criteria
- ✅ All async operations have error handling
- ✅ Errors categorized correctly (CONFIG, NETWORK, etc.)
- ✅ ERROR state transition on unrecoverable errors
- ✅ Error events emitted with full context
- ✅ Errors include recovery information
- ✅ No unhandled promise rejections
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Error Scenarios to Handle
1. Config fetch failure
2. Config validation failure
3. Cart validation failure
4. Quote calculation failure
5. Network timeouts
6. Invalid state transitions
7. Service initialization failures

## Error Event Payload
```typescript
{
  error: WidgetError,
  recoverable: boolean,
  timestamp: number
}
```

## Testing Strategy
- Test config error handling
- Test network error handling
- Test validation error handling
- Test error events emitted
- Test ERROR state is terminal
- Test error context preserved

## Dependencies
- Error types (task 0.2.1)
- Error factory (task 0.2.2)
- State management (task 0.5.2)
- Event bus (task 0.3.3)

