# Story 2.2: Hybrid WebView + Native Architecture

**Status:** Planning Complete
**Priority:** High
**Estimated Effort:** 12 days
**Dependencies:** Story 2.1 (React Native Platform)

## Overview

Design and implement a hybrid React Native component that supports both WebView mode (loading remote HTML/JS from CDN) and Native mode (pure React Native components rendering variants). This provides retailers maximum flexibility to choose based on their needs (performance vs maintenance) and enables A/B testing across modes and variants.

## Context

The shipping protection widget is being extended to support React Native mobile apps (Phase 2). Initial investigation revealed that:

1. **No native iOS/Android APIs required** - Everything can be done with React Native built-ins (AsyncStorage, fetch, StyleSheet, EventEmitter)
2. **WebView vs Native trade-offs** exist - WebView has 90% code reuse but slower performance; Native has 3-5x better performance but requires maintaining two codebases
3. **Apple App Store compliance** - Remote HTML/JS in WebView is allowed under "HTML5 mini apps" exception
4. **Variant experimentation needed** - Want to A/B test new UI patterns (dual-button, etc.)

## Decision

Implement a **hybrid component** that supports BOTH modes, giving retailers choice and enabling gradual migration from WebView to Native if performance becomes critical.

## Goals

1. **Single Component API** - One component with `mode` prop to switch between WebView and Native rendering
2. **100% Backward Compatible** - Keep existing `ShippingProtectionWebView` component working
3. **Zero Business Logic Duplication** - Extract coordinator to React Native hook, reuse across modes
4. **A/B Testing Ready** - Test modes (webview vs native) and variants (toggle, checkbox, dual-button)
5. **Theme System** - Mirror web SDK CSS custom properties for consistent customization
6. **Type-Safe** - Discriminated union props enforce mode-specific requirements

## Non-Goals

- Remove WebView support (keep for independent deployment)
- Port entire web SDK to React Native (only extract business logic)
- Support additional platforms beyond iOS/Android (focus on mobile apps)

## Architecture

### Component API

```typescript
interface ShippingProtectionHybridProps {
  // Mode selection
  mode: 'webview' | 'native';

  // Variant (required for native, optional for webview)
  variant?: 'toggle' | 'checkbox' | 'dual-button';

  // Standard props (same across modes)
  config: ShippingProtectionConfig;
  cart: CartData;
  onReady?: (version: string) => void;
  onQuoteAvailable?: (quote: Quote) => void;
  onProtectionAdd?: (amount: number, currency: string) => void;
  onProtectionRemove?: () => void;
  onError?: (error: SerializedError) => void;
  customerIdentity?: { customerId?: string; emailId?: string };

  // Mode-specific props
  webview?: { widgetUrl?: string };
  native?: { theme?: ShippingProtectionTheme; style?: ViewStyle };

  style?: ViewStyle;
  debug?: boolean;
}
```

### File Structure

```
mobile/webview/src/
├── ShippingProtectionHybrid.tsx         # NEW: Main hybrid component
├── ShippingProtectionWebView.tsx        # KEEP: Backward compatibility
├── modes/
│   ├── WebViewMode.tsx                  # REFACTOR: Extract from WebView
│   └── NativeMode.tsx                   # NEW: Native coordinator wrapper
├── variants/
│   ├── ToggleVariant.tsx                # NEW: iOS Switch
│   ├── CheckboxVariant.tsx              # NEW: Custom checkbox
│   └── DualButtonVariant.tsx            # NEW: Dual CTAs
├── core/
│   ├── useNativeCoordinator.ts          # NEW: Business logic hook
│   ├── useQuoteCalculator.ts            # NEW: Quote calculation
│   └── NativeEventBridge.ts             # NEW: EventEmitter wrapper
├── types/
│   └── native-types.ts                  # NEW: Theme, props interfaces
└── utils/
    └── currency-formatter.ts            # NEW: Shared formatting
```

### Key Design Decisions

#### 1. Shared Business Logic (No Duplication)

**Decision:** Extract coordinator logic to `useNativeCoordinator` React hook instead of duplicating web SDK code.

**Rationale:**
- Web SDK coordinator is already platform-agnostic (state machine, quote calc, config fetch)
- Only platform-specific code is: UI rendering, storage, events
- Avoids maintaining two implementations that could diverge

**Implementation:**
```typescript
// useNativeCoordinator.ts - mirrors web coordinator behavior
const { state, quote, error, isSelected, selectProtection, declineProtection } =
  useNativeCoordinator(config, cart, callbacks, debug);
```

#### 2. Mode-Based Conditional Rendering

**Decision:** Single component with `mode` prop that conditionally renders WebView or Native mode.

**Rationale:**
- Simple API for retailers (one import, one component)
- Type-safe props via discriminated unions
- Easy to A/B test by changing `mode` prop value

**Implementation:**
```typescript
if (mode === 'webview') {
  return <WebViewMode {...props} />;
} else {
  return <NativeMode variant={variant} {...props} />;
}
```

#### 3. Backward Compatibility

**Decision:** Keep existing `ShippingProtectionWebView` component alongside new hybrid component.

**Rationale:**
- Zero breaking changes for existing WebView users
- Allows gradual migration at retailer's pace
- Can deprecate in v2.0 after migration period

#### 4. Theme System

**Decision:** Mirror web SDK CSS custom properties in React Native theme interface.

**Rationale:**
- Consistent theming API across web and mobile
- Familiar to developers already using web SDK
- Platform-specific defaults (iOS vs Android styles)

**Implementation:**
```typescript
interface ShippingProtectionTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  fontSize?: number;
  fontFamily?: string;
  // ... matches web CSS custom properties
}
```

## Implementation Plan

### Phase 1: Foundation (Week 1 - 5 days)

**Task 1.1: Create Type Definitions (0.5 days)**
- [ ] Create `native-types.ts` with theme, props interfaces
- [ ] Add discriminated union types for mode-specific props
- [ ] Update `index.ts` exports
- [ ] Add Zod validators for native props

**Task 1.2: Build Native Event Bridge (1 day)**
- [ ] Implement `NativeEventBridge.ts` using EventEmitter
- [ ] Mirror web SDK event names (`ready`, `quote-available`, `add-protection`, etc.)
- [ ] Add TypeScript types for all events
- [ ] Write unit tests for event emission and subscription

**Task 1.3: Extract Core Business Logic Hook (1.5 days)**
- [ ] Create `useNativeCoordinator.ts` hook
- [ ] Implement state machine: UNINITIALIZED → INITIALIZING → READY → CALCULATING → QUOTE_AVAILABLE → ERROR
- [ ] Add config fetching logic (fetch from edge/CDN)
- [ ] Port client-side quote calculator
- [ ] Implement selection handlers (`selectProtection`, `declineProtection`)
- [ ] Write unit tests with mock fetch

**Task 1.4: Implement Currency Formatter (0.5 days)**
- [ ] Create `currency-formatter.ts` shared utility
- [ ] Use Intl.NumberFormat for i18n support
- [ ] Add fallback for unsupported locales
- [ ] Write unit tests

**Task 1.5: Build Variant Components (1.5 days)**
- [ ] Implement `ToggleVariant.tsx` (iOS Switch style)
- [ ] Implement `CheckboxVariant.tsx` (custom TouchableOpacity)
- [ ] Create placeholder `DualButtonVariant.tsx` (to be completed later)
- [ ] Integrate theme system
- [ ] Handle loading and error states
- [ ] Write unit tests for each variant

### Phase 2: Mode Integration (Week 2 - 3 days)

**Task 2.1: Extract WebView Mode (1 day)**
- [ ] Refactor `ShippingProtectionWebView.tsx` → `WebViewMode.tsx`
- [ ] Keep existing functionality intact
- [ ] Update tests
- [ ] Ensure backward compatibility

**Task 2.2: Create Native Mode Wrapper (1 day)**
- [ ] Implement `NativeMode.tsx` component
- [ ] Integrate `useNativeCoordinator` hook
- [ ] Route to correct variant based on prop
- [ ] Handle loading and error states
- [ ] Connect callbacks to coordinator events
- [ ] Write unit tests

**Task 2.3: Build Hybrid Component (1 day)**
- [ ] Implement `ShippingProtectionHybrid.tsx`
- [ ] Add mode-based conditional rendering
- [ ] Validate props (variant required for native mode)
- [ ] Implement type-safe discriminated union props
- [ ] Update `index.ts` exports
- [ ] Write integration tests

### Phase 3: Testing & Validation (Week 2 - 2 days)

**Task 3.1: Unit Tests (1 day)**
- [ ] Test `useNativeCoordinator` hook with mock fetch
- [ ] Test each variant component in isolation
- [ ] Test event bridge emission and subscription
- [ ] Test currency formatter
- [ ] Achieve 95%+ coverage

**Task 3.2: Integration Tests (0.5 days)**
- [ ] Test mode switching (webview ↔ native)
- [ ] Test variant switching (toggle ↔ checkbox)
- [ ] Test callback invocations
- [ ] Test error handling across modes

**Task 3.3: E2E Test App (0.5 days)**
- [ ] Create `hybrid-test` demo app
- [ ] Build comparison screen (side-by-side modes)
- [ ] Build WebView test screen
- [ ] Build Native test screen with variant switcher
- [ ] Add performance profiling

### Phase 4: Documentation & Migration (Week 3 - 2 days)

**Task 4.1: API Documentation (0.5 days)**
- [ ] Document hybrid component props
- [ ] Document mode selection guidance
- [ ] Document variant customization
- [ ] Document theme system

**Task 4.2: Migration Guide (0.5 days)**
- [ ] Write upgrade guide from WebView-only to hybrid
- [ ] Document breaking changes (none expected)
- [ ] Create mode selection decision tree
- [ ] Add performance comparison

**Task 4.3: Usage Examples (0.5 days)**
- [ ] WebView mode example
- [ ] Native mode example
- [ ] A/B testing example (mode + variant)
- [ ] Theme customization example

**Task 4.4: Code Review & Refinement (0.5 days)**
- [ ] Code review with team
- [ ] Address feedback
- [ ] Performance optimization
- [ ] Bundle size check

## Performance Targets

| Metric | WebView | Native | Target |
|--------|---------|--------|--------|
| Initial Load | ~80ms | ~16ms | <100ms |
| Quote Calculation | ~50ms | ~50ms | <50ms |
| User Interaction | ~80ms | ~16ms | <100ms |
| Memory Footprint | 10-20MB | ~2MB | <5MB |
| Animation FPS | 30-45fps | 60fps | 60fps |
| Bundle Size Impact | 0KB (CDN) | +45KB | <50KB |

## Testing Strategy

### Unit Tests
- `useNativeCoordinator` hook (state machine, config fetch, quote calc)
- Each variant component (toggle, checkbox, dual-button)
- Event bridge (emission, subscription)
- Currency formatter (i18n, fallbacks)

### Integration Tests
- Mode switching (webview ↔ native)
- Variant switching (toggle ↔ checkbox ↔ dual-button)
- Callback invocations across modes
- Error handling (config fetch fails, quote calc fails)

### E2E Tests (Optional - Detox)
- Display quote in webview mode
- Display quote in native mode
- Toggle protection in native mode
- Performance comparison (FPS, memory)

## Migration Guide

### Non-Breaking Changes

The hybrid component is **100% backward compatible**. Existing WebView users can continue using `ShippingProtectionWebView` as-is.

### Migration Path A: Keep Existing Component (No Changes)

```typescript
// Before and After: NO CHANGES REQUIRED
import { ShippingProtectionWebView } from '@narvar/shipping-protection-webview-rn';

<ShippingProtectionWebView
  config={{ variant: 'toggle', page: 'cart', retailerMoniker: 'belk', region: 'US', locale: 'en-US' }}
  cart={cartData}
  onProtectionAdd={(amount, currency) => {}}
  onProtectionRemove={() => {}}
/>
```

### Migration Path B: Upgrade to Hybrid Component (WebView Mode)

```typescript
// Optional: Switch to hybrid component
import { ShippingProtectionHybrid } from '@narvar/shipping-protection-webview-rn';

<ShippingProtectionHybrid
  mode="webview"
  config={{ variant: 'toggle', page: 'cart', retailerMoniker: 'belk', region: 'US', locale: 'en-US' }}
  cart={cartData}
  onProtectionAdd={(amount, currency) => {}}
  onProtectionRemove={() => {}}
/>
```

### Migration Path C: Adopt Native Mode (Performance Optimization)

```typescript
// Switch to native mode for better performance
import { ShippingProtectionHybrid } from '@narvar/shipping-protection-webview-rn';

<ShippingProtectionHybrid
  mode="native"
  variant="toggle"
  config={{ page: 'cart', retailerMoniker: 'belk', region: 'US', locale: 'en-US' }}
  cart={cartData}
  onProtectionAdd={(amount, currency) => {}}
  onProtectionRemove={() => {}}
  native={{
    theme: {
      primaryColor: '#007AFF',
      backgroundColor: '#FFFFFF',
      borderRadius: 12
    }
  }}
/>
```

## A/B Testing Examples

### Test Modes (WebView vs Native)

```typescript
import { useFeatureValue } from '@growthbook/growthbook-react';

const mode = useFeatureValue('shipping-protection-mode', 'webview');

<ShippingProtectionHybrid
  mode={mode}
  variant="toggle"
  config={config}
  cart={cart}
/>
```

### Test Variants (Toggle vs Checkbox vs Dual-Button)

```typescript
const variant = useFeatureValue('shipping-protection-variant', 'toggle');

<ShippingProtectionHybrid
  mode="native"
  variant={variant}
  config={config}
  cart={cart}
/>
```

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **WebView vs Native behavioral differences** | Users see inconsistent UX | Comprehensive integration tests, side-by-side comparison screen |
| **Performance not meeting targets** | Native mode doesn't justify maintenance cost | Profile early, optimize hot paths, measure in real apps |
| **Larger bundle size** | App download size increases | Tree-shaking, code splitting, measure impact |
| **Theme system insufficient** | Retailers can't match brand | Expose more customization props, document limitations |
| **Business logic divergence** | Web and mobile calculate different quotes | Share validation tests, document quote calc algorithm |

## Success Metrics

- **Adoption:** 10+ retailers use hybrid component within 3 months
- **Mode Split:** Measure WebView vs Native usage (expect 80% WebView, 20% Native initially)
- **Performance:** Native mode meets all performance targets (<100ms load, 60fps, <5MB memory)
- **Bundle Size:** Native mode adds <50KB to app bundle
- **A/B Tests:** 5+ experiments using mode/variant switching
- **Bug Rate:** <5 production bugs in first 6 months

## Follow-Up Work

- **Story 2.3:** Dual-Button Variant Implementation (complete placeholder from Task 1.5)
- **Story 2.4:** Advanced Theme Customization (shadows, animations, gradients)
- **Story 2.5:** Edge Service Integration for Native Mode (server-side quotes with signatures)
- **Story 2.6:** Analytics Integration for Native Mode (event tracking, Growthbook experiments)

## References

- **Parent TRD:** https://narvar.atlassian.net/wiki/spaces/DP/pages/4298997778/TRD+Secure.js
- **Frontend TRD:** https://narvar.atlassian.net/wiki/spaces/DP/pages/4321181804/Frontend
- **React Native Platform Story:** `plan/story-2.1-react-native-platform/`
- **CLAUDE.md:** Phase 2 architecture guidance (lines 320-350)
- **Apple App Store Guidelines:** Section 2.5.2 (HTML5 mini apps exception)
