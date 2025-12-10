# Story 2.2: Hybrid WebView + Native Architecture

## Quick Links

- **[Story Plan](./story.md)** - Full implementation plan with timeline and tasks
- **[Decision Log](./DECISION_LOG.md)** - Research, trade-offs, and architectural decisions

## TL;DR

Build a hybrid React Native component that supports **both** WebView mode (loading remote HTML/JS) and Native mode (pure React Native rendering). This gives retailers maximum flexibility to choose based on performance vs maintenance needs, and enables A/B testing across modes and variants.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture** | Hybrid (WebView + Native) | Maximum flexibility, A/B testing, gradual migration |
| **Business Logic** | Shared via React hook | No duplication, single source of truth |
| **Backward Compat** | 100% compatible | Keep existing WebView component working |
| **Mode Switching** | Explicit `mode` prop | Clear intent, type-safe, easy to A/B test |
| **Theme System** | Mirror web CSS props | Consistent API across web and mobile |

## Timeline

- **Week 1 (5 days):** Foundation (types, event bridge, coordinator hook, variants)
- **Week 2 (5 days):** Integration + Testing (mode wrappers, hybrid component, tests)
- **Week 3 (2 days):** Documentation (API docs, migration guide, examples)
- **Total:** 12 days

## Component API

```typescript
<ShippingProtectionHybrid
  mode="webview" | "native"
  variant="toggle" | "checkbox" | "dual-button"
  config={config}
  cart={cart}
  onReady={(version) => {}}
  onQuoteAvailable={(quote) => {}}
  onProtectionAdd={(amount, currency) => {}}
  onProtectionRemove={() => {}}
  onError={(error) => {}}
  webview={{ widgetUrl: '...' }}
  native={{ theme: { ... } }}
/>
```

## Performance Targets

| Metric | WebView | Native |
|--------|---------|--------|
| Initial Load | ~80ms | ~16ms |
| Memory | 10-20MB | ~2MB |
| FPS | 30-45fps | 60fps |
| Bundle Impact | 0KB (CDN) | +45KB |

## Files to Create

**New files (10):**
- `ShippingProtectionHybrid.tsx` - Main hybrid component
- `core/useNativeCoordinator.ts` - Business logic hook
- `modes/NativeMode.tsx` - Native mode wrapper
- `modes/WebViewMode.tsx` - WebView mode (extracted)
- `variants/ToggleVariant.tsx` - iOS Switch variant
- `variants/CheckboxVariant.tsx` - Custom checkbox variant
- `variants/DualButtonVariant.tsx` - Dual CTA variant
- `core/NativeEventBridge.ts` - EventEmitter wrapper
- `types/native-types.ts` - Theme, props types
- `utils/currency-formatter.ts` - Shared formatting

**Existing files to update (5):**
- `ShippingProtectionWebView.tsx` - Keep for backward compat
- `types/validation.ts` - Add native prop schemas
- `index.ts` - Export hybrid component

## Migration Paths

### Path A: No Changes (Backward Compatible)
```typescript
// Keep using existing component
import { ShippingProtectionWebView } from '@narvar/shipping-protection-webview-rn';
<ShippingProtectionWebView config={config} cart={cart} />
```

### Path B: Switch to Hybrid (WebView Mode)
```typescript
// Optional upgrade to hybrid component
import { ShippingProtectionHybrid } from '@narvar/shipping-protection-webview-rn';
<ShippingProtectionHybrid mode="webview" config={config} cart={cart} />
```

### Path C: Adopt Native Mode (Performance)
```typescript
// Switch to native for better performance
import { ShippingProtectionHybrid } from '@narvar/shipping-protection-webview-rn';
<ShippingProtectionHybrid
  mode="native"
  variant="toggle"
  config={config}
  cart={cart}
  native={{ theme: { primaryColor: '#007AFF' } }}
/>
```

## A/B Testing

```typescript
// Growthbook controls mode and variant
const mode = useFeatureValue('shipping-protection-mode', 'webview');
const variant = useFeatureValue('shipping-protection-variant', 'toggle');

<ShippingProtectionHybrid mode={mode} variant={variant} config={config} cart={cart} />
```

## Status

- **Planning:** ✅ Complete
- **Implementation:** ⏳ Not started
- **Testing:** ⏳ Not started
- **Documentation:** ⏳ Not started

## Questions?

See [DECISION_LOG.md](./DECISION_LOG.md) for detailed research, trade-offs, and rationale behind all decisions.
