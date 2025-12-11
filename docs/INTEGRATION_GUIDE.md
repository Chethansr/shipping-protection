# Narvar Shipping Protection Integration Guide

Add delivery protection to any e-commerce platform with a simple JavaScript integration.

## Table of Contents

- [Getting Started](#getting-started)
- [High-Level Architecture](#high-level-architecture)
- [Web Integration](#web-integration)
- [Mobile React Native Integration](#mobile-react-native-integration)
- [Quote Verification & Order API](#quote-verification--order-api)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [API Reference](#api-reference)
- [Appendices](#appendices)

---

## Getting Started

Integrate shipping protection in under 5 minutes.

### Minimal Setup

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://edge-compute-f.dp.domain-ship.qa20.narvar.qa/dist/shipping-protection.js"></script>
</head>
<body>
  <narvar-shipping-protection-widget></narvar-shipping-protection-widget>

  <script>
    (async function() {
      // Initialize SDK
      await Narvar.ShippingProtection.init({
        retailerMoniker: 'your-store',
        region: 'US',
        locale: 'en-US',
        variant: 'toggle',
        page: 'cart',
        environment: 'qa'
      });

      // Render protection offer
      Narvar.ShippingProtection.render({
        items: [
          { sku: 'ITEM-001', quantity: 1, price: 49.99 }
        ],
        subtotal: 49.99,
        currency: 'USD'
      });

      // Listen for protection selection
      window.addEventListener('narvar:shipping-protection:action:add-protection', (evt) => {
        const { amount, currency } = evt.detail;
        console.log(`Add protection: ${currency} ${amount / 100}`);
        // Add protection line item to cart
      });
    })();
  </script>
</body>
</html>
```

**What happens:**

- SDK loads asynchronously (60KB gzipped)
- Widget renders in Shadow DOM (CSS isolated)
- Quote calculated instantly (client-side)
- Events fired when customer selects or declines protection

---

## High-Level Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   Shopper's Browser                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Retailer's Website                                   │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  Loader Stub (under 2KB, inline-able)         │    │  │
│  │  │  • Creates Narvar.ShippingProtection API    │    │  │
│  │  │  • Queues calls before bundle loads          │    │  │
│  │  │  • Loads full bundle asynchronously          │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                        ↓                              │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  <narvar-shipping-protection-widget>         │    │  │
│  │  │  • Shadow DOM (CSS isolated)                 │    │  │
│  │  │  • Toggle or checkbox variant                │    │  │
│  │  │  • Themeable via CSS custom properties       │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                        ↕                              │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  JavaScript API                              │    │  │
│  │  │  init() → render() → events                  │    │  │
│  │  │  • Zero-throw guarantee                      │    │  │
│  │  │  • Event-driven (CustomEvents)               │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│              Narvar Edge Compute (Cloudflare/Fastly)        │
│                                                             │
│  POST /v1/quote                                             │
│  • Client-side: Instant calculation (cart page)             │
│  • Server-side: Signed quote with JWS (checkout page)       │
│  • Latency: ~35-40ms typical                                │
│                                                             │
│  GET /v1/config/{retailer-moniker}                          │
│  • Pricing rules, eligibility thresholds                    │
│  • Localized content (Phase 1)                              │
│                                                             │
│  GET /.well-known/jwks.json                                 │
│  • Public keys for JWS signature verification               │
│  • ECDSA P-256 (ES256 algorithm)                            │
└─────────────────────────────────────────────────────────────┘
```

### Integration Flow

#### Cart Page Flow

```
Load loader and init
        ↓
Customer adds item to cart
        ↓
Retailer calls render(cartData)
        ↓
SDK calculates quote (client-side, instant)
        ↓
Widget displays protection offer
        ↓
Customer selects or declines
        ↓
SDK emits add-protection or remove-protection event
        ↓
Retailer updates cart (add/remove line item)
```

#### Checkout Page Flow

```
Customer proceeds to checkout
        ↓
Retailer calls render(cartData) with page: 'checkout'
        ↓
SDK calls edge endpoint for server-side quote
        ↓
Edge server calculates premium + signs with JWS
        ↓
SDK emits quote-available event with signature and eligibility
        ↓
Retailer stores signed quote
        ↓
Customer completes order
        ↓
Retailer backend verifies JWS signature (optional)
        ↓
Retailer submits order to Narvar with signature
```

### Key Architecture Principles

**Shadow DOM Isolation**
- Widget styles cannot be broken by retailer CSS
- Retailer styles do not leak into widget
- CSS custom properties cross boundary for theming
- Event bubbling works for communication

**Event-Driven Communication**
- No tight coupling between widget and retailer code
- Standard browser CustomEvent API
- Multiple listeners supported
- Easy to add/remove integration

**Client-Side vs Server-Side Quotes**
- **Cart page** (`page: 'cart'`): Instant client-side calculation, no signature
- **Checkout page** (`page: 'checkout'`): Server-side with cryptographic signature
- Signature prevents premium manipulation at checkout

**Zero-Throw Guarantee**
- No exceptions escape to parent page
- All errors handled internally
- Failed widget never breaks checkout
- Result types make errors explicit

---

## Web Integration

### Add Loader Stub

Add the loader stub to your page. This creates the API immediately and loads the full bundle asynchronously.

**Inline Script (under 2KB)**

```html
<script>
(function (w, d, url) {
  w.Narvar = w.Narvar || {};
  if (w.Narvar.ShippingProtection && w.Narvar.ShippingProtection._real) return;

  var queue = [];
  var methods = ['init', 'render', 'on', 'off', 'setCustomerIdentity', 'getVersion', 'isReady', 'destroy'];
  var stub = { _queue: queue, _failed: false };

  methods.forEach(function (fn) {
    stub[fn] = function () {
      queue.push([fn, Array.prototype.slice.call(arguments)]);
    };
  });

  w.Narvar.ShippingProtection = stub;

  var s = d.createElement('script');
  s.async = true;
  s.src = url || 'https://cdn.narvar.com/shipping-protection/v1/shipping-protection.js';
  s.onerror = function () {
    stub._failed = true;
    console.error('[Narvar] Failed to load ShippingProtection SDK');
  };
  d.head.appendChild(s);
})(window, document);
</script>
```

### Add Web Component

Place the widget where you want the protection offer to appear:

```html
<narvar-shipping-protection-widget></narvar-shipping-protection-widget>
```

The widget automatically adjusts its height based on content (responsive).

### Initialize SDK

Call `init()` once when your page loads:

```javascript
(async function() {
  const result = await Narvar.ShippingProtection.init({
    retailerMoniker: 'your-store',    // Provided by Narvar
    region: 'US',                     // Shipping destination
    locale: 'en-US',                  // Language/locale
    variant: 'toggle',                // 'toggle' or 'button'
    page: 'cart'                      // 'cart' or 'checkout'
  });

  if (!result.ok) {
    console.error('Init failed:', result.error);
  }
})();
```

**Configuration Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `retailerMoniker` | string | Yes | Your unique store identifier (provided by Narvar) |
| `region` | string | Yes | Shipping destination region (e.g., 'US', 'CA') |
| `locale` | string | Yes | Language and locale (e.g., 'en-US', 'fr-CA') |
| `variant` | 'toggle' or 'checkbox' | Yes | Widget display style |
| `page` | 'cart' or 'checkout' | Yes | Context for quote calculation (client vs server) |
| `configUrl` | string | No | Override config endpoint (auto-derived if omitted) |
| `debug` | boolean | No | Enable debug logging |

**Idempotency:** `init()` can be called multiple times safely. Subsequent calls return the same promise.

**Timeout:** `init()` times out after 10 seconds if config cannot be fetched.

### Render Widget

Call `render()` whenever cart data changes:

```javascript
Narvar.ShippingProtection.render({
  items: [
    { sku: 'SKU-001', quantity: 2, price: 29.99 },
    { sku: 'SKU-002', quantity: 1, price: 149.99 }
  ],
  subtotal: 209.97,
  currency: 'USD',
  fees: 10.00,         // Optional: shipping fees
  discounts: 5.00      // Optional: discounts applied
});
```

**Cart Data Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | array | Yes | Array of cart items |
| `items[].sku` | string | Yes | Product SKU |
| `items[].quantity` | number | Yes | Quantity (positive integer) |
| `items[].price` | number | Yes | Item price in dollars (not cents) |
| `subtotal` | number | Yes | Cart subtotal in dollars |
| `currency` | string | Yes | ISO 4217 currency code (e.g., 'USD') |
| `fees` | number | No | Shipping/handling fees in dollars |
| `discounts` | number | No | Discounts applied in dollars |

**Important:**
- Do NOT await `render()` - it returns `void`
- Results come via events (`quote-available`, `error`)
- `render()` is automatically debounced (100ms) to prevent API spam
- Rapid calls cancel previous pending renders

### Handle Events

Subscribe to events to respond to widget state changes:

```javascript
// SDK Ready (after successful init)
window.Narvar.ShippingProtection.on('narvar:shipping-protection:state:ready', (evt) => {
  console.log('SDK ready, safe to render');
});

// Quote Available (informational - widget handles display)
window.Narvar.ShippingProtection.on('narvar:shipping-protection:state:quote-available', (evt) => {
  const { quote } = evt.detail;
  console.log('Quote:', quote.amount / 100, quote.currency);
  // Phase 0: quote.source is 'client', no signature
  // Phase 1: quote.source can be 'server' with signature on checkout
});

// Protection Selected (ACTION REQUIRED)
window.Narvar.ShippingProtection.on('narvar:shipping-protection:action:add-protection', (evt) => {
  const { amount, currency } = evt.detail;

  // Add protection as line item to cart
  addToCart({
    sku: 'NARVAR-PROTECTION',
    name: 'Shipping Protection',
    price: amount / 100,  // Convert cents to dollars
    quantity: 1
  });
});

// Protection Declined (ACTION REQUIRED)
window.Narvar.ShippingProtection.on('narvar:shipping-protection:action:remove-protection', (evt) => {
  // Remove protection from cart
  removeFromCart('NARVAR-PROTECTION');
});

// Error (RECOMMENDED)
window.Narvar.ShippingProtection.on('narvar:shipping-protection:state:error', (evt) => {
  const { error } = evt.detail;
  console.error('Widget error:', error.message);
  // Widget errors are non-fatal - shopping can continue
});
```

**Event Reference:**

| Event | When | Payload | Action Required |
|-------|------|---------|-----------------|
| `state:ready` | After `init()` succeeds | `{}` | None (informational) |
| `state:quote-available` | After `render()` processes | `{ quote: { amount, currency, ... } }` | None (widget displays) |
| `action:add-protection` | Customer selects protection | `{ amount, currency }` | **Yes** - Add line item |
| `action:remove-protection` | Customer declines | `{}` | **Yes** - Remove line item |
| `state:error` | Any error occurs | `{ error: { message, code } }` | Optional - Log/monitor |

### CSS Customization

The widget supports theming via CSS custom properties. Set these on `:root` or a parent element:

```css
:root {
  /* Colors */
  --narvar-shipping-protection-bg: #ffffff;
  --narvar-shipping-protection-border-color: #e0e0e0;
  --narvar-shipping-protection-text: #333333;
  --narvar-shipping-protection-accent: #007bff;

  /* Typography */
  --narvar-shipping-protection-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --narvar-shipping-protection-font-size: 14px;

  /* Spacing */
  --narvar-shipping-protection-padding: 16px;
  --narvar-shipping-protection-margin: 0;

  /* Borders */
  --narvar-shipping-protection-border-radius: 8px;
  --narvar-shipping-protection-border-width: 1px;

  /* Effects */
  --narvar-shipping-protection-box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  --narvar-shipping-protection-transition: all 0.2s ease;
}
```

**Shadow DOM Protection:** Retailer CSS cannot accidentally break widget styling. Only CSS custom properties cross the Shadow DOM boundary.

### Cart vs Checkout Pages

**Cart Page Pattern:**

```javascript
(async function() {
  // Client-side quote calculation (instant)
  await Narvar.ShippingProtection.init({
  variant: 'button',
  page: 'cart',  // Client-side
  retailerMoniker: 'your-store',
  region: 'US',
  locale: 'en-US'
});

  Narvar.ShippingProtection.render(cartData);

  // Quote available immediately (no signature)
  window.Narvar.ShippingProtection.on('narvar:shipping-protection:state:quote-available', (evt) => {
    console.log('Client quote:', evt.detail.quote.amount);
  });
})();
```

**Checkout Page Pattern:**

```javascript
(async function() {
  let signedQuote = null;

  // Server-side quote with JWS signature
  await Narvar.ShippingProtection.init({
  variant: 'toggle',
  page: 'checkout',  // Server-side with signature
  retailerMoniker: 'your-store',
  region: 'US',
  locale: 'en-US'
});

Narvar.ShippingProtection.render(cartData);

// Quote available with signature (~35-40ms)
  window.Narvar.ShippingProtection.on('narvar:shipping-protection:state:quote-available', (evt) => {
    const { quote } = evt.detail;

    // Phase 0: No signature yet (client-side only)
    // Phase 1: quote.signature contains JWS for backend verification
    if (quote.signature) {
      signedQuote = quote;
      console.log('Signed quote ready for order submission');
    }
  });

  // On order submission
  async function submitOrder() {
    const orderData = {
      cart: cartData,
      customer: customerData,
      attributes: {
        narvar_shipping_protection_quote: signedQuote?.signature,
        narvar_shipping_protection_premium: signedQuote?.amount
      }
    };

    // Your backend verifies signature before accepting order
    await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }
})();
```
** Signature verification is done on Merchant's backend. Refer to [Quote Verification & Order API](#quote-verification--order-api)

### Mobile Web Considerations

The widget is fully responsive and works on mobile web browsers:

- Touch-friendly controls (minimum 44px height)
- Adapts to viewport width
- Shadow DOM works on all modern mobile browsers
- Bundle size optimized for 2G/3G networks (~60KB gzipped)

No additional configuration needed for mobile web.

---

## Mobile React Native Integration

Use the WebView wrapper for fast integration with zero changes to the web SDK.

### Installation

```bash
npm install @narvar/shipping-protection-webview-rn react-native-webview
```

### Basic Integration

```typescript
import { ShippingProtectionWebView } from '@narvar/shipping-protection-webview-rn';
import { useState, useMemo } from 'react';
import { View, Text, Button } from 'react-native';

function CartScreen() {
  const [protectionAmount, setProtectionAmount] = useState(0);
  const [protectionSelected, setProtectionSelected] = useState(false);

  // IMPORTANT: Memoize config and cart to prevent infinite re-renders
  const config = useMemo(() => ({
    variant: 'toggle',
    page: 'cart',
    retailerMoniker: 'your-store',
    region: 'US',
    locale: 'en-US'
  }), []);

  const cart = useMemo(() => ({
    items: [
      { sku: 'ITEM-001', quantity: 1, price: 49.99 }
    ],
    subtotal: 49.99,
    currency: 'USD'
  }), []);

  return (
    <View>
      <Text>Your Cart</Text>

      {/* Shipping Protection Widget */}
      <ShippingProtectionWebView
        config={config}
        cart={cart}
        onProtectionAdd={(amount, currency) => {
          setProtectionAmount(amount / 100);
          setProtectionSelected(true);
          // Add protection SKU to cart
        }}
        onProtectionRemove={() => {
          setProtectionAmount(0);
          setProtectionSelected(false);
          // Remove protection SKU from cart
        }}
        onError={(error) => {
          console.error('Widget error:', error);
        }}
      />

      <Text>Total: ${(49.99 + protectionAmount).toFixed(2)}</Text>
      <Button title="Checkout" onPress={() => {/* Navigate to checkout */}} />
    </View>
  );
}
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | ShippingProtectionConfig | Yes | SDK configuration (same as web `init()`) |
| `cart` | CartData | Yes | Current cart data (same as web `render()`) |
| `onReady` | (version: string) => void | No | Called when widget initializes |
| `onQuoteAvailable` | (quote: Quote) => void | No | Called when quote is calculated |
| `onProtectionAdd` | (amount: number, currency: string) => void | No | Called when protection selected |
| `onProtectionRemove` | () => void | No | Called when protection removed |
| `onError` | (error: Error) => void | No | Called on any error |
| `customerIdentity` | { customerId?: string; emailId?: string } | No | Customer identity for analytics |
| `widgetUrl` | string | No | Custom widget URL (defaults to Narvar CDN) |
| `style` | ViewStyle | No | Custom container styles |
| `debug` | boolean | No | Enable debug logging |

### Checkout Page with Signed Quote

```typescript
function CheckoutScreen() {
  const [signedQuote, setSignedQuote] = useState(null);

  const config = useMemo(() => ({
    variant: 'checkbox',
    page: 'checkout',  // Server-side quote with signature
    retailerMoniker: 'your-store',
    region: 'US',
    locale: 'en-US'
  }), []);

  return (
    <View>
      <ShippingProtectionWebView
        config={config}
        cart={cartData}
        onQuoteAvailable={(quote) => {
          // Store signed quote for backend verification
          if (quote.source === 'server' && quote.signature) {
            setSignedQuote(quote);
          }
        }}
        onProtectionAdd={(amount, currency) => {
          console.log('Protection selected');
        }}
      />

      <Button
        title="Place Order"
        disabled={!signedQuote}
        onPress={async () => {
          // Submit order with signed quote
          await submitOrder({
            cart: cartData,
            protectionQuote: signedQuote  // Backend verifies signature
          });
        }}
      />
    </View>
  );
}
```

### Troubleshooting Mobile

**Widget Not Showing:**
```typescript
<WebView
  javaScriptEnabled={true}
  domStorageEnabled={true}
  originWhitelist={['*']}
/>
```

**Messages Not Received:**
- Enable `debug={true}` prop
- Check that config and cart props are memoized with `useMemo()`
- Verify callback functions don't change reference on every render

**WebView Not Auto-Resizing:**
The widget sends `height-change` messages automatically. Ensure WebView container allows height changes.

---

## Quote Verification & Order API

Secure order submission using cryptographic signatures to prevent premium manipulation.

### Understanding JWS Signatures

**What:** JSON Web Signature (JWS) using ECDSA with P-256 curve (ES256)

**Why:** Proves Narvar calculated and authorized the premium - prevents client-side manipulation

**When:** Required on checkout page (`page: 'checkout'`) for order submission

**Flow:**

- Client sends cart to Narvar edge endpoint
- Edge calculates premium and signs with private key
- Signature returned in quote-available event
- Client submits order with signature to merchant backend
- Merchant backend verifies signature using Narvar public keys
- Merchant accepts order only if signature valid
- Merchant includes signature in order sent to Narvar

### Step-by-Step Verification Process

#### Extract Key ID from JWS Header

JWS format: `header.payload.signature` (three Base64-encoded parts separated by dots)

```bash
# Decode header to get key ID (kid)
echo "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVJN2Y5TThrOUZmc2FaRU1tbFVrcERSQy1Lc2V2ZDloVDBIOXV6WGxGRXMifQ" \
  | base64 -d | jq .

# Output:
# {
#   "alg": "ES256",
#   "typ": "JWT",
#   "kid": "5I7f9M8k9FfsaZEMmlUkpDRC-Ksevd9hT0H9uzXlFEs"
# }
```

The `kid` (key ID) tells you which public key to use for verification.

#### Fetch Public Keys (JWKS)

```bash
curl -s https://edge-compute-f.dp.domain-ship.qa20.narvar.qa/.well-known/jwks.json | jq .

# Returns:
# {
#   "keys": [
#     {
#       "kty": "EC",
#       "crv": "P-256",
#       "x": "mJNS6ODdsN0LmTyX26sxnz_1z4PXx2v9sClDlxbCVT4",
#       "y": "8Lcrlh9n60DSVbMl6IB5yP8irD7jxOhvDSf_yfP2ff0",
#       "use": "sig",
#       "alg": "ES256",
#       "kid": "piK46w798KJCOss2Z3jsy17rlwyIz6X6SO8sB9XWov0"
#     },
#     {
#       "kty": "EC",
#       "crv": "P-256",
#       "x": "tWk1GKzpNU1S-mmq44u41xUywD6com-RlzRe6PicA5E",
#       "y": "pIC985uRWFQYpw9D6dx5lA5tmRwP7sdSmPAQ-aVL8_k",
#       "use": "sig",
#       "alg": "ES256",
#       "kid": "5I7f9M8k9FfsaZEMmlUkpDRC-Ksevd9hT0H9uzXlFEs"
#     }
#   ]
# }
```

Cache JWKS response for performance (refresh periodically for key rotation).

#### Select Matching Public Key

Find the key where `kid` matches the value from the header:

```json
{
  "kty": "EC",
  "crv": "P-256",
  "x": "tWk1GKzpNU1S-mmq44u41xUywD6com-RlzRe6PicA5E",
  "y": "pIC985uRWFQYpw9D6dx5lA5tmRwP7sdSmPAQ-aVL8_k",
  "use": "sig",
  "alg": "ES256",
  "kid": "5I7f9M8k9FfsaZEMmlUkpDRC-Ksevd9hT0H9uzXlFEs"
}
```

#### Verify Signature

Use standard JWT library with the selected public key:

**Node.js Example:**

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

async function verifyQuoteSignature(jws, retailerMoniker) {
  const client = jwksClient({
    jwksUri: `https://edge-compute-f.${retailerMoniker}.domain-ship.qa20.narvar.qa/.well-known/jwks.json`,
    cache: true,
    cacheMaxAge: 600000  // 10 minutes
  });

  // Decode header to get kid
  const decodedHeader = jwt.decode(jws, { complete: true })?.header;
  if (!decodedHeader || !decodedHeader.kid) {
    throw new Error('Invalid JWS: missing kid');
  }

  // Get public key for kid
  const key = await client.getSigningKey(decodedHeader.kid);
  const publicKey = key.getPublicKey();

  // Verify signature
  const decoded = jwt.verify(jws, publicKey, {
    algorithms: ['ES256'],
    issuer: 'delivery-protection-edge',
    clockTolerance: 60  // 1 minute tolerance
  });

  return decoded;
}

// Usage in order processing
app.post('/api/orders', async (req, res) => {
  const { cart, attributes } = req.body;
  const jws = attributes.narvar_shipping_protection_quote;

  if (jws) {
    try {
      const verified = await verifyQuoteSignature(jws, 'your-store');

      // Validate claims
      if (verified.quote.premium_value !== attributes.narvar_shipping_protection_premium) {
        return res.status(400).json({ error: 'Premium mismatch' });
      }

      if (!verified.eligible) {
        return res.status(400).json({ error: 'Quote not eligible' });
      }

      // Signature valid - proceed with order
      // Include JWS in order sent to Narvar
      await submitToNarvar({ cart, protectionQuote: jws });

    } catch (error) {
      console.error('Quote verification failed:', error);
      return res.status(400).json({ error: 'Invalid protection quote' });
    }
  }

  // Process order...
});
```

**Python Example:**

```python
import jwt
import requests

def verify_quote_signature(jws, retailer_moniker):
    # Fetch JWKS
    jwks_uri = f'https://edge-compute-f.{retailer_moniker}.domain-ship.qa20.narvar.qa/.well-known/jwks.json'
    jwks = requests.get(jwks_uri).json()

    # Decode header to get kid
    header = jwt.get_unverified_header(jws)
    kid = header.get('kid')

    if not kid:
        raise ValueError('Invalid JWS: missing kid')

    # Find matching key
    key = next((k for k in jwks['keys'] if k['kid'] == kid), None)
    if not key:
        raise ValueError(f'Public key not found for kid: {kid}')

    # Convert JWKS key to PEM format (using jwcrypto or similar)
    from jwcrypto import jwk
    public_key = jwk.JWK(**key)
    pem = public_key.export_to_pem()

    # Verify signature
    decoded = jwt.decode(
        jws,
        pem,
        algorithms=['ES256'],
        issuer='delivery-protection-edge',
        options={'verify_exp': True}
    )

    return decoded

# Usage in order API
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    jws = data.get('attributes', {}).get('narvar_shipping_protection_quote')

    if jws:
        try:
            verified = verify_quote_signature(jws, 'your-store')

            # Validate claims
            if verified['quote']['premium_value'] != data['attributes']['narvar_shipping_protection_premium']:
                return {'error': 'Premium mismatch'}, 400

            if not verified.get('eligible'):
                return {'error': 'Quote not eligible'}, 400

            # Signature valid - proceed

        except Exception as e:
            logger.error(f'Quote verification failed: {e}')
            return {'error': 'Invalid protection quote'}, 400

    # Process order...
```

#### Validate Claims

After verifying signature, validate the payload claims:

```json
{
  "iat": 1765302649,
  "exp": 1765561849,
  "iss": "delivery-protection-edge",
  "sub": "quote",
  "eligible": true,
  "quote": {
    "order_items": [
      {
        "eligible": true,
        "insured_value": 10850,
        "sku": "SKU-001"
      }
    ],
    "premium_value": 218,
    "rules_version": 30,
    "total_insured_value": 4435,
    "total_not_insured_value": 0,
    "valid_until": "2025-12-30T17:50:49Z"
  }
}
```

**Field Descriptions:**
- `iat` - Issued at (Unix timestamp)
- `exp` - Expiration (Unix timestamp)
- `eligible` - Eligibility status
- `insured_value` - Item value in cents
- `premium_value` - Premium amount in cents
- `valid_until` - Quote expiration (ISO 8601)

**Validation Checklist:**
- [ ] `exp` (expiration) is in the future
- [ ] `iat` (issued at) is reasonable (not too old, not in future)
- [ ] `iss` (issuer) is "delivery-protection-edge"
- [ ] `eligible` is true (or understand ineligible reason)
- [ ] `premium_value` matches order total
- [ ] `valid_until` is in the future

### Order API Submission

Include the signed quote in order attributes sent to your backend and Narvar:

```json
POST /api/orders
{
  "cart": {
    "items": [...],
    "subtotal": 49.99,
    "currency": "USD"
  },
  "customer": {
    "id": "customer-123",
    "email": "user@example.com"
  },
  "attributes": {
    "quote_signature": "eyJhbGci...",  // Full JWS
  }
}
```

Your backend must:

- Verify JWS signature (see verification process above)
- Validate claims (see validation section above)
- Accept order if verification succeeds
- Include JWS in order data sent to Narvar

### Server-Side Quote Request (Optional)

You can also request quotes directly from your backend:

```bash
curl -X POST 'https://edge-compute-f.dp.domain-ship.qa20.narvar.qa/v1/quote' \
  -H 'Content-Type: application/json' \
  -d '{
    "currency": "USD",
    "discount": 7500,
    "locale": "en-US",
    "order_items": [
      {
        "line_price": 10000,
        "quantity": 2,
        "sku": "SKU-001",
        "total_tax": 850
      }
    ],
    "ship_to": "US",
    "shipping_fee": 1000,
    "shipping_fee_tax": 85,
    "retailer_moniker": "dp"
  }'

# Response:
# {
#   "eligible": "eligible",
#   "quote": {
#     "premium_value": 218
#   },
#   "signature": {
#     "jws": "eyJhbGci...",
#     "created_at": 1765302649,
#     "expires_at": 1765561849
#   }
# }
```

---

## Troubleshooting & FAQ

### Common Issues

**Q: Widget doesn't appear**

A: Check browser console for errors. Verify `init()` succeeded by listening for `state:ready` event:

```javascript
(async function() {
  window.Narvar.ShippingProtection.on('narvar:shipping-protection:state:ready', () => {
    console.log('SDK ready');
  });

  const result = await Narvar.ShippingProtection.init(config);
  if (!result.ok) {
    console.error('Init failed:', result.error.message);
  }
})();
```

**Q: Quote calculation is slow**

A: Check network tab:
- **Cart page:** Should be instant (under 50ms) - client-side calculation
- **Checkout page:** ~35-40ms typical for server-side signed quote
- If slower, may be network latency or edge endpoint issue

**Q: Events not firing**

A: Ensure listeners are added before calling `render()`:

```javascript
// ✅ GOOD - Add listener first
window.Narvar.ShippingProtection.on('narvar:shipping-protection:state:quote-available', handler);
Narvar.ShippingProtection.render(cartData);

// ❌ BAD - Listener added after render
Narvar.ShippingProtection.render(cartData);
window.Narvar.ShippingProtection.on('narvar:shipping-protection:state:quote-available', handler);
```

**Q: Protection amount doesn't match estimate**

A: Ensure cart subtotal includes all items and fees. Premium is calculated based on total insured value. Verify `fees` and `discounts` are included in cart data.

**Q: Signature verification failing**

A: Check:
- Expiration: Quotes expire after 24 hours
- Public key: Ensure you're using the correct key for the `kid`
- Algorithm: Must use ES256 (ECDSA P-256)
- Issuer: Must be "delivery-protection-edge"
- Environment: QA quotes work only with QA public keys

**Q: Widget not working on mobile**

A: Verify:
- Shadow DOM is supported (iOS Safari 10+, Android Chrome 53+)
- JavaScript enabled
- No aggressive CSP blocking CustomEvents
- Widget container has sufficient width (minimum 280px)

### Debug Mode

Enable detailed logging:

```javascript
(async function() {
  const result = await Narvar.ShippingProtection.init({
    ...config,
    debug: true
  });

  // Watch browser console for:
  // - State transitions
  // - Event emissions
  // - Quote calculations
  // - Error details
})();
```

### Error Messages

| Error Code | Message | Cause | Solution |
|------------|---------|-------|----------|
| `CONFIG_ERROR` | "Invalid SDK config" | Invalid `init()` parameters | Check configuration schema, verify all required fields |
| `CONFIG_ERROR` | "SDK not ready" | `render()` called before `init()` | Wait for `state:ready` event before calling `render()` |
| `CONFIG_ERROR` | "Invalid cart data" | Malformed cart data | Validate cart data against schema, check field types |
| `NETWORK_ERROR` | "Failed to fetch config" | Config endpoint unreachable | Check network, verify configUrl, check CORS |
| `RENDER_ERROR` | "Quote calculation failed" | Invalid pricing rules | Contact Narvar support, check retailer configuration |
| `UNKNOWN_ERROR` | Various | Unexpected errors | Enable debug mode, check console, report to Narvar |

### Performance Troubleshooting

**Slow page load:**
- Use async loader stub (doesn't block page rendering)
- Widget loads in background, no impact on critical path
- Bundle is cached after first load

**High memory usage:**
- Widget uses ~2-5MB typically
- Shadow DOM is lightweight
- No memory leaks in Phase 0 MVP

**Excessive network requests:**
- `render()` is auto-debounced (100ms)
- Config fetched once per session (cached)
- Server quotes only on checkout page

---

## API Reference

### Public Methods

#### `init(config)`

Initialize SDK with configuration. Idempotent - subsequent calls return the same promise.

```typescript
async init(config: ShippingProtectionConfig): Promise<Result<void, Error>>
```

**Parameters:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `retailerMoniker` | string | Yes | - | Your unique store identifier |
| `region` | string | Yes | - | Shipping destination (e.g., 'US', 'CA') |
| `locale` | string | Yes | - | Language/locale (e.g., 'en-US', 'fr-CA') |
| `variant` | 'toggle' or 'checkbox' | Yes | - | Widget display style |
| `page` | 'cart' or 'checkout' | Yes | - | Context (determines quote calculation method) |
| `environment` | 'qa' or 'st' or 'prod' | No | 'qa' | Environment |
| `configUrl` | string | No | (auto) | Override config endpoint URL |
| `debug` | boolean | No | false | Enable debug logging |

**Returns:** `Promise<Result<void, Error>>`
- `ok: true` - Initialization succeeded
- `ok: false, error: Error` - Initialization failed

**Timeout:** 10 seconds

**Example:**

```javascript
(async function() {
  const result = await Narvar.ShippingProtection.init({
    retailerMoniker: 'your-store',
    region: 'US',
    locale: 'en-US',
    variant: 'toggle',
    page: 'cart',
    environment: 'qa'
  });

  if (result.ok) {
    console.log('Init succeeded');
  } else {
    console.error('Init failed:', result.error);
  }
})();
```

---

#### `render(cartData)`

Render protection offer for given cart. Debounced (100ms) - rapid calls cancel previous pending renders.

```typescript
render(cartData: CartData): void
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | CartItem[] | Yes | Array of cart items |
| `items[].sku` | string | Yes | Product SKU |
| `items[].quantity` | number | Yes | Quantity (positive integer) |
| `items[].price` | number | Yes | Item price in dollars |
| `subtotal` | number | Yes | Cart subtotal in dollars |
| `currency` | string | Yes | ISO 4217 code (e.g., 'USD') |
| `fees` | number | No | Shipping/handling fees in dollars |
| `discounts` | number | No | Discounts applied in dollars |

**Returns:** `void` (results via events)

**Events:** `quote-available`, `error`

**Example:**

```javascript
Narvar.ShippingProtection.render({
  items: [
    { sku: 'SKU-001', quantity: 2, price: 29.99 }
  ],
  subtotal: 59.98,
  currency: 'USD',
  fees: 5.00,
  discounts: 10.00
});
```

---

#### `on(event, listener)`

Subscribe to SDK events. Returns unsubscribe function.

```typescript
on(event: string, listener: (evt: CustomEvent) => void): () => void
```

**Parameters:**
- `event` - Event name (see Events table)
- `listener` - Callback function

**Returns:** Unsubscribe function

**Example:**

```javascript
const unsubscribe = window.Narvar.ShippingProtection.on(
  'narvar:shipping-protection:action:add-protection',
  (evt) => {
    console.log('Protection added:', evt.detail);
  }
);

// Later, unsubscribe
unsubscribe();
```

---

#### `off(event, listener)`

Unsubscribe from SDK events.

```typescript
off(event: string, listener: (evt: CustomEvent) => void): void
```

**Example:**

```javascript
function handler(evt) {
  console.log(evt.detail);
}

window.Narvar.ShippingProtection.on('narvar:shipping-protection:state:ready', handler);
Narvar.ShippingProtection.off('narvar:shipping-protection:state:ready', handler);
```

---

#### `setCustomerIdentity(identity)`

Set customer identity for analytics tracking. Phase 0: Placeholder.

```typescript
setCustomerIdentity(identity: { customerId?: string; emailId?: string }): void
```

**Example:**

```javascript
Narvar.ShippingProtection.setCustomerIdentity({
  customerId: 'customer-123',
  emailId: 'user@example.com'
});
```

---

#### `getVersion()`

Get SDK version.

```typescript
getVersion(): string
```

**Returns:** Semver version string (e.g., "0.0.1")

---

#### `isReady()`

Check if SDK is initialized and ready to render.

```typescript
isReady(): boolean
```

**Returns:** `true` if ready, `false` otherwise

---

#### `destroy()`

Clean up SDK, remove listeners, cancel in-flight requests.

```typescript
destroy(): void
```

**Example:**

```javascript
// On page unload or SPA route change
Narvar.ShippingProtection.destroy();
```

---

### Events

| Event Name | When | Payload | Description |
|------------|------|---------|-------------|
| `narvar:shipping-protection:state:ready` | After `init()` succeeds | `{}` | SDK initialized, safe to call `render()` |
| `narvar:shipping-protection:state:quote-available` | After `render()` calculates quote | `{ quote: Quote }` | Quote calculated (widget displays automatically) |
| `narvar:shipping-protection:action:add-protection` | Customer selects protection | `{ amount: number, currency: string }` | Add protection line item to cart |
| `narvar:shipping-protection:action:remove-protection` | Customer declines protection | `{}` | Remove protection line item from cart |
| `narvar:shipping-protection:state:error` | Any error occurs | `{ error: Error }` | Error occurred (non-fatal) |

**Quote Payload:**

```typescript
{
  amount: number,        // Premium in cents
  currency: string,      // ISO 4217 code
  source: 'client' | 'server',
  eligible?: boolean,    // Phase 1: Eligibility status
  signature?: string     // Phase 1: JWS signature (checkout only)
}
```

---

### Environment Endpoints

| Environment | Base URL |
|-------------|----------|
| QA | `https://edge-compute-f.{retailer}.domain-ship.qa20.narvar.qa` |
| Staging | `https://edge-compute-f.{retailer}.domain-ship.st.narvar.com` |
| Production | `https://edge-compute-f.{retailer}.domain-ship.narvar.com` |

**Endpoints:**
- `GET /v1/config/{retailer-moniker}` - Fetch retailer configuration
- `POST /v1/quote` - Calculate signed quote
- `GET /.well-known/jwks.json` - Fetch public keys for signature verification

---

## Appendices

### Rate Limits & Performance

**Automatic Rate Limiting:**
- `render()` debounced: Max 1 call per 100ms (prevents API spam)
- Config cached: Fetched once per session
- JWKS cached: Recommended 10-minute cache

**Performance Targets:**
- Bundle size: ~60KB gzipped
- Loader stub: under 2KB
- Quote (cart): under 50ms
- Quote (checkout): under 100ms (including network)
- Memory: 2-5MB typical

**Capacity:**
- Retail-level: ~12.79 TPS average (34M requests/month)
- Edge latency: ~35-40ms p50, ~8ms CPU time
- SLA: 99.99% uptime

### Deployment & Versioning

**CDN Versioning Strategy:**

- **Tier 1 - Rolling updates:** `/v1/` - Latest v1.x.x (backward-compatible)
- **Tier 2 - Conservative:** `/v1.5/` - Latest v1.5.x (bug fixes only)
- **Tier 3 - Frozen:** `/v1.5.4/` - Specific version (never updates)

**Recommendation:** Use `/v1/` for automatic bug fixes and improvements. Use pinned version for strict change control.

**Example:**

```html
<!-- Rolling updates -->
<script src="https://edge-compute-f.dp.domain-ship.qa20.narvar.qa/v1/shipping-protection.js"></script>

<!-- Frozen version -->
<script src="https://edge-compute-f.dp.domain-ship.qa20.narvar.qa/v1.5.4/shipping-protection.js"></script>
```

### Webhooks for Claim Status

Coming soon. Future webhooks will notify of:
- Claim filed
- Claim approved
- Claim rejected
- Claim paid

### Browser Support

**Minimum Requirements:**
- Shadow DOM support
- CustomEvent API
- ES2019 features
- localStorage/sessionStorage

**Supported Browsers:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: 10+ (iOS and desktop)
- Samsung Internet: Last 2 versions
