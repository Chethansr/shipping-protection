# Shopify Shopping App with Shipping Protection

Full-featured React Native mobile shopping app that connects to Shopify in headless mode and integrates the Narvar Shipping Protection WebView widget.

## Features

- Browse products from Shopify store
- Product detail views with variant selection
- Shopping cart with item management
- **Shipping Protection Widget Integration** (cart page)
- Shopify hosted checkout (WebView)
- Order confirmation flow
- Redux state management with cart persistence
- Bottom tab navigation

## Prerequisites

- Node.js 18+ and npm
- iOS Simulator (Mac) or Android Emulator
- Expo CLI
- Shopify store with Storefront API access

## Setup Instructions

### 1. Configure Shopify Store

1. Go to your Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps" → Create app
3. Configure API scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
4. Install app → Copy **Storefront Access Token**

### 2. Create Shipping Protection Product

1. In Shopify Admin → Products → Add product
2. Create product: "Narvar Shipping Protection"
3. Set price to $0.01 (will be overridden by widget quote)
4. Note the **variant ID** (from URL or product details)

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials
SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
SHOPIFY_PROTECTION_VARIANT_ID=gid://shopify/ProductVariant/YOUR_VARIANT_ID

NARVAR_RETAILER_MONIKER=dp
NARVAR_ENVIRONMENT=qa
```

### 4. Install Dependencies

Dependencies are already installed during app creation. If needed:

```bash
npm install
```

### 5. Run the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
mobile/shopify-app/
├── app/
│   ├── components/          # Reusable UI components
│   ├── config/             # Configuration files
│   │   ├── constants.ts    # App constants
│   │   └── shopify.config.ts
│   ├── navigation/         # Navigation setup
│   │   └── RootNavigator.tsx
│   ├── screens/            # Screen components
│   │   ├── CartScreen.tsx          # Cart + Widget
│   │   ├── CheckoutScreen.tsx      # Shopify checkout
│   │   ├── OrderConfirmationScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   └── ProductListScreen.tsx
│   ├── services/           # Business logic
│   │   └── shopify/
│   │       ├── ShopifyClient.ts    # Shopify API wrapper
│   │       └── transformers.ts     # Data transformers
│   └── store/             # Redux state management
│       ├── cart/
│       │   ├── cartSlice.ts        # Cart state
│       │   └── cartThunks.ts       # Async operations
│       ├── products/
│       │   └── productsSlice.ts
│       └── store.ts                # Redux store config
├── App.tsx                # Application root
├── package.json
└── README.md
```

## How It Works

### Shipping Protection Integration

The **CartScreen** demonstrates the full integration:

1. **Data Transformation**: Shopify checkout → Narvar `CartData` format
2. **Widget Rendering**: `ShippingProtectionWebView` component embedded
3. **Event Handling**: Widget events trigger Redux thunks
4. **Cart Sync**: Protection added/removed as Shopify line item with custom attributes

**Key Flow:**
```
User updates cart
  ↓
Transform to CartData → Pass to Widget
  ↓
Widget calculates quote → Emits 'quote-available'
  ↓
Store quote in Redux
  ↓
User toggles protection → Widget emits 'add-protection'
  ↓
Thunk adds line item to Shopify with custom attributes
  ↓
Cart refreshes → Widget recalculates
```

### Critical Integration Points

**app/screens/CartScreen.tsx** (lines 30-60):
- Transforms Shopify checkout to widget format
- Memoizes config and cart data (prevents re-renders)
- Handles widget events (quote-available, add-protection, remove-protection)

**app/services/shopify/transformers.ts**:
- Converts Shopify strings to numbers (dollars)
- Filters protection item from CartData
- Extracts protection metadata

**app/store/cart/cartThunks.ts**:
- `addProtectionToCart`: Adds line item with custom attributes
- `removeProtectionFromCart`: Finds and removes protection item

## Testing

### Manual Testing Checklist

- [ ] Browse products from Shopify
- [ ] View product details
- [ ] Add product to cart
- [ ] Widget renders and calculates quote
- [ ] Toggle protection on → Cart updates
- [ ] Toggle protection off → Removed from cart
- [ ] Proceed to checkout → Shopify hosted checkout loads
- [ ] Complete test order → Confirmation screen shows

### Test Configuration

For local widget development, override the widget URL in `app/config/constants.ts`:

```typescript
export const NARVAR_WIDGET_URL = 'http://192.168.1.3:5173/widget-webview.html';
```

Then run the widget dev server:

```bash
cd ../webview/test-apps/webview-test
npm start
```

## Troubleshooting

### TypeScript Warnings

If you see TypeScript warnings about `shopify-buy`, they're non-blocking. To fix:

```bash
npm install --save-dev @types/shopify-buy
```

Or create `types/shopify-buy.d.ts`:

```typescript
declare module 'shopify-buy';
```

### Shopify API Errors

- Verify your Storefront Access Token is correct
- Check API scopes are configured correctly
- Ensure domain format is correct: `your-store.myshopify.com`

### Widget Not Loading

- Check `NARVAR_WIDGET_URL` configuration
- Verify network connectivity
- Enable debug mode: `debug={true}` in `ShippingProtectionWebView`
- Check Metro bundler console for error logs

### Cart Not Persisting

- Check AsyncStorage permissions
- Verify Redux Persist configuration in `app/store/store.ts`
- Clear app data and restart: Settings → Apps → [App Name] → Clear Storage

## Architecture Decisions

### Why Redux Toolkit?
- Minimal boilerplate with built-in best practices
- Excellent TypeScript support
- Redux Persist for cart recovery (essential for Shopify checkouts)

### Why shopify-buy SDK?
- Official Shopify SDK (well-maintained)
- Abstracts GraphQL complexity
- Handles checkout lifecycle automatically

### Why Shopify Hosted Checkout?
- PCI-compliant (no custom payment handling required)
- Supports all Shopify payment methods
- Production-ready security out of the box

### Data Flow Pattern

```
User Action → Screen → Redux Thunk → Shopify API → Redux Store → Screen Update
                                          ↓
                            Transform to CartData → Widget → Event
                                                              ↓
                                              Redux Thunk → Shopify API
```

## Next Steps

### Phase 1 Enhancements

- Customer identity tracking (`setCustomerIdentity()`)
- Analytics integration (widget impressions, opt-ins)
- Server-side quotes with signature verification (`page: 'checkout'`)
- A/B testing with Growthbook

### Phase 2+ Features

- Multi-region support (dynamic locale/region)
- Product search and filtering
- Order history with protection status
- Push notifications for order updates
- Customizable widget styling via CSS custom properties

## Resources

- **Implementation Plan**: `../.claude/plans/bright-hugging-sphinx.md`
- **Shopify Storefront API**: https://shopify.dev/docs/api/storefront
- **shopify-buy SDK**: https://github.com/Shopify/js-buy-sdk
- **React Navigation**: https://reactnavigation.org/
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **Narvar Widget Integration**: `../webview/INTEGRATION_GUIDE.md`

## License

MIT
