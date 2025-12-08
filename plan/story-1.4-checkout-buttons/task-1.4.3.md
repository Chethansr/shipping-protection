# Task 1.4.3: Button Event Handlers

## Description
Implement event handlers for button clicks. Emit checkout events that include quote ID and protection selection for the retailer to process.

## Objectives
- Handle with-protection button click
- Handle without-protection button click
- Emit narvar:shipping-protection:action:checkout event with protection flag
- Include quote ID and pricing in events
- Call coordinator.selectProtection() or coordinator.declineProtection()

## Acceptance Criteria
- ✅ With-protection click emits event
- ✅ Without-protection click emits event
- ✅ Events include quote ID
- ✅ Events include pricing details
- ✅ Disabled state prevents clicks
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Event Payloads
**narvar:shipping-protection:action:checkout:**
```typescript
{
  withProtection: boolean,
  quoteId?: string,         // Present when withProtection is true
  protectionPrice?: number, // Present when withProtection is true
  cartTotal: number,
  totalWithProtection?: number, // Present when withProtection is true
  currency: string,
  timestamp: number
}
```

## Testing Strategy
- Test event emission
- Test event payloads
- Test disabled state
- Test coordinator methods called

## Dependencies
- Button variants (task 1.4.2)
- Event definitions (story 0.3)
- Coordinator (story 0.5)

