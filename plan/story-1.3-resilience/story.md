# Story 1.3: Resilience & Error Logging

## Overview
Implement retry logic, exponential backoff, and error logging service. Enable the SDK to recover from transient failures and report errors to the backend for monitoring.

## Description
This story creates the RETRY state action for ERROR → READY transitions, exponential backoff with 3 retries (1s/2s/4s delays with jitter), error logging service that sends errors to backend with rate limiting, coordinator retry integration for NETWORK_ERROR category, and max retry handling (terminal ERROR after 3 attempts).

## Goals
- Automatic retry for transient failures
- Exponential backoff prevents thundering herd
- Error logging for monitoring
- Rate limiting prevents log spam
- Max retries prevent infinite loops

## Acceptance Criteria
- ✅ RETRY action transitions ERROR → READY
- ✅ Exponential backoff: 1s, 2s, 4s with jitter
- ✅ Network errors trigger retries
- ✅ Max 3 retries, then terminal ERROR
- ✅ Error logging service sends to backend
- ✅ Rate limiting on error logs
- ✅ Retry counter tracked in state
- ✅ 90%+ test coverage

## Tasks
- [Task 1.3.1](./task-1.3.1.md) - RETRY state action
- [Task 1.3.2](./task-1.3.2.md) - Exponential backoff
- [Task 1.3.3](./task-1.3.3.md) - Error logging service
- [Task 1.3.4](./task-1.3.4.md) - Retry integration
- [Task 1.3.5](./task-1.3.5.md) - Max retry handling

## Dependencies
- Story 0.2 (Error types)
- Story 0.3 (State machine)
- Story 0.5 (Coordinator)

## Technical Notes
- Jitter prevents synchronized retries
- Rate limiting uses token bucket algorithm
- Only network errors retryable
- Retry counter in state context

