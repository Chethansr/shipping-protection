# Task 1.1.1: Analytics Service Factory

## Description
Create the analytics service factory that initializes the noflake SDK integration and provides methods for tracking events.

## Objectives
- Create analytics service factory function
- Integrate noflake SDK
- Initialize tracking on SDK bootstrap
- Provide track() method
- Handle analytics errors gracefully

## Acceptance Criteria
- ✅ Service factory creates analytics instance
- ✅ Noflake SDK initialized correctly
- ✅ track() method available
- ✅ Errors don't crash SDK
- ✅ Service can be disabled via config
- ✅ 90%+ test coverage

## Testing Strategy
- Test service initialization
- Test track() method
- Test error handling
- Test disabled state

## Dependencies
- noflake SDK
- Config service (task 0.4.1)

