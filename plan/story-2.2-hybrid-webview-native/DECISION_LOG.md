# Decision Log: Hybrid WebView + Native Architecture

## Decision Timeline

### 2024-12-09: Initial Questions

**Question 1:** Can a WebView show up above the checkout button on actual e-commerce sites, or does it have to be a new page per Apple/Android?

**Answer:** ✅ WebViews can be positioned anywhere in native apps (iOS/Android). There are no platform restrictions on WebView positioning. The app developer controls the entire UI hierarchy. WebViews are just native UI components like `View` or `Text`.

**Source:** Apple/Android documentation, standard React Native WebView usage patterns

---

**Question 2:** Does Apple allow posting messages between HTML/JS and React Native components? Will this pass certification?

**Answer:** ✅ Yes, 100% allowed. This is the standard, Apple-approved pattern.

- React Native WebView provides official bidirectional messaging via `postMessage`
- Used by thousands of production apps
- No special entitlements needed
- Standard React Native WebView API

**What WOULD be rejected:**
- ❌ Using private iOS APIs
- ❌ Dynamically downloading executable code (native binaries)
- ❌ Bypassing in-app purchase for digital goods

**Source:**
- Apple App Store Review Guidelines (Section 2.5.2)
- React Native WebView documentation
- Industry best practices (Stripe, PayPal patterns)

---

### 2024-12-09: Remote Code Injection Research

**Question:** Do payment providers like Stripe, PayPal, AfterPay inject JS/view remotely? Would that not be counted as remote code injection per Apple standards?

**Answer:** Remote HTML/JS in WebView IS ALLOWED ✅

**Apple's Exception (Guideline 2.5.2):**
> "Scripts and code downloaded and run by Apple's built-in WebKit framework or JavascriptCore are allowed, provided that such scripts and code do not change the primary purpose of the Application"

**Apple explicitly permits:**
> "Apps may offer certain software that is not embedded in the binary, specifically **HTML5 and JavaScript mini apps** and mini games, streaming games, chatbots, and plug-ins."

**What Payment Providers Actually Do:**

1. **PayPal:**
   - ❌ Explicitly discourages WebView for checkout
   - ✅ Recommends ASWebAuthenticationSession (Apple's system auth)
   - **Why:** InfoSec policies, cookie persistence, URL verification

2. **Afterpay:**
   - ✅ Pure native iOS SDK (not WebView-based)
   - **Why:** Better UX, no web page loading dependency

3. **Stripe:**
   - ✅ Native SDK for card payments
   - Post-Epic v. Apple ruling: Can link to external web checkout

**Key Distinction:**
- **Payment processors** avoid WebView for security/compliance (PCI-DSS, banking regulations)
- **Shipping protection widget** is NOT a payment processor (opt-in insurance selection)
- **Our use case** is more like analytics widgets (Google Analytics), chat widgets (Intercom), A/B testing tools

**Sources:**
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [PayPal Native Checkout SDK](https://medium.com/paypal-tech/paypal-native-checkout-sdk-for-ios-and-android-5a9853b60a21)
- [Afterpay iOS SDK](https://github.com/afterpay/sdk-ios)

---

### 2024-12-09: Native API Requirements

**Observation:** There are no native calls really that we need. Do we need native features/API for shipping protection use case?

**Answer:** NO native iOS/Android APIs needed ✅

**What the widget does:**
1. Display UI (checkbox/toggle)
2. Calculate quotes (math or HTTP fetch)
3. Store data (anonymous ID, customer identity)
4. Emit events (user selections, quote changes)
5. Track analytics (Phase 1)

**What's available in React Native without native modules:**

| Feature | WebView Uses | React Native Has | Native Module Needed? |
|---------|--------------|------------------|----------------------|
| Storage | `localStorage` | `AsyncStorage` | ❌ No (community package) |
| Network | `fetch` | `fetch` | ❌ No (built-in) |
| Events | `CustomEvent` | `EventEmitter` | ❌ No (built-in) |
| UI Rendering | HTML/CSS | `View`/`StyleSheet` | ❌ No (built-in) |
| JSON/Math | JavaScript | JavaScript | ❌ No (built-in) |
| Device Info | `navigator` | `Platform` | ❌ No (built-in) |

**What we DON'T need:**
- ❌ Camera
- ❌ Biometrics
- ❌ Push notifications
- ❌ In-app purchases (not a payment processor)
- ❌ Location/GPS
- ❌ Native payment SDKs

**Impact:** This changes the equation! WebView's main advantage is code reuse, NOT native access. Pure React Native becomes more attractive.

---

### 2024-12-09: Built-In Variants Proposal

**Question:** Instead of `/public/widget-webview.html`, can the ShippingProtectionWebView component also define a set of widgets like checkbox, dual-button, etc. so we can A/B test?

**Answer:** Yes! This led to the hybrid architecture decision.

**What this means:**
- ❌ No WebView at all (rename to `ShippingProtectionWidget`)
- ✅ Pure React Native components rendering variants
- ✅ Variants defined as React Native UI (View, Switch, TouchableOpacity)
- ✅ A/B testing by passing `variant` prop

**Current variants in web SDK:**
- **Phase 0:** `'toggle'` and `'checkbox'` (defined in `web/validation/schemas.ts:8`)
- **Phase 1:** `narvar-shipping-protection-buttons` (separate checkout component)
- **Proposed:** Add `'dual-button'` as new variant

**Trade-offs identified:**

| Factor | WebView (remote HTML) | Built-In Variants (native) |
|--------|----------------------|----------------------------|
| Time to Ship | 2 days | 5-7 days |
| Performance | 50-100ms | 16-32ms (3x faster) |
| Code Reuse | 90% | 30% |
| Add New Variants | Update CDN | Ship app update |
| A/B Testing | Server-side (instant) | Client-side (app release) |
| Maintenance | One codebase | Two codebases |

---

### 2024-12-09: FINAL DECISION - Hybrid Architecture

**Decision:** Implement hybrid component supporting BOTH WebView mode and Native mode ✅

**User selected:** "Hybrid (supports both modes)"

**Rationale:**

1. **Maximum Flexibility**
   - Retailers choose based on needs (performance vs maintenance)
   - Can A/B test WebView vs Native rendering
   - Gradual migration path (start WebView, move to Native later)

2. **Avoids Forcing Trade-Offs**
   - Don't have to choose between code reuse (WebView) and performance (Native)
   - Both approaches have valid use cases
   - Let data/usage inform future decisions

3. **Backward Compatible**
   - Keep existing `ShippingProtectionWebView` working
   - No breaking changes for current users
   - Optional upgrade to hybrid component

4. **Shared Business Logic**
   - Extract coordinator to `useNativeCoordinator` hook
   - NO duplication between WebView and Native modes
   - Single source of truth for state machine, quote calc, config fetch

**Implementation approach:**

```typescript
interface ShippingProtectionHybridProps {
  mode: 'webview' | 'native';
  variant?: 'toggle' | 'checkbox' | 'dual-button';
  // ... other props
}

const ShippingProtectionHybrid = (props) => {
  if (props.mode === 'webview') {
    return <WebViewMode {...props} />;
  } else {
    return <NativeMode variant={props.variant} {...props} />;
  }
};
```

**A/B Testing enabled:**
```typescript
const mode = useFeatureValue('shipping-protection-mode', 'webview');
const variant = useFeatureValue('shipping-protection-variant', 'toggle');

<ShippingProtectionHybrid mode={mode} variant={variant} />
```

---

## Detailed Comparison: WebView vs Pure React Native

### Code Reuse

| Aspect | WebView | Pure React Native |
|--------|---------|-------------------|
| Web SDK | ✅ 100% reuse | ❌ Must port logic |
| UI Components | ✅ Reuse Lit | ❌ Rewrite as RN |
| State Machine | ✅ Reuse | ⚠️ Port logic |
| Business Logic | ✅ Unchanged | ⚠️ Port algorithms |
| Config Service | ✅ Unchanged | ✅ Same fetch |
| **Estimated Reuse** | **90%** | **30-40%** |

### Performance

| Metric | WebView | Pure React Native | Winner |
|--------|---------|-------------------|--------|
| Memory | 10-20MB | 2-5MB | 🏆 Native |
| Initial Load | 200-300ms | 50-100ms | 🏆 Native |
| Render | 50-100ms | 16-32ms | 🏆 Native |
| Message Passing | 5-10ms | 0ms | 🏆 Native |
| Quote Calc | ~2ms | ~2ms | 🤝 Tie |

**Winner: Pure React Native** - 3-5x faster, 4x less memory

### Maintenance & Updates

| Aspect | WebView | Pure React Native |
|--------|---------|-------------------|
| Bug Fixes | ✅ Update CDN (instant) | ❌ App store (2-7 days) |
| New Features | ✅ Deploy CDN (instant) | ❌ App review |
| Rollback | ✅ Change URL (instant) | ❌ Emergency update |
| A/B Testing | ✅ Server-side | ⚠️ Growthbook in app |

**Winner: WebView** - Independent deployment, instant rollback

### Developer Experience

| Aspect | WebView | Pure React Native |
|--------|---------|-------------------|
| Debugging | ⚠️ Chrome/Safari | ✅ RN Debugger |
| Hot Reload | ❌ Refresh (clears state) | ✅ Fast Refresh |
| Type Safety | ⚠️ Bridge only | ✅ End-to-end |
| Testing | ⚠️ Mock messages | ✅ Jest + RTL |

**Winner: Pure React Native** - Better tooling

### Disadvantages of Pure React Native

1. **Code Duplication** 🔴 - Maintain web + mobile separately
2. **No Independent Deployment** 🔴 - App store review required
3. **Longer Development** 🟡 - 5-7 days vs 2 days
4. **Larger Bundle** 🟡 - 80-120KB vs 15KB
5. **Manual Feature Sync** 🔴 - Must keep web/mobile in sync

### Advantages of Pure React Native

1. **Performance** 🟢 - 3-5x faster, 4x less memory
2. **Offline Support** 🟢 - Works without network
3. **Better DX** 🟢 - Fast Refresh, debugging
4. **Platform Integration** 🟢 - Haptics, dark mode

---

## Architecture Decisions

### 1. Shared Business Logic via React Hook

**Decision:** Extract coordinator logic to `useNativeCoordinator` hook instead of duplicating code.

**Alternatives considered:**
- ❌ **Option A:** Duplicate web coordinator in React Native
  - **Rejected:** High maintenance, risk of divergence
- ❌ **Option B:** Call web SDK via WebView from native mode
  - **Rejected:** Defeats purpose of native mode (performance)
- ✅ **Option C (Chosen):** Extract business logic to React hook
  - **Why:** Reuses logic, no duplication, maintains performance

**Implementation:**
```typescript
const { state, quote, error, isSelected, selectProtection, declineProtection } =
  useNativeCoordinator(config, cart, callbacks, debug);
```

### 2. Mode-Based Conditional Rendering

**Decision:** Single component with `mode` prop for conditional rendering.

**Alternatives considered:**
- ❌ **Option A:** Separate components (`ShippingProtectionWebView`, `ShippingProtectionNative`)
  - **Rejected:** Harder to A/B test, duplicate exports
- ❌ **Option B:** Auto-detect mode based on props
  - **Rejected:** Magic behavior, unclear to users
- ✅ **Option C (Chosen):** Explicit `mode` prop
  - **Why:** Clear intent, easy to A/B test, type-safe

### 3. Backward Compatibility

**Decision:** Keep existing `ShippingProtectionWebView` component.

**Alternatives considered:**
- ❌ **Option A:** Breaking change (remove old component)
  - **Rejected:** Forces migration, breaks existing users
- ✅ **Option B (Chosen):** Keep both, deprecate old in v2.0
  - **Why:** Zero breaking changes, gradual migration

### 4. Theme System Design

**Decision:** Mirror web SDK CSS custom properties.

**Alternatives considered:**
- ❌ **Option A:** React Native-specific theme (different from web)
  - **Rejected:** Inconsistent with web, learning curve
- ❌ **Option B:** No theming (hard-coded styles)
  - **Rejected:** Not customizable
- ✅ **Option C (Chosen):** Mirror web CSS custom properties
  - **Why:** Consistent API, familiar to web users

---

## Performance Targets

| Metric | WebView Target | Native Target | Justification |
|--------|----------------|---------------|---------------|
| Initial Load | <100ms | <50ms | Acceptable for checkout widget |
| Quote Calc | <50ms | <50ms | Same algorithm both modes |
| Interaction | <100ms | <50ms | Noticeable but acceptable |
| Memory | <20MB | <5MB | Insignificant for checkout flow |
| FPS | 30-45fps | 60fps | Native should hit 60fps |
| Bundle Impact | 0KB (CDN) | <50KB | Small addition to app |

---

## Success Criteria

### Quantitative
- ✅ 95%+ unit test coverage
- ✅ All performance targets met
- ✅ Bundle size <50KB added for native mode
- ✅ Zero breaking changes (backward compatible)
- ✅ 10+ retailers adopt within 3 months

### Qualitative
- ✅ Clear documentation for mode selection
- ✅ Migration guide published
- ✅ A/B testing examples provided
- ✅ Positive feedback from early adopters
- ✅ No production bugs in first month

---

## Open Questions (Resolved)

### Q1: Default mode?
**Decision:** Default to `'webview'` for backward compatibility.

### Q2: Variant prop in WebView mode?
**Decision:** Optional (can override config's variant).

### Q3: Theme naming?
**Decision:** Mirror web SDK CSS custom properties exactly.

### Q4: Quote calculator location?
**Decision:** Client-side only for Phase 0 (matches web SDK). Edge integration Phase 1.

### Q5: Component library dependency?
**Decision:** Custom components (no external deps, smaller bundle, full control).

### Q6: Export strategy?
**Decision:** Export both components, deprecate old in v2.0.

---

## Next Steps

1. ✅ **Architecture designed** - Hybrid component with mode switcher
2. ⏭️ **Begin implementation** - Follow 12-day timeline
3. ⏭️ **Create hybrid component** - Mode-based conditional rendering
4. ⏭️ **Extract business logic** - `useNativeCoordinator` hook
5. ⏭️ **Build variants** - Toggle, checkbox, dual-button
6. ⏭️ **Write tests** - Unit, integration, E2E
7. ⏭️ **Document** - API docs, migration guide, examples

---

## References

- **Apple App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **React Native WebView:** https://github.com/react-native-webview/react-native-webview
- **PayPal Native SDK:** https://medium.com/paypal-tech/paypal-native-checkout-sdk-for-ios-and-android-5a9853b60a21
- **Afterpay iOS SDK:** https://github.com/afterpay/sdk-ios
- **Epic v. Apple Ruling:** https://www.revenuecat.com/blog/growth/apple-anti-steering-ruling-monetization-strategy/
- **WebView Security:** https://www.acldigital.com/blogs/securing-ios-webviews-best-practices-for-developers
