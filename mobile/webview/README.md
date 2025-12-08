# @narvar/shipping-protection-webview-rn

React Native WebView wrapper for Narvar Shipping Protection. Enables quick integration with **zero changes** to the existing web SDK.

## Installation

```bash
npm install @narvar/shipping-protection-webview-rn react-native-webview
```

## Quick Start

```typescript
import { ShippingProtectionWebView } from '@narvar/shipping-protection-webview-rn';

function CartScreen() {
  const [cart, setCart] = useState({
    items: [
      { sku: 'ITEM-001', quantity: 1, price: 49.99 }
    ],
    subtotal: 49.99,
    currency: 'USD'
  });

  return (
    <ShippingProtectionWebView
      config={{
        variant: 'toggle',
        page: 'cart',
        retailerMoniker: 'your-store',
        region: 'US',
        locale: 'en-US',
        environment: 'prod'
      }}
      cart={cart}
      onProtectionAdd={(amount, currency) => {
        // Add protection to cart
        console.log(`Protection added: ${currency}${amount}`);
      }}
      onProtectionRemove={() => {
        // Remove protection from cart
        console.log('Protection removed');
      }}
      onError={(error) => {
        console.error('Widget error:', error);
      }}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `ShippingProtectionConfig` | Yes | SDK configuration |
| `cart` | `CartData` | Yes | Current cart data |
| `onReady` | `(version: string) => void` | No | Called when widget initializes |
| `onQuoteAvailable` | `(quote: Quote) => void` | No | Called when quote is calculated |
| `onProtectionAdd` | `(amount: number, currency: string) => void` | No | Called when protection is selected |
| `onProtectionRemove` | `() => void` | No | Called when protection is removed |
| `onError` | `(error: SerializedError) => void` | No | Called on any error |
| `customerIdentity` | `{ customerId?: string; emailId?: string }` | No | Customer identity for analytics |
| `widgetUrl` | `string` | No | Custom widget URL (default: Narvar CDN) |
| `style` | `ViewStyle` | No | Custom container styles |
| `debug` | `boolean` | No | Enable debug logging |

## Config

```typescript
{
  variant: 'toggle' | 'checkbox',  // Widget style
  page: 'cart' | 'checkout',       // Context for quote calculation
  retailerMoniker: string,          // Your store identifier
  region: string,                   // e.g., 'US', 'CA'
  locale: string,                   // e.g., 'en-US', 'fr-CA'
  environment?: 'prod' | 'qa' | 'dev'
}
```

## Cart Data

```typescript
{
  items: [
    {
      sku: string,
      quantity: number,
      price: number,        // In dollars
      total_tax?: number,
      categories?: string[]
    }
  ],
  subtotal: number,         // In dollars
  currency: string,         // ISO 4217 (e.g., 'USD')
  fees?: number,           // Shipping fees
  discounts?: number       // Discounts applied
}
```

## Integration Pattern

### 1. Cart Page (Client-Side Quote)

```typescript
function CartScreen() {
  const [protectionAmount, setProtectionAmount] = useState(0);
  const [protectionSelected, setProtectionSelected] = useState(false);

  return (
    <View>
      {/* Cart items */}
      <FlatList data={cartItems} renderItem={...} />

      {/* Shipping Protection Widget */}
      <ShippingProtectionWebView
        config={{
          variant: 'toggle',
          page: 'cart',
          retailerMoniker: 'your-store',
          region: 'US',
          locale: 'en-US'
        }}
        cart={cartData}
        onProtectionAdd={(amount, currency) => {
          setProtectionAmount(amount);
          setProtectionSelected(true);
          // Add protection SKU to cart
        }}
        onProtectionRemove={() => {
          setProtectionAmount(0);
          setProtectionSelected(false);
          // Remove protection SKU from cart
        }}
      />

      {/* Cart total */}
      <Text>Total: ${subtotal + (protectionSelected ? protectionAmount : 0)}</Text>

      <Button title="Checkout" onPress={() => navigation.navigate('Checkout')} />
    </View>
  );
}
```

### 2. Checkout Page (Server-Side Quote with Signature)

```typescript
function CheckoutScreen() {
  const [signedQuote, setSignedQuote] = useState(null);

  return (
    <View>
      <ShippingProtectionWebView
        config={{
          variant: 'checkbox',
          page: 'checkout',  // Server-side quote with signature
          retailerMoniker: 'your-store',
          region: 'US',
          locale: 'en-US'
        }}
        cart={cartData}
        onQuoteAvailable={(quote) => {
          // Store signed quote for backend verification
          if (quote.source === 'server' && quote.signature) {
            setSignedQuote(quote);
          }
        }}
        onProtectionAdd={(amount, currency) => {
          // Enable checkout with protection
        }}
      />

      <Button
        title="Place Order"
        onPress={async () => {
          // Submit order with signed quote
          await submitOrder({
            cart: cartData,
            protectionQuote: signedQuote  // Backend verifies signature
          });
        }}
        disabled={!signedQuote}
      />
    </View>
  );
}
```

## Performance

| Metric | Target | Notes |
|--------|--------|-------|
| Initial Load | <500ms | WebView + SDK download |
| Widget Ready | <200ms | SDK initialization |
| Quote Calculation | <50ms | Client-side (cart page) |
| Quote Calculation | <100ms | Server-side (checkout page) |
| Message Bridge | <5ms | postMessage latency |
| Memory Usage | <20MB | WebView process |

## Development Setup

### Prerequisites
- Node.js 18+
- iOS Simulator (Xcode) or Android Emulator
- React Native development environment

### Build Process

**1. Build Web SDK**
```bash
# From project root
npm run build
```

This builds the SDK to `dist/` and automatically copies it to `public/dist/` for local development.

**2. Start Development Servers**

Terminal 1 - Vite (serves widget HTML and SDK):
```bash
npx vite --host
# Serves at http://YOUR_LOCAL_IP:5173
```

Terminal 2 - Metro Bundler (React Native):
```bash
cd packages/shipping-protection-webview-rn/test-apps/webview-test
npx expo start
```

Terminal 3 - iOS Simulator:
```bash
cd packages/shipping-protection-webview-rn/test-apps/webview-test
npx expo run:ios
```

### Local Testing Configuration

Update `TestScreen.tsx` with your local machine's IP address:
```tsx
<ShippingProtectionWebView
  config={{
    ...
    configUrl: "http://YOUR_LOCAL_IP:5173/mock-config.json"
  }}
  widgetUrl="http://YOUR_LOCAL_IP:5173/widget-webview.html"
/>
```

**Finding Your Local IP:**
- macOS: `ipconfig getifaddr en0`
- Linux: `hostname -I | cut -d' ' -f1`
- Windows: `ipconfig` (look for IPv4 Address)

### Important: Object Memoization

**Always memoize** `config` and `cart` props to prevent infinite re-renders:

```tsx
// ✅ GOOD - Memoized
const config = useMemo(() => ({ ... }), []);
const cart = useMemo(() => ({ ... }), [dependencies]);

// ❌ BAD - Creates new object reference on every render
<ShippingProtectionWebView config={{ ... }} cart={{ ... }} />
```

### Clean Build

To start fresh after making changes:

```bash
# Clean all build artifacts
rm -rf dist public/dist node_modules
npm install

# Rebuild SDK
npm run build

# Restart dev servers
npx vite --host
```

## Troubleshooting

### Widget Not Showing

Ensure `javaScriptEnabled` and `domStorageEnabled` are true:
```typescript
<WebView
  javaScriptEnabled={true}
  domStorageEnabled={true}
  originWhitelist={['*']}
/>
```

### Messages Not Received

Enable debug logging to see message flow:
```typescript
<ShippingProtectionWebView
  debug={true}
  onError={(error) => console.error(error)}
/>
```

### WebView Not Auto-Resizing

The widget automatically sends `height-change` messages. Check that your WebView container allows height changes.

## Comparison: WebView vs Native

| Feature | WebView | Native Components |
|---------|---------|-------------------|
| Integration Time | 2 days | 5 days |
| Code Reuse | 90% | 30% |
| Performance | 50-100ms | 16ms |
| Memory | 10-20MB | 2MB |
| Updates | Automatic | Manual (npm) |
| Native UX | Limited | Full |

**Recommendation**: Use WebView for fast integration and MVPs. Consider native components for performance-critical or high-traffic apps.

## License

MIT
