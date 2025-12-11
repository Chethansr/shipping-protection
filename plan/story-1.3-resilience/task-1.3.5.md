# Task 1.3.5: Max Retry Handling

## Description
Implement maximum retry limit enforcement. After 3 failed retries, transition to terminal ERROR state and log the failure.

## Objectives
- Enforce max 3 retries
- Transition to terminal ERROR after max
- Log terminal errors
- Emit error event
- Provide recovery guidance

## Acceptance Criteria
- ✅ Max 3 retries enforced
- ✅ Terminal ERROR after max retries
- ✅ Terminal error logged to backend
- ✅ Error event emitted
- ✅ No further retries attempted
- ✅ 100% test coverage

## Terminal Error Handling
1. Retry count reaches 3
2. Check isRetryable(error) returns false
3. Dispatch ERROR_OCCURRED (no more retries)
4. Log terminal error
5. Emit narvar:shipping-protection:state:error event
6. State becomes terminal

## Testing Strategy
- Test max retries enforced
- Test terminal ERROR state
- Test error logging
- Test error event
- Test no further retries

## Dependencies
- RETRY action (task 1.3.1)
- Retry integration (task 1.3.4)
- Error logging (task 1.3.3)
- Coordinator (story 0.5)

