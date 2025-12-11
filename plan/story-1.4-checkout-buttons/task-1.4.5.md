# Task 1.4.5: QuoteCalculator Update

## Description
Update the QuoteCalculator service to support both client-side (cart page) and server-side (checkout page) quote calculation modes.

## Objectives
- Add mode parameter: 'client' | 'server'
- Keep client-side logic for cart
- Add server-side API call for checkout
- Handle both modes seamlessly
- Maintain backwards compatibility

## Acceptance Criteria
- ✅ Calculator supports client mode (existing)
- ✅ Calculator supports server mode (new)
- ✅ Mode determined by configuration
- ✅ Client mode uses local calculation
- ✅ Server mode calls backend API
- ✅ Both return Quote type
- ✅ 90%+ test coverage

## Mode Selection
- **Cart page**: client mode (fast, no backend call)
- **Checkout page**: server mode (secure, validated)

## Calculator Interface
```typescript
interface QuoteCalculator {
  calculate(cart: CartData, mode?: 'client' | 'server'): Promise<Result<Quote, WidgetError>>;
}
```

## Testing Strategy
- Test client mode (existing tests)
- Test server mode (new tests)
- Test mode switching
- Test error handling in both modes

## Dependencies
- QuoteCalculator (task 0.4.2)
- Server-side calculation (task 1.4.4)
- Safe fetch (task 0.1.3)

