# Task 0.5.4: Protection Selection Handlers

## Description
Implement user action handlers for protection selection and declination. These methods handle user interactions with the widget and emit appropriate events for the retailer to act upon.

## Objectives
- Implement selectProtection(quoteId) method
- Implement declineProtection() method
- Validate quote ID exists and not expired
- Emit add-protection event
- Emit remove-protection event
- Update internal state

## Acceptance Criteria
- ✅ selectProtection() validates quote exists
- ✅ selectProtection() checks quote not expired
- ✅ Emits narvar:shipping-protection:action:add-protection event
- ✅ declineProtection() emits remove-protection event
- ✅ Events include all necessary data for retailer
- ✅ Handles invalid quote IDs gracefully
- ✅ 90%+ test coverage

## Event Payloads
**Add Protection:**
```typescript
{
  quoteId: string,
  price: number,
  currency: string,
  timestamp: number
}
```

**Remove Protection:**
```typescript
{
  quoteId: string,
  timestamp: number
}
```

## Testing Strategy
- Test selectProtection() with valid quote
- Test selectProtection() with expired quote
- Test selectProtection() with invalid quote ID
- Test declineProtection() emits event
- Test event payloads are correct

## Dependencies
- Event bus (task 0.3.3)
- Event definitions (task 0.3.4)
- State management (task 0.5.2)

