# Shipping Protection WebView - Integration Guide

## Overview

This guide shows retailers (like Belk) how to integrate shipping protection into their React Native mobile apps using the **WebView approach** - the fastest integration method with zero changes to the existing web SDK.

## Prerequisites

- React Native 0.64 or higher
- Node.js 18+
- Existing cart and checkout screens in React Native app

## Installation

### Step 1: Install Dependencies

```bash
npm install @narvar/shipping-protection-webview-rn react-native-webview
```

For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

### Step 2: Import Component

```typescript
import { ShippingProtectionWebView } from '@narvar/shipping-protection-webview-rn';
import type { CartData, Quote } from '@narvar/shipping-protection-webview-rn';
```

## Integration: Cart Screen

### Basic Integration (Toggle Variant)

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { ShippingProtectionWebView } from '@narvar/shipping-protection-webview-rn';

export function CartScreen() {
  const [cartItems, setCartItems] = useState([
    { id: '1', sku: 'BELK-SHIRT-001', name: 'Blue Shirt', price: 29.99, quantity: 1 },
    { id: '2', sku: 'BELK-JEANS-002', name: 'Jeans', price: 59.99, quantity: 2 }
  ]);

  const [protectionAmount, setProtectionAmount] = useState(0);
  const [protectionSelected, setProtectionSelected] = useState(false);

  // Transform cart items to SDK format
  const cartData = {
    items: cartItems.map(item => ({
      sku: item.sku,
      quantity: item.quantity,
      price: item.price
    })),
    subtotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    currency: 'USD',
    fees: 5.99, // Shipping fee
    discounts: 0
  };

  const totalWithProtection = cartData.subtotal + cartData.fees + (protectionSelected ? protectionAmount : 0);

  return (
    <View style={styles.container}>
      {/* Cart Items List */}
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)} x {item.quantity}</Text>
          </View>
        )}
      />

      {/* Shipping Protection Widget */}
      <ShippingProtectionWebView
        config={{
          variant: 'toggle',
          page: 'cart',
          retailerMoniker: 'belk',
          region: 'US',
          locale: 'en-US',
          environment: 'prod'  // Use 'qa' for testing
        }}
        cart={cartData}
        onQuoteAvailable={(quote) => {
          console.log('Quote calculated:', quote);
          // Quote is available but not yet selected
        }}
        onProtectionAdd={(amount, currency) => {
          console.log(`Protection added: ${currency} ${amount}`);
          setProtectionAmount(amount);
          setProtectionSelected(true);

          // Optionally add protection as a line item to cart
          // setCartItems([...cartItems, { id: 'protection', name: 'Shipping Protection', price: amount, quantity: 1 }]);
        }}
        onProtectionRemove={() => {
          console.log('Protection removed');
          setProtectionAmount(0);
          setProtectionSelected(false);

          // Optionally remove protection line item from cart
          // setCartItems(cartItems.filter(item => item.id !== 'protection'));
        }}
        onError={(error) => {
          console.error('Widget error:', error);
          // Show error message to user
        }}
        style={styles.widget}
        debug={__DEV__}  // Enable debug logs in development
      />

      {/* Cart Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryRow}>Subtotal: ${cartData.subtotal.toFixed(2)}</Text>
        <Text style={styles.summaryRow}>Shipping: ${cartData.fees.toFixed(2)}</Text>
        {protectionSelected && (
          <Text style={styles.summaryRow}>Protection: ${protectionAmount.toFixed(2)}</Text>
        )}
        <Text style={styles.total}>Total: ${totalWithProtection.toFixed(2)}</Text>
      </View>

      <Button title="Proceed to Checkout" onPress={() => navigation.navigate('Checkout')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  cartItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600'
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  widget: {
    marginHorizontal: 16,
    marginVertical: 12
  },
  summary: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  summaryRow: {
    fontSize: 16,
    marginBottom: 8
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8
  }
});
```

## Integration: Checkout Screen

### Server-Side Quote with Signature

```typescript
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { ShippingProtectionWebView } from '@narvar/shipping-protection-webview-rn';
import type { Quote } from '@narvar/shipping-protection-webview-rn';

export function CheckoutScreen({ route }) {
  const { cartData } = route.params;
  const [signedQuote, setSignedQuote] = useState<Quote | null>(null);
  const [protectionSelected, setProtectionSelected] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      // Submit order to your backend with signed quote
      const orderPayload = {
        cartItems: cartData.items,
        subtotal: cartData.subtotal,
        fees: cartData.fees,
        // Include signed quote for backend verification
        narvar_shipping_protection_quote: signedQuote,
        protection_selected: protectionSelected
      };

      const response = await fetch('https://api.belk.com/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) throw new Error('Order failed');

      // Navigate to confirmation
      navigation.navigate('OrderConfirmation', { orderId: response.orderId });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Your Order</Text>

      {/* Order Summary */}
      <View style={styles.summary}>
        <Text>Subtotal: ${cartData.subtotal.toFixed(2)}</Text>
        <Text>Shipping: ${cartData.fees.toFixed(2)}</Text>
      </View>

      {/* Shipping Protection - Checkout Page uses server-side quotes */}
      <ShippingProtectionWebView
        config={{
          variant: 'checkbox',
          page: 'checkout',  // Important: Uses edge service for signed quotes
          retailerMoniker: 'belk',
          region: 'US',
          locale: 'en-US',
          environment: 'prod'
        }}
        cart={cartData}
        onQuoteAvailable={(quote) => {
          console.log('Server quote received:', quote);
          // Store signed quote for backend verification
          if (quote.source === 'server' && quote.signature) {
            setSignedQuote(quote);
          }
        }}
        onProtectionAdd={(amount, currency) => {
          console.log('Protection selected for checkout');
          setProtectionSelected(true);
        }}
        onProtectionRemove={() => {
          console.log('Protection deselected');
          setProtectionSelected(false);
        }}
        customerIdentity={{
          customerId: 'belk-customer-12345',
          emailId: 'customer@example.com'
        }}
      />

      <Button
        title="Place Order"
        onPress={handlePlaceOrder}
        disabled={!signedQuote}  // Wait for quote before allowing checkout
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16
  },
  summary: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 16
  }
});
```

## Advanced: State Management with Zustand

For larger apps, use Zustand to manage cart and protection state:

```typescript
// store/cartStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartStore {
  items: CartItem[];
  protectionQuote: Quote | null;
  protectionSelected: boolean;

  addItem: (item: CartItem) => void;
  setProtectionQuote: (quote: Quote | null) => void;
  selectProtection: () => void;
  removeProtection: () => void;

  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      protectionQuote: null,
      protectionSelected: false,

      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),

      setProtectionQuote: (quote) => set({ protectionQuote: quote }),

      selectProtection: () => set({ protectionSelected: true }),

      removeProtection: () => set({
        protectionSelected: false,
        protectionQuote: null
      }),

      get total() {
        const { items, protectionSelected, protectionQuote } = get();
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const protection = protectionSelected && protectionQuote ? protectionQuote.amount : 0;
        return subtotal + protection;
      }
    }),
    {
      name: 'cart-storage',
      getStorage: () => AsyncStorage
    }
  )
);
```

Then in your component:

```typescript
function CartScreen() {
  const { items, protectionQuote, protectionSelected, setProtectionQuote, selectProtection, removeProtection, total } = useCartStore();

  return (
    <ShippingProtectionWebView
      cart={/* transform items to CartData */}
      onQuoteAvailable={setProtectionQuote}
      onProtectionAdd={selectProtection}
      onProtectionRemove={removeProtection}
    />
  );
}
```

## Testing

### Local Testing (Development)

1. Start the dev server:
```bash
npm run dev
```

2. Use local widget URL:
```typescript
<ShippingProtectionWebView
  widgetUrl="http://localhost:5173/widget-webview.html"
  debug={true}
/>
```

### QA Testing

```typescript
<ShippingProtectionWebView
  config={{
    ...config,
    environment: 'qa'
  }}
  debug={true}
/>
```

### Production Testing

Before going live:
1. Test with QA environment first
2. Verify signed quotes work on checkout page
3. Test error scenarios (network failure, ineligible cart)
4. Check performance on real devices (iOS + Android)

## Troubleshooting

### Issue: Widget not showing

**Solution**: Check WebView is rendering:
```typescript
<ShippingProtectionWebView
  debug={true}
  onError={(error) => console.error('Widget error:', error)}
  onReady={(version) => console.log('Widget ready, version:', version)}
/>
```

### Issue: Messages not being received

**Solution**: Enable debug logging and check console:
```typescript
debug={true}  // See all message bridge traffic
```

### Issue: Height not adjusting

**Solution**: Ensure container allows dynamic height:
```typescript
<View style={{ minHeight: 100 }}>
  <ShippingProtectionWebView ... />
</View>
```

## Performance Tips

1. **Lazy Load**: Only render widget when cart has items
2. **Debounce Updates**: Debounce cart data updates to avoid excessive renders
3. **Cache**: WebView caches the HTML, subsequent loads are faster
4. **Preload**: Initialize widget on app launch for faster cart page load

## Next Steps

- Review the [README](./README.md) for full API documentation
- See [Example App](../../demo-react-native/) for complete implementation
- Contact Narvar support for production credentials
