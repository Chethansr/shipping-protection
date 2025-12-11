# Task 1.3.1: RETRY State Action

## Description
Add the RETRY state action that transitions from ERROR back to READY state, enabling retry logic. Track retry attempts in state.

## Objectives
- Define RETRY state action
- Allow ERROR → READY transition
- Track retry counter in state
- Update state machine reducer
- Validate retry conditions

## Acceptance Criteria
- ✅ RETRY action defined
- ✅ ERROR → READY transition allowed
- ✅ Retry counter incremented
- ✅ Reducer handles RETRY action
- ✅ Max retries enforced
- ✅ 100% test coverage

## State Updates
```typescript
ERROR state: {
  type: 'ERROR',
  error: WidgetError,
  retryCount: number
}

RETRY action: {
  type: 'RETRY'
}
```

## Testing Strategy
- Test RETRY action defined
- Test ERROR → READY transition
- Test retry counter increments
- Test max retries enforced

## Dependencies
- State machine (task 0.3.1)
- State actions (task 0.3.2)

