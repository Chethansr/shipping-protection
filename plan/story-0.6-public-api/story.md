# Story 0.6: Public API & Loader Stub

## Overview
Implement the public `window.Narvar.ShippingProtection` API and create a tiny loader stub (<2KB) that handles async script loading with method queueing using Proxy pattern. Ensure zero-throw guarantee for all public methods.

## Description
This story creates the loader stub for async script loading with method queue using Proxy pattern, the public API implementation (init, render, on, off, setCustomerIdentity, getVersion, isReady, destroy), zero-throw wrappers for all public methods, bootstrap flow with feature detection and queue replay, and init timeout protection (10s timeout, idempotent promise).

**Note:** `setExperiment()` is deferred to Phase 1.

## Goals
- Tiny loader stub (<2KB)
- Queue method calls before SDK loads
- Zero-throw guarantee on all public methods
- Type-safe public API
- Idempotent initialization

## Acceptance Criteria
- ✅ Loader stub <2KB
- ✅ Method queue replays after SDK loads
- ✅ No public method throws exceptions
- ✅ init() is idempotent (safe to call multiple times)
- ✅ init() times out after 10 seconds
- ✅ render() validates cart data
- ✅ on/off methods work for event subscription
- ✅ getVersion() returns SDK version
- ✅ isReady() reflects initialization state
- ✅ destroy() cleans up all resources
- ✅ 90%+ test coverage

## Tasks
- [Task 0.6.1](./task-0.6.1.md) - Loader stub
- [Task 0.6.2](./task-0.6.2.md) - Public API implementation
- [Task 0.6.3](./task-0.6.3.md) - Zero-throw wrappers
- [Task 0.6.4](./task-0.6.4.md) - Bootstrap flow
- [Task 0.6.5](./task-0.6.5.md) - Init timeout protection

## Dependencies
- Story 0.1 (Result types, utilities)
- Story 0.2 (Error handling, validation)
- Story 0.5 (Coordinator)

## Technical Notes
- Loader uses Proxy pattern to queue calls
- `setCustomerIdentity()` included in Phase 0 for analytics prep
- `setExperiment()` deferred to Phase 1
- All methods wrapped for safety (zero-throw guarantee)
- Bootstrap happens on first init() call
- `render()` automatically debounced (100ms)

