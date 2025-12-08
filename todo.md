# Codex Phase 0 TODOs

This backlog tracks Phase 0 scope for building `shipping-protection.js`. See detailed implementation plans in `plan/story-*` directories.

**Source of Truth**: https://narvar.atlassian.net/wiki/spaces/DP/pages/4321181804/Frontend

## Story 0.1 – Foundation & Build Infrastructure
- [x] Scaffold project tooling (Vite, TypeScript, Vitest, browserslist, CSP test harness)
- [x] Implement Result helpers (`ok`, `err`, `unwrapOr`, `mapResult`, `andThen`, type guards)
- [x] Add safe wrappers (`safeJsonParse`, `safeJsonStringify`, `safeFetch` with `TIMEOUTS.API_CALL`)
- [x] Build shared utilities (storage helpers, centralized timeout constants)
- [x] Ship "Hello Secure" Lit component demo to verify build + CSP

## Story 0.2 – Error System & Validation
- [ ] Define `WidgetError` taxonomy + categories (`CONFIG_ERROR`, `NETWORK_ERROR`, `RENDER_ERROR`, `UNKNOWN_ERROR`)
- [ ] Create error factory + type guards (`createError`, `isRetryable`, `categorizeError`)
- [ ] Author Zod schema for `ShippingProtectionConfig` (variant, page, retailerMoniker, region, locale)
- [ ] Author Zod schema for `CartData` (subtotal, items, fees, discounts, currency)
- [ ] Author Zod schema for `CartItem` (line_price, total_tax, quantity, sku, categories)
- [ ] Ensure Result<> usages propagate `WidgetError` + safe wrappers

## Story 0.3 – State Machine & Event Bus
- [ ] Model FSM types + reducer (`UNINITIALIZED` → `INITIALIZING` → `READY` → `CALCULATING` → `QUOTE_AVAILABLE` → `ERROR` → `DESTROYED`)
- [ ] Implement state actions/guards (initialize/calc/select/decline/error/destroy)
- [ ] Add guards for preconditions (cart not empty, total > 0)
- [ ] Build factory-based CustomEvent bus with `on`/`off`/`emit`, never-throw guarantee
- [ ] Declare event payloads (`narvar:shipping-protection:state:*`, `narvar:shipping-protection:action:*`)
- [ ] Implement key events: `ready`, `quote-available`, `error`, `add-protection`, `remove-protection`, `checkout`

## Story 0.4 – Services Layer
- [ ] Config service factory (fetch + cache + `getConfiguration()` + `getTranslations()`)
- [ ] QuoteCalculator factory (client-side only for Phase 0, server-side deferred to Phase 1)
- [ ] Implement pricing strategies (percentage, fixed fee, tiered)
- [ ] Write quote calc unit tests (currency + edge cases)
- [ ] Note: Analytics, Growthbook, and Error Logging services deferred to Phase 1

## Story 0.5 – Coordinator
- [ ] Coordinator factory (bootstrap + DI wiring)
- [ ] State management hooks (dispatch + subscriptions)
- [ ] Quote lifecycle orchestration
- [ ] Protection selection handlers (select / decline)
- [ ] Error handling + event emission contracts

## Story 0.6 – Public API & Loader Stub
- [ ] Async loader stub (<2KB) with Proxy-based queued method pattern + `_failed`
- [ ] Global API at `window.Narvar.ShippingProtection` (not `NarvarSecure`)
- [ ] Public API surface (`init`, `render`, `on`, `off`, `setCustomerIdentity`, `getVersion`, `isReady`, `destroy`)
- [ ] Zero-throw wrappers - all methods catch exceptions internally
- [ ] Bootstrap flow (feature detection, EventBus, services init, coordinator, web component registration, queue replay, ready event)
- [ ] Init timeout fail-safe (10s, idempotent)
- [ ] Note: `setExperiment()` deferred to Phase 1

## Story 0.7 – Web Components
- [ ] `narvar-shipping-protection-widget` Lit base + Shadow DOM (`mode: open`)
- [ ] Variant rendering (toggle, checkbox)
- [ ] Coordinator prop set during registration
- [ ] Subscribe to coordinator state in `connectedCallback()`
- [ ] Call `coordinator.getFeatures()` and `coordinator.getTranslations()` for rendering
- [ ] User interaction handlers → `coordinator.selectProtection()` and `coordinator.declineProtection()`
- [ ] Lifecycle cleanup (connected/disconnected)
- [ ] Note: `narvar-shipping-protection-buttons` deferred to Phase 1

## Story 0.8 – Theming System
- [ ] Define CSS layers (`NarvarShippingProtection`, `NarvarShippingProtectionRetailer`)
- [ ] Publish CSS custom properties on `:host` (colors, spacing, typography, borders, shadows, transitions, z-index)
- [ ] Default theme definitions
- [ ] Retailer override examples/docs (targeting custom component in `@layer NarvarShippingProtectionRetailer`)
- [ ] Theme override tests (layer priority + fallback)
- [ ] Note: `NarvarShippingProtectionAB` layer and ABStyleManager deferred to Phase 1
- [ ] Note: `::part()` styling for checkout buttons deferred to Phase 1

## Story 0.9 – Testing & Documentation
- [ ] Playwright E2E suite (init, variants, interactions, errors)
- [ ] Security tests (XSS, CSP, Shadow DOM isolation)
- [ ] Accessibility tests (WCAG 2.1 AA, keyboard, ARIA)
- [ ] Integration guide + API reference drafts
- [ ] CI wiring (coverage, bundle limits, gating)

## Meta / Infra
- [ ] Keep all new source files inside `src/`
- [ ] Track progress by updating this file as tasks complete
