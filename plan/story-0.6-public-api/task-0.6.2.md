# Task 0.6.2: Public API Implementation

## Description
Implement all public API methods that developers will use to interact with the SDK. Provide a clean, intuitive interface that abstracts away internal complexity.

## Objectives
- Implement init(config) method (idempotent, 10s timeout)
- Implement render(cartData) method (debounced 100ms)
- Implement on(eventName, callback) method
- Implement off(eventName, callback) method
- Implement setCustomerIdentity(identity) method (Phase 0)
- Implement getVersion() method
- Implement isReady() method
- Implement destroy() method
- Note: setExperiment() deferred to Phase 1

## Acceptance Criteria
- ✅ init() initializes SDK with config, idempotent, 10s timeout protection
- ✅ render() validates cart and updates widget (debounced 100ms)
- ✅ on() subscribes to events, returns unsubscribe function
- ✅ off() unsubscribes from events
- ✅ setCustomerIdentity() updates customer identity for analytics
- ✅ getVersion() returns semver string
- ✅ isReady() returns boolean (checks READY state with valid config)
- ✅ destroy() cleans up all resources (cancels in-flight requests, removes listeners, clears DOM, resets state)
- ✅ All methods have zero-throw guarantee
- ✅ 90%+ test coverage

## API Signatures
```typescript
interface NarvarShippingProtectionAPI {
  init(config: ShippingProtectionConfig): Promise<void>;
  render(data: CartData): void;
  on<T extends ShippingProtectionEventName>(eventName: T, handler: EventHandler<T>): UnsubscribeFn;
  off<T extends ShippingProtectionEventName>(eventName: T, handler: EventHandler<T>): void;
  setCustomerIdentity(identity: CustomerIdentity): void;
  getVersion(): string;
  isReady(): boolean;
  destroy(): void;
}

interface ShippingProtectionConfig {
  variant: 'toggle' | 'checkbox';
  page: 'cart' | 'checkout';  // Renamed from 'source' to avoid confusion with event payload's source ('client' | 'server')
  retailerMoniker: string;
  region: string;
  locale: string; // e.g., "en_US" or "en-US"
  experiment?: ExperimentData;
  debug?: boolean;
  mockMode?: MockConfig;
}

interface CartData {
  subtotal: number; // Integer, cents
  fees: CartFee[];
  items: CartItem[];
  discounts: CartDiscount[];
  currency: string; // ISO 4217
}

interface CustomerIdentity {
  customerId: string;
}
```

**Note:** API exposed at `window.Narvar.ShippingProtection` (not `NarvarSecure`)

## Testing Strategy
- Test init() with valid config
- Test render() creates widget
- Test on/off event subscriptions
- Test getVersion() returns version
- Test isReady() reflects state
- Test destroy() cleanup

## Dependencies
- Coordinator (task 0.5.1)
- Config validation (task 0.2.3)
- Cart validation (task 0.2.4)

