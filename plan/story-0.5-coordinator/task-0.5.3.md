# Task 0.5.3: Quote Calculation Flow

## Description
Implement the complete quote calculation flow within the Coordinator. Handle cart data validation, quote calculation, state transitions, and event emission. Support recalculation when cart changes.

## Objectives
- Implement calculateQuote() method
- Validate cart data before calculation
- Call QuoteCalculator service
- Update state to CALCULATING → QUOTE_AVAILABLE
- Emit quote-calculated event
- Handle calculation errors

## Acceptance Criteria
- ✅ calculateQuote() validates cart data
- ✅ Transitions to CALCULATING state
- ✅ Calls QuoteCalculator service
- ✅ Transitions to QUOTE_AVAILABLE with quote
- ✅ Emits narvar:shipping-protection:state:quote-available event
- ✅ Handles validation and calculation errors
- ✅ 90%+ test coverage

## Quote Calculation Steps
1. Validate cart data (Zod schema)
2. Transition to CALCULATING state
3. Call QuoteCalculator.calculate(cart)
4. On success: dispatch QUOTE_READY action
5. Emit quote-calculated event with payload
6. On error: dispatch ERROR_OCCURRED action

## Testing Strategy
- Test successful quote calculation
- Test invalid cart data rejected
- Test event emitted with quote
- Test calculation errors handled
- Test state transitions correctly

## Dependencies
- Cart validation (task 0.2.4)
- QuoteCalculator (task 0.4.2)
- State management (task 0.5.2)
- Event definitions (task 0.3.4)

