# Task 0.3.4: Event Definitions

## Description
Define all public events that external consumers can listen to. Document event payloads, timing, and usage patterns. Create constants for event names to prevent typos.

## Objectives
- Define all public event names as constants
- Document event payloads and timing
- Create event type definitions
- Provide usage examples

## Acceptance Criteria
- ✅ All event names defined as constants
- ✅ Event payloads fully typed
- ✅ Events documented with timing and context
- ✅ Usage examples provided
- ✅ Type safety enforced

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Public Events
**State Events:**
- `narvar:shipping-protection:state:ready` - After successful bootstrap + init (payload: `version`)
- `narvar:shipping-protection:state:quote-available` - Quote calculated and available
  - **Phase 0 payload**: `{ quote: { amount: number, currency: string } }`
  - **Phase 1 payload**: `{ quote: { amount, currency, eligible, signature, source: 'client' | 'server' } }`
  - Phase 0 emits from client-side calculation only (no edge service, no eligibility, no signature)
  - Phase 1 includes edge service response with eligibility and JWS signature
- `narvar:shipping-protection:state:error` - Any handled error in SDK (payload: `error.code`, `error.message`, `error.category`, `error.retryable`)

**Action Events (Commands to Retailer):**
- `narvar:shipping-protection:action:add-protection` - Widget wants retailer to add protection (payload: `sku`, `name`, `price`, `quantity`)
- `narvar:shipping-protection:action:remove-protection` - Widget wants retailer to remove protection (payload: `sku`)
- `narvar:shipping-protection:action:checkout` - Checkout button pressed (Phase 1 only) (payload: `sku`, `name`, `price`, `quantity`, `withProtection`)

## Testing Strategy
- Test event names are unique
- Test event names follow convention
- Test payload types are JSON-serializable

## Dependencies
- WidgetError types (task 0.2.1)
- Quote types (task 0.3.2)
