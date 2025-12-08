# Task 0.2.1: WidgetError Types

## Description
Define a comprehensive WidgetError taxonomy using discriminated unions. Create four main error categories: CONFIG_ERROR, NETWORK_ERROR, RENDER_ERROR, and UNKNOWN_ERROR. Each category should include relevant context for debugging.

## Objectives
- Define WidgetError discriminated union
- Create error category types with context
- Preserve original error information
- Support error serialization for logging

## Acceptance Criteria
- ✅ WidgetError is a discriminated union on `category` field
- ✅ Each category has specific context properties
- ✅ Original error messages and stacks are preserved
- ✅ TypeScript narrowing works correctly
- ✅ Errors are JSON-serializable
- ✅ 100% type coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Testing Strategy
- Test ConfigError structure
- Test NetworkError preserves HTTP details
- Test serializeError produces JSON-safe output
- Test TypeScript type narrowing

## Dependencies
None (pure TypeScript types)
