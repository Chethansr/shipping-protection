# Story 0.5: Coordinator

## Overview
Implement the Coordinator, the central orchestration layer that connects the API, state machine, services, and event bus. The Coordinator manages the SDK lifecycle and coordinates all subsystem interactions.

## Description
This story creates the Coordinator factory for bootstrap initialization, state management with action dispatch and subscriptions, quote calculation flow (render → calculate → emit events), protection selection handlers (selectProtection, declineProtection), and error handling with event emission.

## Goals
- Central orchestration of all subsystems
- Clean separation of concerns
- Type-safe inter-subsystem communication
- Predictable state management
- Comprehensive error handling

## Acceptance Criteria
- ✅ Coordinator bootstraps all services
- ✅ State machine integration works
- ✅ Quote calculation flow complete
- ✅ User actions handled correctly
- ✅ Events emitted on state changes
- ✅ Error handling throughout
- ✅ 90%+ test coverage

## Tasks
- [Task 0.5.1](./task-0.5.1.md) - Coordinator factory
- [Task 0.5.2](./task-0.5.2.md) - State management
- [Task 0.5.3](./task-0.5.3.md) - Quote calculation flow
- [Task 0.5.4](./task-0.5.4.md) - Protection selection handlers
- [Task 0.5.5](./task-0.5.5.md) - Error handling and events

## Dependencies
- Story 0.1 (Result types)
- Story 0.2 (Error handling)
- Story 0.3 (State machine, events)
- Story 0.4 (Services)

## Technical Notes
- Coordinator is the single source of truth
- All subsystem access goes through coordinator
- State changes trigger events automatically
- Coordinator handles async operations

