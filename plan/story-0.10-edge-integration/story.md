# Story 0.10: Edge Integration

## Overview
Integrate server-side quote calculation via Narvar edge compute service. Extends QuoteCalculator to support both client-side (cart page) and server-side (checkout page) quote calculation with cryptographic signatures.

## Objectives
- Add edge API endpoint constants
- Extend QuoteCalculator with async `calculateWithEdge()` method
- Transform CartData to edge API request format
- Handle EdgeQuoteResponse with JWS signature
- Update Coordinator to choose client vs server based on page context
- Emit extended quote-available event with eligibility and signature

## Acceptance Criteria
- ✅ QuoteCalculator has async `calculateWithEdge(cart, config)` method
- ✅ Edge endpoint configurable via environment or constant
- ✅ Request format matches OpenAPI spec (POST /v1/quote)
- ✅ Response includes signature, eligibility, premium_value
- ✅ Coordinator calls edge service when page='checkout'
- ✅ Coordinator calls client calculation when page='cart'
- ✅ Extended quote event includes source field ('client' | 'server')
- ✅ Error handling for edge API failures
- ✅ Demo supports testing both modes

## Implementation Details

### Edge API Endpoint
**Production**: `https://edge-compute-f.dp.domain-ship.qa20.narvar.qa`

**POST /v1/quote Request Format:**
```typescript
{
  currency: string;           // "USD"
  locale: string;             // "en-US"
  order_items: Array<{
    line_price: number;       // cents
    quantity: number;
    sku: string;
    total_tax: number;        // cents
  }>;
  ship_to: string;            // "US"
  shipping_fee: number;       // cents
  shipping_fee_tax: number;   // cents
  store_id: string;           // retailer moniker
}
```

**POST /v1/quote Response Format:**
```typescript
{
  eligible: 'eligible' | 'not_eligible';
  quote: {
    premium_value: number;    // cents
  };
  signature: {
    jws: string;              // JWS compact serialization
    created_at: number;       // Unix timestamp
    expires_at: number;       // Unix timestamp
  };
  ineligible_reason: string | null;
}
```

### Quote Type Extensions
```typescript
// Phase 0 client-side quote
type Quote = {
  amount: number;
  currency: string;
};

// Extended quote with edge data
type QuoteWithEligibility = Quote & {
  eligible: boolean;
  signature?: EdgeQuoteSignature;
  ineligible_reason?: string | null;
  source: 'client' | 'server';
};
```

### Coordinator Logic
```typescript
async calculateQuote(cart: CartData, config: ShippingProtectionConfig) {
  if (config.page === 'checkout') {
    // Call edge service
    const edgeQuote = await this.quoteCalc.calculateWithEdge(cart, config);
    // Emit extended quote-available event
  } else {
    // Call client-side calculation
    const clientQuote = this.quoteCalc.calculate(cart);
    // Emit basic quote-available event
  }
}
```

## Testing Strategy
- Unit tests for CartData → edge request transformation
- Unit tests for edge response → QuoteWithEligibility transformation
- Mock edge API responses (eligible, not_eligible, error)
- Integration test with demo store (cart vs checkout modes)
- Error handling tests (network failure, invalid response)

## Dependencies
- Story 0.4: Services (QuoteCalculator exists)
- Story 0.5: Coordinator (orchestration layer)
- Story 0.6: Public API (config passed through)
- OpenAPI spec: https://edge-compute-f.dp.domain-ship.qa20.narvar.qa/api-docs/openapi.json

## Notes
- Edge service returns quotes in cents (premium_value)
- Client calculation also uses cents internally
- Signature (JWS) is opaque to client, passed through to backend
- Eligibility check happens server-side only
- Network errors should fall back gracefully (Phase 1 will add retry)
