# Task 0.3.2: State Actions

## Description
Define all state action types for the finite state machine. Actions represent events that trigger state transitions. Each action should be a discriminated union member with relevant payload data.

## Objectives
- Define StateAction discriminated union
- Create action creator functions
- Type payloads for each action
- Document action purposes

## Acceptance Criteria
- ✅ StateAction covers all transitions
- ✅ Action creators are type-safe
- ✅ Payloads include necessary data
- ✅ Actions are serializable (no functions)
- ✅ 100% type coverage

## Testing Strategy
- Test initialize creates correct action
- Test calculateQuote includes cartHash
- Test quoteReady includes quote data
- Test errorOccurred includes error

## Dependencies
- WidgetError types (task 0.2.1)
