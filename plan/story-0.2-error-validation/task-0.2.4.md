# Task 0.2.4: Zod Schemas for CartData

## Description
Create Zod validation schemas for CartData structure, including cart items, subtotal, currency, fees, and discounts. Validate cart data before quote calculation to ensure data integrity.

## Objectives
- Define CartData and CartItem TypeScript types
- Create Zod schemas for runtime validation
- Implement validateCartData function with Result return
- Validate monetary amounts are positive
- Ensure currency codes are valid ISO 4217

## Acceptance Criteria
- ✅ CartData schema validates items array
- ✅ CartItem schema validates SKU, price, quantity
- ✅ Currency validated as 3-letter ISO code
- ✅ Monetary amounts validated as positive numbers
- ✅ validateCartData returns Result<CartData, WidgetError>
- ✅ Validation errors are descriptive
- ✅ 100% test coverage for edge cases

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Testing Strategy
- Test accepts valid cart
- Test rejects empty items array
- Test rejects negative price
- Test rejects invalid currency
- Test detects subtotal mismatch
- Test handles optional fields

## Dependencies
- Zod library
- WidgetError types (task 0.2.1)
- Error factory (task 0.2.2)
- Result types (task 0.1.2)
