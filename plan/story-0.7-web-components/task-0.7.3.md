# Task 0.7.3: State Subscription

## Description
Connect the widget component to the Coordinator state. Subscribe to state changes and update the component's UI reactively based on state transitions.

## Objectives
- Subscribe to coordinator state on mount
- Update component properties from state
- Handle CALCULATING state (show loading)
- Handle QUOTE_AVAILABLE state (show quote)
- Handle ERROR state (show error)
- Unsubscribe on unmount

## Acceptance Criteria
- ✅ Component subscribes to state on connectedCallback
- ✅ UI updates on CALCULATING → show loading
- ✅ UI updates on QUOTE_AVAILABLE → show quote
- ✅ UI updates on ERROR → show error message
- ✅ Unsubscribes on disconnectedCallback
- ✅ No memory leaks from subscriptions
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## State Mapping
- UNINITIALIZED: Hidden
- INITIALIZING: Loading
- READY: Show placeholder
- CALCULATING: Show loading spinner
- QUOTE_AVAILABLE: Show quote with price
- ERROR: Show error message
- DESTROYED: Hidden

## Testing Strategy
- Test subscription on mount
- Test UI updates on state changes
- Test unsubscription on unmount
- Test loading state display
- Test error state display

## Dependencies
- Base component (task 0.7.1)
- Coordinator (task 0.5.2)
- State types (task 0.3.1)

