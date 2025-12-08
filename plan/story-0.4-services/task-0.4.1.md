# Task 0.4.1: Config Service Factory

## Description
Create a Config service that fetches retailer configuration from the API, caches it in memory, and provides a synchronous getConfiguration() accessor. The service handles initialization and configuration refresh.

## Objectives
- Implement config service factory function
- Fetch configuration from API
- Cache configuration in memory
- Provide getConfiguration() accessor
- Handle initialization errors

## Acceptance Criteria
- ✅ Service fetches config on init()
- ✅ Configuration cached in memory after first fetch
- ✅ getConfiguration() returns cached config synchronously
- ✅ Handles API failures gracefully
- ✅ Configuration includes retailer rules and settings
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Configuration Structure
- Retailer moniker
- Region settings
- Pricing rules
- Widget display options
- Feature flags

## Testing Strategy
- Test fetches and caches config
- Test getConfiguration() returns cached data
- Test handles network errors
- Test validates config structure

## Dependencies
- Safe fetch wrapper (task 0.1.3)
- Config validation (task 0.2.3)
- Result types (task 0.1.2)

