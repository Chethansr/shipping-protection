# Story 0.8: Theming System

## Overview
Implement a flexible theming system using CSS layers and CSS custom properties (CSS variables). Enable retailers to customize the widget appearance while maintaining consistent defaults.

**CSS Layers:**
- `@layer NarvarShippingProtection` - Base styles (lowest priority)
- `@layer NarvarShippingProtectionRetailer` - Retailer overrides (medium priority)
- `@layer NarvarShippingProtectionAB` - Experiment styles (highest priority, Phase 1)

**Note:** ABStyleManager for experimentation-driven CSS and `::part()` styling for checkout buttons deferred to Phase 1.

## Description
This story creates CSS layer infrastructure (`@layer NarvarShippingProtection` for base, `@layer NarvarShippingProtectionRetailer` for overrides), CSS custom property definitions on `:host` for all design tokens (colors, typography, spacing, borders, shadows, transitions, z-index), default theme with fallback values, retailer theme override support targeting the custom component in their own CSS layer, and theme override testing.

**Phase 1 Additions:**
- `@layer NarvarShippingProtectionAB` for experiment styles
- ABStyleManager factory for programmatic CSS generation from experimentation JSON
- `::part()` pseudo-element styling for checkout buttons

## Goals
- Flexible theming via CSS custom properties
- Layer-based cascade control
- Sensible defaults
- Easy retailer customization
- No JavaScript required for theming

## Acceptance Criteria
- ✅ CSS layers defined correctly (`@layer NarvarShippingProtection`, `NarvarShippingProtectionRetailer`)
- ✅ All design tokens as CSS custom properties on `:host`
- ✅ Default theme provides fallback values
- ✅ Retailer overrides work via `NarvarShippingProtectionRetailer` layer
- ✅ Layer priority enforced (NarvarShippingProtection < NarvarShippingProtectionRetailer)
- ✅ Theme applies to Shadow DOM
- ✅ Documentation for customization
- ✅ 90%+ test coverage

## Tasks
- [Task 0.8.1](./task-0.8.1.md) - CSS layer infrastructure
- [Task 0.8.2](./task-0.8.2.md) - CSS custom property definitions
- [Task 0.8.3](./task-0.8.3.md) - Default theme
- [Task 0.8.4](./task-0.8.4.md) - Retailer theme override support
- [Task 0.8.5](./task-0.8.5.md) - Theme override testing

## Dependencies
- Story 0.7 (Web components)

## Technical Notes
- CSS layers ensure deterministic priority: Base → Retailer → AB (Phase 1)
- CSS variables exposed on `:host` (the `<narvar-shipping-protection-widget>` element itself)
- Retailer overrides by targeting custom component in their own CSS layer
- Custom properties inherit into Shadow DOM
- No runtime theme switching in Phase 0
- Retailer overrides via external stylesheet
- No `:part()` in Phase 0 (no buttons component)
- No A/B testing CSS layer (`NarvarShippingProtectionAB`) in Phase 0
- ABStyleManager uses Constructed Stylesheet for AB layer (Phase 1)
- Benefits: Minimizes risk of retailer breaking styling, controlled theming, streamlines styling
- Drawback: Limited flexibility (only exposed variables can be changed)

