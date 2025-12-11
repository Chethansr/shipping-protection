# Task 1.1.5: setCustomerIdentity() API

## Description
Implement the setCustomerIdentity() public API method that allows retailers to provide known customer IDs for more accurate tracking and personalization.

## Objectives
- Implement setCustomerIdentity(customerId) method
- Validate customer ID input
- Update identity with customer ID
- Re-identify analytics events
- Handle multiple calls (ID updates)

## Acceptance Criteria
- ✅ setCustomerIdentity() accepts string customer ID
- ✅ Customer ID validated (non-empty string)
- ✅ Identity updated with customer ID
- ✅ Future events include customer ID
- ✅ Multiple calls update ID
- ✅ Zero-throw guarantee
- ✅ 90%+ test coverage

## API Signature
```typescript
setCustomerIdentity(customerId: string): void
```

## Usage Example
```javascript
// After user logs in
Narvar.Secure.setCustomerIdentity('customer_12345');
```

## Testing Strategy
- Test with valid customer ID
- Test with empty string (rejected)
- Test multiple calls
- Test events include customer ID
- Test error handling

## Dependencies
- Public API (story 0.6)
- Identity management (task 1.1.2)
- Analytics service (task 1.1.1)

