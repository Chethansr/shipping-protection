# Task 1.2.1: Growthbook Service Factory

## Description
Create the Growthbook service factory that initializes the Growthbook SDK and provides feature evaluation methods.

## Objectives
- Create Growthbook service factory function
- Initialize Growthbook SDK
- Configure SDK with API key and attributes
- Provide feature evaluation methods
- Handle initialization errors

## Acceptance Criteria
- ✅ Service factory creates Growthbook instance
- ✅ SDK initialized with correct config
- ✅ Attributes set (user, retailer, etc.)
- ✅ Feature evaluation works
- ✅ Errors don't crash SDK
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## SDK Attributes
- `userId`: Customer ID or anonymous ID
- `retailer`: Retailer moniker
- `region`: Region code
- `environment`: production/staging/dev

## Testing Strategy
- Test service initialization
- Test feature evaluation
- Test attribute setting
- Test error handling

## Dependencies
- Growthbook SDK
- Config service (task 0.4.1)
- Identity management (task 1.1.2)

