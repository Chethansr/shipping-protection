# Task 0.2.3: Zod Schemas for SecureConfig

## Description
Create Zod validation schemas for SecureConfig structure, including retailerMoniker, region, locale, and optional configuration fields. Provide validation functions that return Result<SecureConfig, WidgetError>.

## Objectives
- Define SecureConfig TypeScript type
- Create Zod schema for runtime validation
- Implement validateConfig function with Result return
- Handle validation errors with helpful messages
- Support optional configuration fields

## Acceptance Criteria
- ✅ SecureConfig type includes all required fields
- ✅ Zod schema validates retailerMoniker (non-empty string)
- ✅ Region validated against known values
- ✅ Locale validated as BCP 47 format
- ✅ validateConfig returns Result<SecureConfig, WidgetError>
- ✅ Validation errors include field names
- ✅ 100% test coverage for valid and invalid inputs

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Testing Strategy
- Test accepts valid configuration
- Test rejects empty retailerMoniker
- Test rejects invalid region
- Test rejects malformed locale
- Test applies default values

## Dependencies
- Zod library
- WidgetError types (task 0.2.1)
- Error factory (task 0.2.2)
- Result types (task 0.1.2)
