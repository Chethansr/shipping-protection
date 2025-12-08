
# Narvar Shipping Protection – Mobile (React Native) Integration TRD / Brainstorming Document

## Author
ChatGPT

## Purpose
Evaluate and define architectural options for integrating Narvar Shipping Protection into merchant-owned React Native apps (e.g., Belk, Nike). Includes WebView, React Native component, and JS core approaches.

---

## 1. Problem Statement

Narvar Shipping Protection is currently integrated on desktop/web via a loader script that fetches pricing config, A/B testing config, and initializes the widget. We need a mobile equivalent for merchant-owned React Native apps, where the merchant controls the UI and checkout flow.

Requirements:
- Provide JS Core library
- Provide React Native components
- Provide WebView widget integration
- Minimize merchant engineering overhead
- Maintain Narvar ownership of pricing logic, experiment config, and analytics events where possible

---

## 2. High-Level Architecture Options

### Option A — WebView-Based Widget (Hosted by Narvar)

**Description:**  
Narvar hosts full HTML/JS widget experience. Merchant embeds via React Native WebView.

**Message Bridge:**  
Widget sends structured events using:
```js
window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
```

Merchant handles:
- Adding/removing protection SKU
- Navigation to checkout
- Analytics mapping

**Pros:**
- Fastest iteration / A/B testing
- Narvar fully controls UI & behavior
- Merchant integration minimal

**Cons:**
- Less native UX
- Still requires merchant to handle message events
- Merchant must hide/replace existing checkout button for dual-CTA flow

---

### Option B — React Native Component (Narvar-Supplied)

**Description:**  
Narvar provides `@narvar/react-native-shipping-protection`:
- Native UI (toggle or dual checkout)
- Calls JS core internally for pricing/eligibility
- Emits callbacks for merchant commerce API

**Pros:**
- Best native UX
- Harder for merchant to misuse logic
- Consistent analytics & event schema

**Cons:**
- UI changes require app updates
- Merchants may want deeper customization
- Requires explicit merchant integration

**Dual Checkout:**  
Merchant MUST remove or replace their existing checkout button to use Narvar’s dual-button CTA.

---

### Option C — JS Core Only

**Description:**  
Narvar provides pure logic library:
```ts
computeOffer(cart, config)
```

Merchant builds all UI, events, and checkout integration.

**Pros:**
- Maximum flexibility
- Works in any environment

**Cons:**
- High risk of mis-integration
- Merchant-owned analytics
- No Narvar UI control

---

## 3. Mobile Equivalent of Web Loader Script (Remote Config)

On web, a loader script fetches pricing and A/B config from edge.  
On mobile, use a React hook:

```ts
const { config, loading, error } = useShippingProtectionConfig({ merchantId });
```

Capabilities:
- Fetches remote config from edge
- Caches in AsyncStorage
- Versioned schema for forward compatibility
- Enables A/B testing without app releases

---

## 4. Merchant Integration Requirements

### Why Narvar Cannot “Hook” Into Merchant's Checkout Button Automatically

React Native has:
- No DOM
- No global event listeners
- No element ID selectors

Therefore, merchant MUST explicitly integrate.

---

### Integration Steps — WebView Option

1. Embed WebView:
```tsx
<ShippingProtectionWebView cart={cart} />
```

2. Handle messages:
```tsx
onMessage={(msg) => { /* SKU logic + navigation */ }}
```

3. Merchant hides their existing checkout button if dual CTA is used.

---

### Integration Steps — RN Component Option

1. Add component:
```tsx
<ShippingProtectionWidget
  cart={cart}
  config={config}
  selected={selected}
  onChange={handleSelection}
  onCheckoutWith={handleCheckoutWith}
  onCheckoutWithout={handleCheckoutWithout}
/>
```

2. Merchant integrates SKU logic & navigation.

3. Merchant removes/hides old checkout button for dual CTA.

---

### Integration Steps — JS Core Only

Merchant:
- Uses `computeOffer()`
- Builds UI
- Manages analytics
- Applies SKU changes

Most flexible, highest engineering cost.

---

## 5. Dual Checkout Model

Dual checkout requires:
- Full control of checkout CTA region
- Merchant explicitly replacing their checkout button

### Recommended Helper:
```ts
withShippingProtectionCheckout(handleCheckout)
```

Allows merchant to minimally wrap their existing checkout logic.

---

## 6. Recommended SDK Architecture

### 1. `@narvar/shipping-protection-core`
- Pure logic
- Platform-agnostic

### 2. `@narvar/shipping-protection-config`
- Exposes `useShippingProtectionConfig`
- Handles remote config

### 3. `@narvar/react-native-shipping-protection`
- Widget + CTA
- Theming support
- Uses core + config

### 4. `@narvar/shipping-protection-webview`
- Prebuilt message bridge
- Drop-in integration

---

## 7. Summary Comparison

| Feature | WebView | RN Component | JS Core Only |
|--------|---------|---------------|---------------|
| Native UX | ❌ | ✅ Best | Depends |
| Iteration Speed | ✅ Best | Medium | Slowest |
| Integration Effort | Lowest | Medium | Highest |
| Narvar UI Control | Highest | High | Low |
| A/B Testing | Instant | Via remote config | Merchant-built |
| Checkout Button Ownership | Merchant must adapt | Merchant must adapt | Merchant must adapt |

---

## 8. Recommendations

- Support **both WebView and RN component** paths.  
- JS Core always included underneath both.
- Provide helper:
```ts
withShippingProtectionCheckout(handleCheckout)
```
to reduce merchant integration friction.

---

## 9. Next Steps for Code Agent

**Implement:**
- JS Core package
- Remote config hook
- RN component library
- WebView wrapper with auto-bridge
- Example merchant app for Belk-style integration
