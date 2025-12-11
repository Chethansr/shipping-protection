# Task 0.4.3: Price Calculation Logic

## Description
Implement the core pricing logic that supports multiple calculation methods: percentage-based pricing, fixed fee pricing, and tiered pricing. The logic should be flexible and configurable based on retailer rules.

## Objectives
- Implement percentage-based calculation
- Implement fixed fee calculation
- Implement tiered pricing calculation
- Handle edge cases (min/max prices)
- Support rounding rules

## Acceptance Criteria
- ✅ Percentage calculation: price = cartValue * percentage
- ✅ Fixed fee: price = fixed amount
- ✅ Tiered: different rates for different cart value ranges
- ✅ Minimum and maximum price limits enforced
- ✅ Proper rounding (2 decimal places for currency)
- ✅ 100% test coverage for all pricing models

## Pricing Models
1. **Percentage**: 5% of cart subtotal
2. **Fixed**: $4.99 regardless of cart value
3. **Tiered**: 
   - $0-50: $2.99
   - $51-100: $4.99
   - $101+: $7.99

## Testing Strategy
- Test percentage calculation accuracy
- Test fixed fee returns constant
- Test tiered pricing boundaries
- Test min/max enforcement
- Test rounding behavior

## Dependencies
- Cart types (task 0.2.4)
- Config types (task 0.2.3)

