# Story 0.4: Services Layer

## Overview
Implement the services layer including the Config service for fetching and caching retailer configuration from Narvar CDN, and the QuoteCalculator service for client-side protection quote calculations.

**Edge Service Integration**: QuoteCalculator in Phase 1 will call Narvar edge server for cryptographically signed quotes (~35ms latency, ~2000 TPS capacity). Phase 0 uses client-side calculation only.

## Description
This story creates the Config service factory for fetching retailer configuration from Narvar-managed CDN, in-memory configuration caching, QuoteCalculator factory for client-side calculations, price calculation logic (percentage, fixed fee, tiered), and quote generation with expiration times.

**Phase 1 Additions**:
- **Server-side quote calculation**: Calls Narvar edge server which returns signed quote with cryptographic signature
- **Edge-Signed Quote Model**: Quote signature prevents premium manipulation, verified by retailer backend
- **Performance**: ~35ms edge latency target, 50ms p99 end-to-end, ~2000 TPS capacity

## Goals
- Fast configuration access via caching
- Accurate client-side quote calculation
- Support multiple pricing models
- Currency handling
- Type-safe service interfaces

## Acceptance Criteria
- ✅ Config service fetches and caches configuration
- ✅ getConfiguration() accessor works synchronously after init
- ✅ QuoteCalculator supports percentage-based pricing
- ✅ QuoteCalculator supports fixed fee pricing
- ✅ QuoteCalculator supports tiered pricing
- ✅ Currency codes properly handled
- ✅ Quotes include expiration times
- ✅ 90%+ test coverage with various cart scenarios

## Tasks
- [Task 0.4.1](./task-0.4.1.md) - Config service factory
- [Task 0.4.2](./task-0.4.2.md) - QuoteCalculator factory
- [Task 0.4.3](./task-0.4.3.md) - Price calculation logic
- [Task 0.4.4](./task-0.4.4.md) - Quote calculation tests

## Dependencies
- Story 0.1 (Result types, safe wrappers)
- Story 0.2 (Validation, error types)

## Technical Notes
- Config fetched from Narvar-managed CDN, cached in memory (Phase 0)
- No translations in Phase 0 (hard-coded English strings, translations from config in Phase 1)
- Client-side calculation only in Phase 0 (server-side edge integration in Phase 1)
- Quote expiration defaults to 24 hours
- Phase 1 edge architecture:
  - Private keys on edge servers sign quotes
  - Public keys distributed to retailer backends for verification
  - Quote object must pass unmodified through checkout (field: `narvar_shipping_protection_quote`)
  - Narvar re-verifies signature on order ingestion
  - Rate limiting ensures retailers don't impact each other
  - Supports two modes: As a Fee (affects total only) or As a Line Item (affects subtotal + total)
