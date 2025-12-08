# Task 0.4.2: QuoteCalculator Factory

## Description
Create a QuoteCalculator service that performs protection quote calculations.

**Phase 0 (Current)**: Client-side calculation ONLY using retailer configuration rules (percentage, fixed fee, tiered pricing).

**Phase 1 (Future)**: Add async edge service integration for server-side signed quotes with eligibility.

## Objectives
- Implement QuoteCalculator factory function
- Calculate protection price from cart data
- Use configuration rules for pricing
- Generate quote IDs
- Set quote expiration times

## Acceptance Criteria
- ✅ Calculator uses config rules for pricing
- ✅ Generates unique quote IDs
- ✅ Includes expiration timestamp
- ✅ Handles multiple currency types
- ✅ Returns Result<Quote, WidgetError>
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Quote Structure
**Phase 0 Quote Type**:
- `amount`: number (protection price in base currency units)
- `currency`: string (ISO 4217 currency code)

**Phase 1 Extended Quote Types** (prepared but not yet used):
- `EdgeQuoteResponse`: Full edge service response with `eligible` status, `signature` (JWS), `ineligible_reason`
- `QuoteWithEligibility`: Extended quote with `eligible` boolean, optional `signature`, `source` ('client' | 'server')

## Testing Strategy
- Test basic quote calculation
- Test with different cart values
- Test currency handling
- Test quote expiration

## Dependencies
- Cart validation (task 0.2.4)
- Config service (task 0.4.1)
- Result types (task 0.1.2)

