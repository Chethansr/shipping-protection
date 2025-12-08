# Story 1.4: Checkout Buttons & Server-Side Quotes

## Overview
Implement the narvar-secure-buttons component for checkout page and add server-side quote calculation support. Enable protection offering at checkout with secure quote IDs.

## Description
This story creates the narvar-secure-buttons component with dual CTA rendering, button variants (checkout-with-protection, checkout-without-protection), button event handlers that emit checkout events, server-side quote calculation for checkout page with secure quote IDs, and QuoteCalculator updates to support both client and server-side modes.

## Goals
- Checkout page protection offering
- Dual CTA buttons for clear choice
- Server-side quote validation
- Secure quote IDs prevent tampering
- Support both cart and checkout modes

## Acceptance Criteria
- ✅ narvar-secure-buttons component renders
- ✅ checkout-with-protection button works
- ✅ checkout-without-protection button works
- ✅ Buttons emit checkout events
- ✅ Server-side quote calculation works
- ✅ Secure quote IDs generated
- ✅ QuoteCalculator supports both modes
- ✅ 90%+ test coverage

## Tasks
- [Task 1.4.1](./task-1.4.1.md) - narvar-secure-buttons component
- [Task 1.4.2](./task-1.4.2.md) - Button variants
- [Task 1.4.3](./task-1.4.3.md) - Button event handlers
- [Task 1.4.4](./task-1.4.4.md) - Server-side quote calculation
- [Task 1.4.5](./task-1.4.5.md) - QuoteCalculator update

## Dependencies
- Story 0.7 (Web components)
- Story 0.4 (QuoteCalculator)
- Story 0.5 (Coordinator)

## Technical Notes
- Buttons component for checkout page
- Server quotes prevent client-side manipulation
- Secure quote IDs validated server-side
- Client mode for cart, server mode for checkout

