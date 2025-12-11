# Task 0.6.5: Init Timeout Protection

## Description
Implement timeout protection for the init() method to prevent hanging initialization. Make init() idempotent so it's safe to call multiple times.

## Objectives
- Add 10 second timeout to init()
- Make init() idempotent
- Return cached promise on subsequent calls
- Handle timeout errors gracefully
- Clear timeout on success

## Acceptance Criteria
- ✅ init() times out after 10 seconds
- ✅ Timeout emits error event
- ✅ Multiple init() calls return same promise
- ✅ Init() safe to call after timeout
- ✅ Timeout cleanup on success
- ✅ 100% test coverage

## Idempotency Pattern
```typescript
let initPromise: Promise<void> | null = null;

function init(config: SecureConfig): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = performInit(config);
  return initPromise;
}
```

## Testing Strategy
- Test init() times out after 10s
- Test multiple calls return same promise
- Test init() after timeout
- Test timeout cleanup on success
- Test timeout error event

## Dependencies
- Public API (task 0.6.2)
- Error handling (task 0.5.5)
- Constants (TIMEOUTS.INIT)

