# Task 1.4.4: Server-Side Quote Calculation

## Description
Implement server-side quote calculation for checkout page. Server validates cart data and returns secure quote ID that prevents client-side manipulation.

## Objectives
- Create server-side quote endpoint
- Validate cart server-side
- Generate secure quote IDs
- Return signed quotes
- Validate quote IDs on purchase

## Acceptance Criteria
- ✅ Server endpoint calculates quotes
- ✅ Cart validation server-side
- ✅ Secure quote IDs generated (signed/hashed)
- ✅ Quote ID validation on purchase
- ✅ Prevents price manipulation
- ✅ 90%+ test coverage

## Server Quote Flow
1. Client sends cart data to server
2. Server validates cart
3. Server calculates protection price
4. Server generates secure quote ID
5. Server signs quote with secret key
6. Server returns quote with ID
7. Client uses quote ID at checkout
8. Server validates quote ID on purchase

## Secure Quote ID Format
```
quoteId: base64(hmac-sha256(quote_data, secret))
```

## Testing Strategy
- Test server calculation
- Test quote ID generation
- Test quote ID validation
- Test manipulation prevention

## Dependencies
- Cart validation (task 0.2.4)
- Price calculation (task 0.4.3)
- Safe fetch (task 0.1.3)

