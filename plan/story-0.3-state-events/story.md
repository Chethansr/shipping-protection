# Story 0.3: State Machine & Event Bus

## Overview
Implement a finite state machine for SDK lifecycle management and an event bus for pub/sub communication. This story creates the core orchestration patterns that coordinate SDK behavior and enable loose coupling between subsystems.

## Description
This story implements a finite state machine with simplified MVP states (no RETRY), state transition guards and validation, state action types for all transitions, event bus using CustomEvents, event payload typing and validation, and public event definitions for external consumers.

## State Diagram (MVP)
```
UNINITIALIZED → INITIALIZING → READY → CALCULATING → QUOTE_AVAILABLE
                    ↓              ↓          ↓               ↓
                  ERROR (terminal) ←―――――――――――――――――――――――――

DESTROYED (from any state)
```

**Note:** `READY` state replaces any previous `IDLE` state naming. Guards enforce preconditions (cart not empty, total > 0).

## Acceptance Criteria
- ✅ State machine prevents invalid transitions
- ✅ Transition guards enforce preconditions
- ✅ State actions are type-safe
- ✅ Event bus supports on/off subscriptions
- ✅ Events fire with correct payloads
- ✅ CustomEvents enable DOM-level listening
- ✅ ERROR state is terminal (no RETRY in MVP)
- ✅ 90%+ test coverage

## Tasks
- [Task 0.3.1](./task-0.3.1.md) - State machine types and reducer
- [Task 0.3.2](./task-0.3.2.md) - State actions
- [Task 0.3.3](./task-0.3.3.md) - Event bus factory
- [Task 0.3.4](./task-0.3.4.md) - Event definitions

## Dependencies
- Story 0.1 (Result types)
- Story 0.2 (WidgetError types)

## Technical Notes
- Use discriminated unions for state and actions
- State reducer is a pure function
- Event bus uses CustomEvents for DOM compatibility
- ERROR state is terminal in MVP (Phase 1 adds RETRY)
- No race condition handling in MVP
