# Story 0.7: Web Components

## Overview
Implement the `narvar-shipping-protection-widget` web component using Lit. This is the main UI component that displays the protection offering to customers on the cart page.

**Note:** `narvar-shipping-protection-buttons` component is deferred to Phase 1.

## Description
This story creates the `narvar-shipping-protection-widget` base structure using Lit with Shadow DOM (`mode: open`), component variants (toggle, checkbox) based on configuration, state subscription to coordinator for reactive updates via `connectedCallback()`, user interaction handlers for click and keyboard events, and proper component lifecycle with cleanup.

## Goals
- Clean, accessible UI component
- Shadow DOM isolation
- Reactive updates based on state
- Multiple display variants
- Keyboard accessibility

## Acceptance Criteria
- ✅ Widget renders with Shadow DOM (mode: open)
- ✅ Toggle variant displays switch UI
- ✅ Checkbox variant displays checkbox UI
- ✅ Component subscribes to coordinator state
- ✅ UI updates reactively on state changes
- ✅ User interactions emit events
- ✅ Keyboard navigation works (Tab, Space, Enter)
- ✅ Proper lifecycle (connectedCallback, disconnectedCallback)
- ✅ Cleanup prevents memory leaks
- ✅ 90%+ test coverage

## Tasks
- [Task 0.7.1](./task-0.7.1.md) - `narvar-shipping-protection-widget` base structure
- [Task 0.7.2](./task-0.7.2.md) - Component variants
- [Task 0.7.3](./task-0.7.3.md) - State subscription (coordinator prop, `getFeatures()`, `getTranslations()`)
- [Task 0.7.4](./task-0.7.4.md) - User interaction handlers (`coordinator.selectProtection()`, `coordinator.declineProtection()`)
- [Task 0.7.5](./task-0.7.5.md) - Component lifecycle

## Dependencies
- Story 0.1 (Lit foundation)
- Story 0.3 (State machine, events)
- Story 0.5 (Coordinator)

## Technical Notes
- Component name: `narvar-shipping-protection-widget` (not `narvar-secure-widget`)
- No `narvar-shipping-protection-buttons` component in Phase 0 (deferred to Phase 1)
- Shadow DOM mode: open for styling
- All strings hard-coded in English (Phase 0)
- Translations from config service deferred to Phase 1
- Coordinator prop set during web component registration
- Components subscribe to coordinator state in `connectedCallback()`
- Components call `coordinator.getFeatures()` and `coordinator.getTranslations()` (Phase 1) for rendering

