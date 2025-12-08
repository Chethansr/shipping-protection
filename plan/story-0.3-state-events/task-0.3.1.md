# Task 0.3.1: State Machine Types and Reducer

## Description
Define the state machine types using discriminated unions and implement the state reducer function. Create transition guards to prevent invalid state changes.

## Objectives
- Define WidgetState discriminated union
- Create state context for each state
- Implement state reducer (pure function)
- Add transition validation guards
- Type-safe state transitions

## Acceptance Criteria
- ✅ WidgetState covers all MVP states
- ✅ Each state has typed context
- ✅ Reducer enforces valid transitions
- ✅ Invalid transitions return current state
- ✅ Reducer is pure (no side effects)
- ✅ 100% test coverage for all transitions

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Testing Strategy
- Test UNINITIALIZED transitions to INITIALIZING
- Test prevents invalid transitions
- Test ERROR state is terminal
- Test DESTROYED state is terminal
- Test canTransitionTo validates transitions

## Dependencies
- WidgetError types (task 0.2.1)
