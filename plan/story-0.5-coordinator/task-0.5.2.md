# Task 0.5.2: State Management

## Description
Implement state management within the Coordinator. Provide methods to dispatch actions, subscribe to state changes, and query current state. Ensure state transitions are properly validated and events are emitted.

## Objectives
- Implement dispatch() for state actions
- Provide getState() accessor
- Subscribe to state changes internally
- Emit events on state transitions
- Validate transitions before applying

## Acceptance Criteria
- ✅ dispatch() applies state actions via reducer
- ✅ getState() returns current state
- ✅ Invalid transitions are rejected
- ✅ State changes trigger events
- ✅ State history maintained (for debugging)
- ✅ 100% test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## State Transition Events
- UNINITIALIZED → INITIALIZING: (internal, no event)
- INITIALIZING → READY: emit `narvar:shipping-protection:state:ready`
- READY → CALCULATING: (internal)
- CALCULATING → QUOTE_AVAILABLE: emit `narvar:shipping-protection:state:quote-available`
- Any → ERROR: emit `narvar:shipping-protection:state:error`

## Testing Strategy
- Test dispatch() updates state
- Test invalid transitions rejected
- Test events emitted on transitions
- Test getState() reflects current state
- Test state history tracking

## Dependencies
- State machine (task 0.3.1)
- State actions (task 0.3.2)
- Event bus (task 0.3.3)

