# Task 0.7.5: Component Lifecycle

## Description
Implement proper component lifecycle methods to handle mounting, unmounting, and cleanup. Prevent memory leaks and ensure proper resource management.

## Objectives
- Implement connectedCallback
- Implement disconnectedCallback
- Subscribe to state on mount
- Unsubscribe on unmount
- Clean up event listeners
- Handle re-mounting

## Acceptance Criteria
- ✅ connectedCallback subscribes to state
- ✅ disconnectedCallback unsubscribes
- ✅ Event listeners cleaned up on unmount
- ✅ Component handles re-mounting
- ✅ No memory leaks
- ✅ No orphaned subscriptions
- ✅ 100% test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Lifecycle Flow
1. **connectedCallback**:
   - Subscribe to coordinator state
   - Set up event listeners
   - Initial render

2. **disconnectedCallback**:
   - Unsubscribe from state
   - Remove event listeners
   - Clear any timers

3. **Re-mounting**:
   - Handle component being removed and re-added
   - Re-subscribe on reconnection

## Testing Strategy
- Test connectedCallback called on mount
- Test disconnectedCallback called on unmount
- Test re-mounting works correctly
- Test no memory leaks
- Test subscriptions cleaned up

## Dependencies
- Base component (task 0.7.1)
- State subscription (task 0.7.3)
- Interaction handlers (task 0.7.4)

