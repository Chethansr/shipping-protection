# Task 0.6.4: Bootstrap Flow

## Description
Implement the SDK bootstrap flow that runs on first init() call. Includes feature detection, service initialization, queue replay, and ready event emission.

## Objectives
- Detect required browser features
- Initialize all services
- Replay queued method calls
- Emit ready event
- Handle bootstrap failures

## Acceptance Criteria
- ✅ Feature detection checks required APIs
- ✅ Services initialized in correct order
- ✅ Queued calls replayed after init
- ✅ Ready event emitted on success
- ✅ Bootstrap errors handled gracefully
- ✅ Bootstrap only happens once
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Bootstrap Steps
1. Check browser feature support
2. Initialize Coordinator
3. Fetch and cache config
4. Replay queued method calls
5. Transition to READY state
6. Emit narvar:shipping-protection:state:ready event

## Required Features
- CustomEvent support
- Shadow DOM support
- localStorage support
- fetch API support

## Testing Strategy
- Test successful bootstrap
- Test missing feature detection
- Test service init failures
- Test queue replay
- Test ready event emission

## Dependencies
- Coordinator (task 0.5.1)
- Event bus (task 0.3.3)
- Loader stub (task 0.6.1)

