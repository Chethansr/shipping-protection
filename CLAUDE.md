# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**IMPORTANT**: This document is derived from the official Technical Requirements Documents (TRDs) which serve as the **source of truth** for this project:
- **Frontend TRD**: https://narvar.atlassian.net/wiki/spaces/DP/pages/4321181804/Frontend
- **Parent TRD (Secure.js)**: https://narvar.atlassian.net/wiki/spaces/DP/pages/4298997778/TRD+Secure.js
- **User Identification**: https://narvar.atlassian.net/wiki/spaces/DP/pages/4311023671
- **Edge Compute**: https://narvar.atlassian.net/wiki/spaces/DP/pages/4347068419
- When there are conflicts between this document and the TRDs, **the TRDs take precedence**
- Periodically sync this file with the latest TRD updates

## Project Overview

**shipping-protection.js** is Narvar's universal JavaScript widget that brings shipping protection to headless commerce and custom storefronts. Built as a third-party script similar to Google Analytics or Stripe, it works on any e-commerce platform regardless of backend technology, framework choice, or custom implementation.

The widget uses an event-driven architecture to achieve complete decoupling from storefront code: retailers pass data to our functions, shipping-protection.js listens and reacts, and communication happens exclusively through events. With Shadow DOM isolation protecting against CSS conflicts, client-side price calculation providing instant UI feedback, and end compute quote calculation at checkout ensuring security, shipping-protection.js enables retailers to integrate Shipping Protection faster and Narvar to expand coverage to a wider range of e-commerce merchants.

The project is being built in phases:
- **Phase 0 (MVP)**: Core cart widget with client-side quote calculation, basic initialization, and customer identity tracking
- **Phase 1**: Analytics, experiments, resilience, checkout buttons, server-side quotes, translations
- **Phase 2**: React Native platform support for mobile shopping apps

Track progress in `todo.md` and detailed implementation plans in `plan/story-*` directories.

## Commands

### Development
```bash
npm run dev              # Start Vite dev server
npm run build            # Build production IIFE bundle (dist/shipping-protection.js)
npm run preview          # Preview production build
```

### Testing
```bash
npm test                 # Run all tests once (Vitest)
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Quality Checks
```bash
npm run size             # Check bundle size (target: ~60KB gzipped, <2KB loader stub)
npm run size:why         # Analyze bundle size contributors
npm run check            # Run tests + bundle size check
```

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Retailer's Page                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Loader Stub (<2KB)                                   │  │
│  │  - Creates Narvar.ShippingProtection namespace        │  │
│  │  - Queues API calls                                   │  │
│  │  - Loads full bundle asynchronously                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Full Bundle (IIFE, ~60KB gzipped)                    │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Bootstrap                                      │  │  │
│  │  │  - Feature detection                            │  │  │
│  │  │  - Initialize core systems                      │  │  │
│  │  │  - Replay queued calls                          │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Public API (window.Narvar.ShippingProtection) │  │  │
│  │  │  - All methods wrapped (never throw)           │  │  │
│  │  │  - Validates inputs with Zod                   │  │  │
│  │  │  - Returns void or Result types                │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │            ↓                    ↓                      │  │
│  │  ┌─────────────────┐  ┌──────────────────────────┐  │  │
│  │  │  State Machine  │  │  Event Bus               │  │  │
│  │  │  (Reducer)      │←→│  (CustomEvents)          │  │  │
│  │  └─────────────────┘  └──────────────────────────┘  │  │
│  │            ↓                    ↓                      │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  Web Component (Shadow DOM)                   │   │  │
│  │  │  <narvar-shipping-protection-widget>          │   │  │
│  │  │  - Isolated styles (CSS custom properties)    │   │  │
│  │  │  - Lit 3.x rendering                          │   │  │
│  │  │  - Variants: toggle/checkbox                  │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Support Systems                                      │  │
│  │  - Analytics (batching, sendBeacon) [Phase 1]        │  │
│  │  - Quote Calculator (client-side)                    │  │
│  │  - Rate Limiter (token bucket) [Phase 1]            │  │
│  │  - i18n (locale detection, formatters) [Phase 1]    │  │
│  │  - Error Tracking (multi-channel) [Phase 1]         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Zero Throws Guarantee**: No exceptions escape to parent page - all errors handled internally
2. **Event-Driven**: State machine + event bus for loose coupling between widget and retailer page
3. **Full Isolation**: Shadow DOM prevents CSS/JS leakage from retailer page
4. **Explicit Errors**: Result types make error handling visible in function signatures
5. **Self-Contained**: No runtime dependencies on monorepo packages (standalone bundle)
6. **Progressive Enhancement**: Graceful degradation on missing browser features

### Core Patterns

**Result Type System** (`web/core/result.ts`)
- Functional error handling without exceptions
- `Result<T, E>` is either `Ok<T>` or `Err<E>`
- Used throughout for safe operations (JSON parsing, fetch, validation)

**State Machine** (`web/state/fsm.ts`)
- Manages widget lifecycle: `UNINITIALIZED` → `INITIALIZING` → `READY` → `CALCULATING` → `QUOTE_AVAILABLE` → `ERROR` → `DESTROYED`
- Phase 0 has terminal `ERROR` state (no retry logic)
- Phase 1 will add `RETRY` action with exponential backoff
- Guards validate preconditions (cart not empty, total > 0)
- Race condition primitives (request IDs, cart hashes) integrated into state

**Event Bus** (`web/state/events.ts`)
- CustomEvent-based pub/sub using factory-based event system
- Event names: `narvar:shipping-protection:state:*`, `narvar:shipping-protection:action:*`
- Events emitted to both internal listeners and `window`
- Never-throw guarantee to ensure widget never breaks parent page
- Key events:
  - `narvar:shipping-protection:state:ready` - After successful bootstrap + init (Phase 0)
  - `narvar:shipping-protection:state:quote-available` - Quote calculated (Phase 0: client-side only, Phase 1: includes signature for server quotes)
  - `narvar:shipping-protection:state:error` - Any handled error (Phase 0)
  - `narvar:shipping-protection:action:add-protection` - Widget wants retailer to add protection (Phase 0)
  - `narvar:shipping-protection:action:remove-protection` - Widget wants retailer to remove protection (Phase 0)
  - `narvar:shipping-protection:action:checkout` - Checkout button pressed (Phase 1)

**Phase 0 vs Phase 1 Event Behavior**:
- **Phase 0 (Current)**:
  - `quote-available` event emitted from **client-side calculation only**
  - Event payload: `{ quote: { amount: number, currency: string } }`
  - No edge service integration, no eligibility field, no signature
  - No page context differentiation (cart vs checkout)
- **Phase 1 (Future)**:
  - `quote-available` event includes **edge service response** with eligibility and signature
  - Event payload: `{ quote: { amount, currency, eligible, signature, source: 'client' | 'server' } }`
  - Edge service called when page context is 'checkout'
  - Eligibility field consumed from edge response
  - Quote types extended in `web/services/quote-calculator.ts` with `EdgeQuoteResponse` and `QuoteWithEligibility`

**Event Timing (When Events Fire)**:
- **`quote-available`**: Only fires when retailer calls `render(cartData)`
  - Flow: `render()` → `coordinator.calculateQuote()` → emits `quote-available`
  - Single emission point: src/coordinator.ts:55
- **`error`**: Fires from BOTH `init()` AND `render()`
  - From `init()`: When config fetch fails (src/coordinator.ts:36)
  - From `render()`: When quote calculator not initialized or calculation fails (src/coordinator.ts:49)
  - Note: `render()` validation errors (SDK not ready, invalid cart) return errors but don't emit events
- **`ready`**: Only fires after successful `init()` (src/coordinator.ts:41)

**Component Communication Pattern**

Unidirectional data flow with direct method calls ensures single source of truth:

```
Coordinator State ──(subscription)──► Component (reactive)
                                            │
                                     (user interaction)
                                            │
Component ──(direct method call)──► Coordinator
                                            │
                                      (state change)
                                            │
Coordinator ──(EventBus)──► Retailer Application
```

**Key decisions**:
- Component subscribes via `coordinator.onStateChange()` in `connectedCallback()`
- Component calls `coordinator.selectProtection()` / `coordinator.declineProtection()` on user action
- Component does NOT emit events directly - coordinator handles all EventBus communication
- Single source of truth (coordinator state), no bidirectional coupling

**Anti-patterns to avoid**:
- ❌ `component.dispatchSelectionEvent()` - component should not emit events
- ❌ `coordinator.updateQuote(component)` - bidirectional coupling
- ❌ Public `updateQuote()` or `reset()` methods on component - state comes from coordinator

### Layer Responsibilities

**API Layer** (`web/api.ts`)
- Exposed globally at `window.Narvar.ShippingProtection`
- Public methods: `init()`, `render()`, `on()`, `off()`, `setCustomerIdentity()`, `getVersion()`, `isReady()`, `destroy()`
- Zero-throw guarantee: all methods wrapped to catch exceptions internally, never crash calling application
- `init()`: Idempotent with 10-second timeout protection, accepts `ShippingProtectionConfig` with variant, page, retailerMoniker, region, locale
- `render()`: Automatically debounced (100ms) to prevent API spam during rapid updates, accepts `CartData`
- `setCustomerIdentity()`: Updates customerId for analytics (Phase 0)
- Phase 1 will add: `setExperiment()`

**Coordinator** (`web/coordinator.ts`)
- Central orchestration layer bridging Public API and internal business logic
- Factory-based architecture: components depend on state, initialized during bootstrap/init
- Manages state transitions, race conditions (rapid cart updates), and data flow synchronization
- Integration points:
  - Public API: execution engine behind the API interface
  - State Machine: holds current `WidgetState`, calls reducer for transitions
  - Race Condition Utilities: integrates `RequestManager`, `debounce`, `cartHash`
  - Event Bus: triggers external events on internal state changes
  - Services: uses `PricingCalculator`, `RateLimiter` for expensive operations

**Services** (`web/services/`)
- Factory pattern for service creation with static state
- **ConfigService**: Fetches and caches retailer configuration + translations
  - **Client-side fetch**: From Narvar-managed CDN
  - **Edge endpoint**: `GET /v1/config/{retailer-moniker}` returns region config, premium rules, eligibility thresholds, localized content
  - Exposes `getConfiguration()` and `getTranslations()`
- **QuoteCalculator**: Client-side and server-side quote calculation
  - **Phase 0 (Current)**: Client-side calculation ONLY (percentage, fixed fee, tiered)
    - Synchronous `calculate(cart)` method returns simple `Quote { amount, currency }`
    - No edge service calls, no eligibility field, no signature
  - **Phase 1 (Future)**: Server-side edge integration added
    - Async `calculateWithEdge(cart)` method calls `POST /v1/quote` on Narvar edge server
    - Edge server (~35ms latency, ~2000 TPS capacity) returns **signed quote** using private key
    - **Edge-Signed Quote Model**: Quote includes JWS compact serialization (ES256), eligibility status, and signature
    - Returns `QuoteWithEligibility { amount, currency, eligible, signature, source: 'server' }`
    - Coordinator determines which method to use based on page context (cart vs checkout)
- **Phase 1 services**:
  - **Analytics**: Manages event reporting to **Titan SDK endpoint** (not noflake directly), identity resolution (anonymous_id via UUIDv7 + localStorage), exposes `track()` function, uses beacon API
  - **Growthbook**: Fetches experiment config from Narvar CDN asynchronously (2s timeout), receives Analytics track function, exposes `getFeatures()` for evaluated feature settings
  - **Error logging service**: Integration with Rollbar for error and diagnostics collection

**Validation** (`web/validation/schemas.ts`)
- Zod schemas for `ShippingProtectionConfig` and `CartData`
- Used at API boundary to validate inputs before processing
- `ShippingProtectionConfig`: variant ('toggle' | 'checkbox'), page ('cart' | 'checkout'), retailerMoniker, region, locale
  - Note: Field named `page` (not `source`) to avoid confusion with quote event's `source` field ('client' | 'server')
- `CartData`: subtotal (cents), items, fees, discounts, currency (ISO 4217)
- `CartItem`: line_price (cents), total_tax (cents), quantity, sku, categories

**Error Handling** (`web/errors/widget-error.ts`)
- `WidgetError` taxonomy: `CONFIG_ERROR`, `NETWORK_ERROR`, `RENDER_ERROR`, `UNKNOWN_ERROR`
- Factory functions: `createError()`, type guards: `isRetryable()`, `categorizeError()`

**Web Components** (`web/components/`)
- Lit-based custom elements with Shadow DOM (`mode: open`) for DOM/style isolation
- **narvar-shipping-protection-widget**: Cart page widget (Phase 0)
  - Variant rendering: toggle, checkbox
  - Subscribes to coordinator state in `connectedCallback()`
  - Calls `coordinator.selectProtection()` and `coordinator.declineProtection()`
  - Receives features via `coordinator.getFeatures()` and translations via `coordinator.getTranslations()`
- **narvar-shipping-protection-buttons**: Checkout page CTAs (Phase 1)
  - Styled via `::part()` pseudo-element for button customization

### Safe Wrappers

The codebase uses safe wrappers in `web/core/` for common operations:
- `safeJsonParse()` / `safeJsonStringify()` - Never throw, return `Result<T, Error>`
- `safeFetch()` - Wraps fetch with timeout (`TIMEOUTS.API_CALL`)
- Storage helpers - Safe localStorage/sessionStorage access
- All timeouts centralized in `web/core/timeouts.ts`

**Wrapping Philosophy**: Focused wrappers for commonly-failing operations only

**Wrapped APIs**:
- Network operations (fetch) - commonly fail in production
- JSON parsing (user data can be malformed)
- Storage operations (quota exceeded errors)

**Not Wrapped** (use try-catch at call sites if needed):
- `querySelector` - rarely throws with valid selectors
- `setTimeout` - doesn't throw in practice
- `addEventListener` - doesn't throw in practice

### Error Handling Philosophy

**Core principle**: NO ERRORS ESCAPE TO PARENT PAGE

**4-Layer Error Handling Strategy**:

1. **Layer 1 - Safe Wrappers**: Wrap commonly-failing operations only
   ```typescript
   safeFetch();      // Returns Result, never throws
   safeJsonParse();  // Returns Result, never throws
   // DOM operations use try-catch at call sites
   ```

2. **Layer 2 - Result Types**: Operations return explicit success/failure
   ```typescript
   validateConfig();  // Returns Result<Config, Error>
   ```

3. **Layer 3 - Public API Wrapper**: All public methods wrapped
   ```typescript
   const safeWrap = (fn, fallback) => {
     return (...args) => {
       try {
         return fn(...args);
       } catch (error) {
         reportError(error);
         return fallback;
       }
     };
   };
   ```

4. **Layer 4 - Bootstrap Top-Level**: Final safety net
   ```typescript
   bootstrap().catch(() => {
     console.warn('[Narvar ShippingProtection] Critical failure');
   });
   ```

**Error flow**:
```
Error occurs → Create WidgetError → Report to analytics → Emit event → Log (debug) → Return safe value
NO EXCEPTION PROPAGATES
```

### Design Decisions

**Why Event-Driven Architecture?**

*Problem*: How to communicate between widget and retailer page without tight coupling?

*Decision*: Event bus with CustomEvents

*Why this works*:
- Standard browser API (zero dependencies)
- Retailer uses familiar `addEventListener`
- Multiple listeners supported
- Works across shadow DOM boundaries
- Easy to remove listeners (cleanup)

**Why Shadow DOM?**

*Problem*: CSS and JavaScript from retailer page can break widget styling

*Decision*: Web Components with Shadow DOM (mode: 'open')

*Why this works*:
- True CSS isolation (retailer styles don't leak in)
- CSS custom properties cross boundary (theming)
- Event bubbling works (communication)
- Standard web platform feature
- Better performance than iFrame

**Why Client-Side Pricing?**

*Problem*: Need instant UI updates on cart changes

*Decision*: Client-side quote calculation with backend verification separate

*Rationale*:
- Instant feedback (no network round-trip)
- Reduces backend load
- Better UX (no loading state)
- Backend still validates on checkout (Phase 1: edge compute with signed quotes)

### Build Configuration

**Vite** (`vite.config.ts`)
- Library mode: Single IIFE bundle `dist/shipping-protection.js`
- Target: `es2019` (per `.browserslistrc`)
- No source maps in production
- Global name: `NarvarShippingProtection`
- Build targets browsers: last 2 Chrome/Firefox/Safari/Edge versions
- Avoids `eval`/dynamic code generation for CSP compliance

**TypeScript** (`tsconfig.json`)
- Strict mode enabled
- Target: `ES2022`
- Module: `ESNext`

**Testing** (`vitest.config.ts`)
- Environment: `jsdom`
- Coverage: v8 provider with text, json-summary, html reports
- Target: 90%+ coverage maintained

## Development Guidelines

### Testing Requirements
- Maintain 90%+ test coverage on all new code
- Tests must cover: happy paths, error cases, edge cases, state transitions
- Use Vitest with jsdom for component testing

### Bundle Size
- Target: ~60KB gzipped for `dist/shipping-protection.js`
- Loader stub: <2KB
- Run `npm run size` before commits
- Use `npm run size:why` to analyze bundle size contributors
- Monitored via `size-limit` in CI

### Phase Constraints

**Phase 0 Scope (Current MVP):**
- Client-side quote calculation only (no server-side)
- Terminal ERROR state (no retry logic)
- Hard-coded English strings (no translations from config service)
- Basic debouncing on render (100ms)
- `setCustomerIdentity()` API method (for analytics prep)
- Basic initialization flow with feature detection
- Bootstrap flow: feature detection, EventBus, basic services, coordinator, public API
- Web component registration with coordinator prop

**Phase 0 Deferred (Simplified):**
- No race condition handling utilities (RequestManager, cartHash)
- No analytics service integration (noflake, userprint, uuidv7)
- No Growthbook service integration
- No error logging service
- No retry strategies or exponential backoff

**Deferred to Phase 1:**
- Analytics service (noflake integration with userprint fingerprinting, uuidv7 anonymous_id)
- Growthbook service (experiments/feature flags, awaits init with 2s timeout)
- Error logging service
- RETRY state action with exponential backoff (3 attempts, 1s/2s/4s delays)
- Race condition utilities (RequestManager with AbortController, cartHash validation, request freshness)
- Resilience patterns (debounce optimization, API retries with jitter)
- `narvar-shipping-protection-buttons` component
- Translations/i18n support (config service returns translations, passed to components)
- Server-side quote calculation (QuoteCalculator handles both client + server)
- `setExperiment()` API method
- ABStyleManager for experimentation-driven CSS

**Phase 2: React Native Platform Support**
- Platform abstraction layer with adapters for storage, events, and rendering
- React Native UI components (cart widget, checkout buttons)
- AsyncStorage adapter for mobile persistence
- React Native EventEmitter adapter
- Platform detection utility
- Separate ES module bundle for React Native
- React Native demo app
- Platform-agnostic core logic (state machine, coordinator, services)
- Unified async storage interface (web localStorage + React Native AsyncStorage)
- StyleSheet API for React Native styling (replaces CSS)
- npm package with platform-specific exports (`/web`, `/native`)
- See `plan/story-2.1-react-native-platform/` for detailed implementation plan

### Security Considerations

**CSP Compliance**:
- No `eval` or `Function()` constructor
- No inline event handlers
- No `innerHTML` with untrusted data
- Loader stub can be inlined (no CSP violation)
- Verified in `public/` test pages

**Input Validation**:
- All external data validated with Zod
- API key format: `pk_(live|test|dev)_[a-zA-Z0-9]+`
- Currency codes: ISO 4217 (3 uppercase letters)
- Integer cents for all monetary values

**Data Privacy**:
- No PII tracked (name, email, address, etc.)
- Device ID is anonymous UUID
- Session ID cleared on browser close
- Cart data privacy control (opt-in to include in analytics)
- Context sanitization removes sensitive fields

**API Key Security**:
- Public keys (pk_*) are safe to expose
- Backend validates by origin/referrer
- Rate limiting prevents abuse (Phase 1)
- No secret keys in client code

**Isolation**:
- Shadow DOM prevents CSS/JS interference
- XSS protection via safe JSON handling
- No eval or inline scripts in production bundle

### Code Organization
- All source in `web/`
- Tests colocated: `web/**/__tests__/*.test.ts`
- Centralized constants (timeouts, error categories, event names)
- Result types preferred over try/catch
- Factory pattern for services and components
- Static state managed via factories initialized during bootstrap/init
- Dynamic state managed via state machine

### Theming
- CSS custom properties exposed as theming API
- CSS layers for cascade management:
  - `@layer NarvarShippingProtection` - Base styles (lowest priority)
  - `@layer NarvarShippingProtectionRetailer` - Retailer overrides (medium priority)
  - `@layer NarvarShippingProtectionAB` - Experiment styles (highest priority, Phase 1)
- Exposed CSS variables on `:host`: colors, typography, spacing, borders, shadows, transitions, z-index
- Checkout buttons styled via `::part()` pseudo-element (Phase 1)
- Phase 1: ABStyleManager generates CSS rules from experimentation JSON config

### Loader Stub & Bootstrap
- Loader stub (<2KB): Creates `window.Narvar.ShippingProtection` namespace, queues API calls via Proxy pattern, async loads main bundle
- Sets `_failed` flag if CDN load fails, ensuring checkout continues unaffected
- Bootstrap flow on bundle execution:
  1. Feature detection (exits silently if required features missing)
  2. Initialize modules: EventBus, Analytics (Phase 1), Growthbook (Phase 1), Config, QuoteCalculator, Coordinator, Public API
  3. Register web components with coordinator prop
  4. Replay queued method calls (init() treated specially with 10s timeout)
  5. Replace stub with real API object, emit ready event

### Resilience Strategies (Phase 1)
- **Debouncing**: `render()` debounced 100ms to prevent excessive API usage
- **RequestManager**: Unique `requestId` + `AbortController` for in-flight operations, automatic abort of superseded requests, `isCurrentRequest(id)` validation
- **Cart Hashing**: Hash validation to detect cart changes during quote fetch, discards stale quotes via `QUOTE_STALE` transition
- **API Retries**: Exponential backoff with jitter for `NETWORK_ERROR` category (3 retries: 1s, 2s, 4s, capped at 30s), no retries for `CONFIG_ERROR`

### Packaging & Versioning
- Single package built via semantic versioning, no retailer-specific builds
- **Tier 1**: `/v1/` - Latest v1.x.x (backward-compatible updates)
- **Tier 2**: `/v1.5/` - Latest v1.5.x (bug fixes only) - Conservative retailers
- **Tier 3**: `/v1.5.4/` - Frozen version (never updates) - Strict change control

## Edge Service Architecture

### Edge-Signed Quote Model
The architecture uses a cryptographically secure quote system to prevent premium manipulation:

1. **Key Management**: Narvar manages public/private key pairs
   - Private keys securely stored on edge servers (Cloudflare Workers or Fastly Compute)
   - Public keys available via `GET /.well-known/jwks.json` endpoint (JWKS JSON format, RFC 8414 standard)
   - JWT header contains `kid` (key ID) to select correct public key for verification

2. **Quote Generation Flow**:
   - Client library calls `POST /v1/quote` with cart data
   - Edge server (Rust/WASM) calculates premium in ~8ms CPU time
   - Signs quote using **JWS with ECDSA P-256** (ES256, industry standard)
   - Returns signed quote with JWS compact serialization, created_at, expires_at
   - Total roundtrip often <5ms

3. **Request/Response Format**:
   ```json
   // POST /v1/quote Request
   {
     "currency": "USD",
     "locale": "en-US",
     "order_items": [
       {
         "line_price": 10000,    // In cents
         "quantity": 2,
         "sku": "SKU-001",
         "total_tax": 850         // In cents
       }
     ],
     "ship_to": "US",             // Shipping destination
     "shipping_fee": 1000,        // In cents
     "shipping_fee_tax": 85,      // In cents
     "store_id": "store-123"      // Retailer moniker
   }

   // POST /v1/quote Response
   {
     "eligible": "eligible",      // "eligible" or "not_eligible"
     "quote": {
       "premium_value": 119       // In cents
     },
     "signature": {
       "jws": "eyJhbGc...",        // JWS compact serialization signed with ES256
       "created_at": 1763505481,  // Unix timestamp
       "expires_at": 1763764681   // Unix timestamp
     },
     "ineligible_reason": null    // Present when not_eligible
   }

   // GET /v1/config/{retailer-moniker} Response
   {
     "regions": {
       "US": {
         "protection_type": "percentage",
         "currency": "USD",
         "premium_rules": { /* pricing rules */ },
         "eligibility_thresholds": { /* min/max values */ },
         "locales": {
           "en-US": { /* localized content */ }
         }
       }
     }
   }
   ```

4. **Checkout Flow**:
   - Retailer passes **complete, unmodified signed quote** to their backend
   - Retailer backend fetches public keys from `GET /.well-known/jwks.json`
   - Uses `kid` from JWT header to select correct public key
   - Verifies JWS signature locally or via Narvar API
   - Order reported to Narvar with quote included (field: `narvar_shipping_protection_quote`)
   - Narvar re-verifies signature before initiating protection workflow

### Technical Implementation
- **Platform**: Cloudflare Workers (recommended) or Fastly Compute
- **Language**: Rust compiled to WASM (ideal for CPU-intensive ECDSA, memory constraints)
- **Signature Algorithm**: JWS with ECDSA using P-256 curve
- **WASM Targets**: `wasip1` (Fastly) or `wasm32-unknown-unknown` (Cloudflare)
- **Memory Constraints**: Strict heap and stack limits on CDN platforms
- **CPU Time Limit**: 50ms per request (Fastly), 10ms free tier (Cloudflare)

### Performance Targets & Capacity
- **Client-side operations**: 2ms (no backend call)
- **Edge CPU time**: ~8ms per request (with hardcoded config)
- **Network roundtrip**: Often <5ms
- **Total client-side latency**: 40ms p99 target (includes roundtrip + backend)
- **TPS**: avg 12.79 TPS (~34M requests/month) to meet $15M annual revenue
- **Capacity**: 403,226,434 requests per year
- **SLA**: 99.99% uptime
- **Rate limiting**: Retailers isolated from impacting each other

### Conversion Ratios (Revenue Calculation)
- Cart views:placed orders = 33:1 (2.5-3% conversion rate per Shopify statistics)
- Checkout page view:placed orders = 5:1 (cart updates during checkout)
- Current Narvar premium per order: ~$1.41

### Platform Comparison
**Cloudflare Workers (Recommended)**:
- Cost: $10.08/month for 33.6M requests ($0.30 per 1M requests)
- CPU: Free under 10ms, $0.02 per 1M CPU ms above
- Observability: $1.68/month ($0.05 per 1M log pushes to DataDog)
- Transparent "pay for what you use" pricing
- 100% SLA uptime guarantee

**Fastly Compute**:
- Cost: $500/month starter package (50M requests, 20ms CPU time)
- Observability behind "Contact sales" paywall
- Package limits per account (may require higher tiers as services scale)
- Existing Narvar contract in place

### Operating Modes
The library supports two modes for applying the protection premium:

1. **As a Fee**: Premium contributes to order **total** but not **subtotal**
2. **As a Line Item**: Premium affects both **subtotal** and **total** (causes two-step async update)

### API Endpoints

**Production Endpoint**: `https://edge-compute-f.dp.domain-ship.qa20.narvar.qa`

**Available Endpoints**:
- `POST /v1/quote` - Calculate delivery protection quotes with JWS signatures
  - Requires: shipping destination, retailer moniker, currency, locale, shipping fees with tax, order items (SKU, quantity, pricing)
  - Returns: eligibility status, quote (premium_value), signature (JWS compact serialization)
- `GET /v1/config/{retailer-moniker}` - Retrieve retailer-specific configuration
  - Returns: locale-specific settings, protection type, premium rules, eligibility thresholds, localization content
- `GET /.well-known/jwks.json` - Get public keys for signature verification (JWKS format, RFC 7517)
- `GET /health` - Service health check

**OpenAPI Spec**: `https://edge-compute-f.dp.domain-ship.qa20.narvar.qa/api-docs/openapi.json`

**POC/Development**:
- Repository: https://github.com/narvar/delivery-protection-edge-compute
- Verification: Signatures can be manually verified at https://www.jwt.io/

## Identity Management & Analytics

### User Identification
The library implements a two-phase identity system for A/B testing and analytics:

**Phase 1: Anonymous Tracking**
- Generate UUIDv7 on first load if no existing ID found
- Store in browser localStorage with key: `narvar_secure_customer_id`
- Identity object structure:
  ```json
  {
    "anonymousId": "018b3200-a7d5-7182-936a-20e36511b84e",
    "createdAt": 1731535200000,
    "retailerId": null,
    "isAnonymous": true
  }
  ```

**Phase 2: ID Bridge (when customer identity available)**
- Retailer calls `setCustomerIdentity({ customerId, emailId })`
- Triggers Customer Identity Event to Narvar backend
- Payload includes **both** anonymous ID and retailer-provided IDs
- Client continues using anonymous ID for event reporting (consistency)
- Backend reconciles all events from anonymous ID to known customer record

**Storage & Persistence**:
- Uses browser Local Storage for cross-session persistence
- Required for consistent A/B test variant assignment
- UUIDv7 provides time-ordered, globally unique IDs with low collision probability

### Analytics & Event Reporting
- **Endpoint**: Titan SDK (not noflake directly)
- **Events**: User interactions, widget impressions, opt-in/out, errors
- **Identity**: Uses anonymous ID until retailer reports customer identity
- **A/B Testing**: Growthbook config fetched from Narvar CDN asynchronously
- **Backend Reconciliation**: Links anonymous behavior to order data via customer ID bridge

### Privacy & Security Considerations
- **XSS Risk**: localStorage vulnerable to XSS attacks
  - Mitigation: No true PII stored (only opaque IDs/hashes), retailers must implement CSP
- **ID Spoofing**: Users can modify client-side ID
  - Mitigation: Backend doesn't trust client ID for authorization, only for tracking/attribution
- **GDPR/CCPA**: Anonymous ID is pseudonymous data
  - Mitigation: Right to erasure endpoint, consent management integration, privacy policy requirements
- **Quote Integrity**: Cryptographic signatures prevent premium manipulation
  - Verification at retailer backend before order submission
- always use the openapi spec as a reference for js and edge communication
- quote-available is guaranteed to only fire from render() calls
- Architectural guidance
- Caller should never await render(). Should be purely event driven