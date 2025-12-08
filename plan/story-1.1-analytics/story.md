# Story 1.1: Analytics Service

## Overview
Implement analytics tracking with identity resolution, event batching, and integration with the **Titan SDK** analytics endpoint. This story enables product analytics and user behavior tracking using UUIDv7-based anonymous IDs with localStorage persistence.

## Description
This story creates the analytics service factory with **Titan SDK** integration (not noflake directly), identity management using UUIDv7 for anonymous IDs with localStorage persistence (key: `narvar_secure_customer_id`), optional userprint for device fingerprinting, track function with beacon API and batch flushing, coordinator integration for tracking state changes and user actions, and the setCustomerIdentity() public API method for ID bridge.

**Identity System**:
- **Phase 1: Anonymous Tracking**: Generate UUIDv7 on first load, store in localStorage
- **Phase 2: ID Bridge**: Retailer calls `setCustomerIdentity()`, triggers Customer Identity Event with both anonymous ID and retailer-provided IDs
- **Backend Reconciliation**: Narvar backend links all anonymous events to known customer record

## Goals
- Accurate user tracking with identity resolution
- Efficient event batching
- Track all significant user actions
- Privacy-compliant tracking
- setCustomerIdentity() API for known users

## Acceptance Criteria
- ✅ Analytics service integrates with **Titan SDK endpoint**
- ✅ Anonymous IDs generated with UUIDv7
- ✅ Identity persisted in localStorage (key: `narvar_secure_customer_id`)
- ✅ Identity object structure: `{ anonymousId, createdAt, retailerId, isAnonymous }`
- ✅ Optional device fingerprinting using userprint
- ✅ Event batching with TIMEOUTS.BATCH_FLUSH
- ✅ Beacon API for reliable delivery
- ✅ Track initialization events
- ✅ Track state change events
- ✅ Track user action events
- ✅ setCustomerIdentity() triggers ID bridge event with both anonymous + retailer IDs
- ✅ Client continues using anonymous ID for consistency after ID bridge
- ✅ 90%+ test coverage

## Tasks
- [Task 1.1.1](./task-1.1.1.md) - Analytics service factory
- [Task 1.1.2](./task-1.1.2.md) - Identity management
- [Task 1.1.3](./task-1.1.3.md) - Track function with batching
- [Task 1.1.4](./task-1.1.4.md) - Coordinator integration
- [Task 1.1.5](./task-1.1.5.md) - setCustomerIdentity() API

## Dependencies
- Story 0.1 (Utilities, constants)
- Story 0.5 (Coordinator)

## Technical Notes
- Endpoint: **Titan SDK** (not noflake directly)
- Use Beacon API for send-on-unload reliability
- Batch events to reduce network calls
- UUIDv7 provides time-ordered, globally unique IDs
- localStorage for cross-session identity persistence (required for consistent A/B testing)
- Privacy considerations:
  - localStorage vulnerable to XSS attacks (no true PII stored, only opaque IDs/hashes)
  - Retailers must implement CSP for XSS protection
  - Anonymous ID is pseudonymous data (GDPR/CCPA compliance required)
  - Right to erasure endpoint needed
  - Consent management integration
- Backend reconciliation links anonymous events to known customer via ID bridge
- Client ID only used for tracking/attribution, not authorization

