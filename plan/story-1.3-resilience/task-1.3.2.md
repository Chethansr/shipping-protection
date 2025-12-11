# Task 1.3.2: Exponential Backoff

## Description
Implement exponential backoff algorithm for retries. Use delays of 1s, 2s, 4s with jitter to prevent thundering herd.

## Objectives
- Implement exponential backoff function
- Add jitter to delays
- Use TIMEOUTS.RETRY_DELAYS from constants
- Calculate delay based on retry count
- Prevent synchronized retries

## Acceptance Criteria
- ✅ Backoff function returns delays: 1s, 2s, 4s
- ✅ Jitter added (±20% random)
- ✅ Delay calculation based on retry count
- ✅ Prevents thundering herd
- ✅ 100% test coverage

## Backoff Algorithm
```typescript
function calculateBackoff(retryCount: number): number {
  const baseDelay = TIMEOUTS.RETRY_DELAYS[retryCount] || 4000;
  const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1);
  return baseDelay + jitter;
}
```

## Retry Delays
- Retry 1: 1000ms ± 200ms
- Retry 2: 2000ms ± 400ms
- Retry 3: 4000ms ± 800ms

## Testing Strategy
- Test delay calculation
- Test jitter range
- Test each retry count
- Test delay bounds

## Dependencies
- Constants TIMEOUTS.RETRY_DELAYS (task 0.1.4)

