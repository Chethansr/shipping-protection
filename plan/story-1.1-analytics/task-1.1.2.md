# Task 1.1.2: Identity Management

## Description
Implement user identity resolution using userprint for fingerprinting and uuidv7 for anonymous IDs. Track both anonymous and known users.

## Objectives
- Integrate userprint for fingerprinting
- Generate anonymous IDs with uuidv7
- Store identity in sessionStorage
- Provide getIdentity() method
- Support known user IDs

## Acceptance Criteria
- ✅ Userprint generates device fingerprint
- ✅ Anonymous ID generated with uuidv7
- ✅ Identity persisted in sessionStorage
- ✅ Identity consistent across page loads
- ✅ Known user ID takes precedence
- ✅ Privacy-compliant (no PII in fingerprint)
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Identity Structure
```typescript
{
  anonymousId: string,    // uuidv7
  fingerprint: string,    // userprint hash
  customerId?: string     // set via setCustomerIdentity()
}
```

## Testing Strategy
- Test fingerprint generation
- Test anonymous ID generation
- Test identity persistence
- Test customerId override

## Dependencies
- userprint library
- uuidv7 library
- Storage utilities (task 0.1.4)

