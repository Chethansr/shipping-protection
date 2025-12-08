# Story 0.2: Error System & Validation

## Overview
Establish a comprehensive error taxonomy and validation system for shipping-protection.js. This story implements WidgetError types, error factories, Zod schemas for configuration and cart validation, and integrates the error system with the Result type foundation.

## Description
This story creates a robust error handling and validation framework including WidgetError taxonomy with specific error categories, error factory functions for creating categorized errors, type guards for error identification and retry logic, Zod schemas for ShippingProtectionConfig validation, Zod schemas for CartData validation, and integration with Result<T, WidgetError> types.

## Goals
- Explicit error categorization for better debugging
- Type-safe configuration and cart data validation
- Clear separation between retryable and terminal errors
- Early validation to prevent runtime failures
- Detailed error messages for troubleshooting

## Acceptance Criteria
- ✅ All errors are categorized (CONFIG_ERROR, NETWORK_ERROR, RENDER_ERROR, UNKNOWN_ERROR)
- ✅ Error factory creates properly typed WidgetError instances
- ✅ Type guards identify retryable vs terminal errors
- ✅ SecureConfig schema validates retailerMoniker, region, locale
- ✅ CartData schema validates items, subtotal, currency, fees, discounts
- ✅ Invalid configuration rejected at init time
- ✅ Invalid cart data rejected before calculation
- ✅ Result<T, WidgetError> integration complete
- ✅ 90%+ test coverage with validation edge cases

## Tasks
- [Task 0.2.1](./task-0.2.1.md) - WidgetError types
- [Task 0.2.2](./task-0.2.2.md) - Error factory and type guards
- [Task 0.2.3](./task-0.2.3.md) - Zod schemas for SecureConfig
- [Task 0.2.4](./task-0.2.4.md) - Zod schemas for CartData
- [Task 0.2.5](./task-0.2.5.md) - Safe wrapper integration

## Dependencies
- Story 0.1 (Result types, safe wrappers)

## Technical Notes
- Use discriminated unions for WidgetError categories
- Zod provides runtime type checking beyond TypeScript
- Error categories determine retry behavior (Phase 1)
- Preserve stack traces for debugging
