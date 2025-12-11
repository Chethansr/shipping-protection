# Task 1.3.4: Retry Integration

## Description
Integrate retry logic into the Coordinator. Automatically retry network errors with exponential backoff.

## Objectives
- Detect retryable errors (NETWORK_ERROR)
- Schedule retry with backoff delay
- Dispatch RETRY action
- Re-attempt failed operation
- Track retry attempts

## Acceptance Criteria
- ✅ Network errors trigger retries
- ✅ Backoff delay used
- ✅ RETRY action dispatched
- ✅ Operation re-attempted
- ✅ Config fetch retried
- ✅ Quote calculation not retried (new cart may differ)
- ✅ 90%+ test coverage

## Retry Flow
1. Operation fails with NetworkError
2. Check if retryable
3. Check retry count < 3
4. Calculate backoff delay
5. Wait for delay
6. Dispatch RETRY action
7. Re-attempt operation
8. If success: continue
9. If failure: increment retry, repeat or terminal ERROR

## Retryable Operations
- Config fetch
- Analytics tracking (best effort)

## Non-Retryable Operations
- Quote calculation (cart may have changed)
- User actions

## Testing Strategy
- Test retry on network error
- Test backoff delays
- Test max retries
- Test successful retry
- Test terminal ERROR

## Dependencies
- RETRY action (task 1.3.1)
- Exponential backoff (task 1.3.2)
- Coordinator (story 0.5)

