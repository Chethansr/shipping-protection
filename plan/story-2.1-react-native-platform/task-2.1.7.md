# Task 2.1.7: React Native Demo App

## Description
Create a complete React Native demo application that demonstrates the shipping protection integration in a realistic mobile shopping experience. The app should showcase cart integration, checkout flow, and all SDK features.

## Objectives
- Build functional React Native demo app
- Demonstrate SDK initialization and integration
- Show cart and checkout flows
- Provide reference implementation for retailers
- Test SDK in realistic mobile environment

## Acceptance Criteria
- ✅ React Native app runs on iOS and Android
- ✅ Cart screen with ShippingProtectionWidget
- ✅ Checkout screen with ShippingProtectionButtons
- ✅ Product listing and cart management
- ✅ SDK initialization in App.tsx
- ✅ Event listeners for SDK events
- ✅ Theme customization example
- ✅ Error handling and loading states
- ✅ Navigation between screens (React Navigation)
- ✅ README with setup instructions

## Implementation Notes

### Project Structure
```
demo-react-native/
├── src/
│   ├── App.tsx                     # Main app component with SDK initialization
│   ├── navigation/
│   │   └── AppNavigator.tsx        # React Navigation setup
│   ├── screens/
│   │   ├── ProductListScreen.tsx   # Product catalog
│   │   ├── CartScreen.tsx          # Cart with shipping protection widget
│   │   └── CheckoutScreen.tsx      # Checkout with protection buttons
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   └── Header.tsx
│   ├── store/
│   │   └── cartStore.ts            # Simple state management (Zustand or Context)
│   └── utils/
│       └── mockData.ts             # Mock products and configuration
├── android/                        # Android native code
├── ios/                            # iOS native code
├── package.json
├── metro.config.js
├── tsconfig.json
└── README.md
```

### Main App Component (`src/App.tsx`):
```typescript
import React, { useEffect, useState } from 'react';
import { StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ShippingProtection } from 'shipping-protection.js/native';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    initializeSDK();
  }, []);

  async function initializeSDK() {
    try {
      // Initialize shipping protection SDK
      await ShippingProtection.init({
        variant: 'toggle',
        page: 'cart',
        retailerMoniker: 'demo-store',
        region: 'US',
        locale: 'en-US',
        debug: true
      });

      // Listen to SDK events
      ShippingProtection.on('narvar:shipping-protection:state:ready', () => {
        console.log('SDK ready');
        setSdkReady(true);
      });

      ShippingProtection.on('narvar:shipping-protection:state:error', (event) => {
        console.error('SDK error:', event.detail);
        Alert.alert('Error', 'Failed to initialize shipping protection');
      });

      ShippingProtection.on('narvar:shipping-protection:action:add-protection', (event) => {
        console.log('Protection added', event.detail);
      });

      ShippingProtection.on('narvar:shipping-protection:action:remove-protection', (event) => {
        console.log('Protection removed', event.detail);
      });

    } catch (error) {
      console.error('Failed to initialize SDK:', error);
      Alert.alert('Error', 'Failed to initialize shipping protection SDK');
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <AppNavigator sdkReady={sdkReady} />
      </NavigationContainer>
    </>
  );
}
```

### Cart Screen (`src/screens/CartScreen.tsx`):
```typescript
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ShippingProtection } from 'shipping-protection.js/native';
import { ShippingProtectionWidget } from 'shipping-protection.js/native/components';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../components/CartItem';

export function CartScreen({ navigation }) {
  const { items, total, removeItem, updateQuantity } = useCartStore();

  useEffect(() => {
    // Notify SDK of cart changes
    ShippingProtection.render({
      items: items.map(item => ({
        sku: item.sku,
        quantity: item.quantity,
        price: item.price * 100 // Convert to cents
      })),
      subtotal: total * 100, // Convert to cents
      currency: 'USD',
      fees: 0,
      discounts: 0
    });
  }, [items, total]);

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onRemove={() => removeItem(item.id)}
            onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        }
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          {/* Shipping Protection Widget */}
          <ShippingProtectionWidget
            coordinator={ShippingProtection.coordinator}
            variant="toggle"
            theme={{
              primaryColor: '#007AFF',
              textColor: '#000',
              backgroundColor: '#f8f9fa',
              borderColor: '#e0e0e0',
              fontSize: 15,
              fontFamily: 'System'
            }}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
```

### Checkout Screen (`src/screens/CheckoutScreen.tsx`):
```typescript
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ShippingProtection } from 'shipping-protection.js/native';
import { ShippingProtectionButtons } from 'shipping-protection.js/native/components';
import { useCartStore } from '../store/cartStore';

export function CheckoutScreen({ navigation }) {
  const { items, total, clearCart } = useCartStore();

  const handleCheckout = async (withProtection: boolean) => {
    try {
      // Simulate checkout API call
      console.log('Processing checkout...', { withProtection, items });

      // Show success message
      Alert.alert(
        'Order Placed',
        withProtection
          ? 'Your order is protected against shipping issues!'
          : 'Your order has been placed.',
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              navigation.navigate('ProductList');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Items:</Text>
          <Text style={styles.value}>{items.length}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>${total.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Shipping:</Text>
          <Text style={styles.value}>$5.99</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${(total + 5.99).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Shipping Protection</Text>
        <Text style={styles.footerSubtitle}>
          Choose how you'd like to checkout
        </Text>

        <ShippingProtectionButtons
          coordinator={ShippingProtection.coordinator}
          theme={{
            primaryColor: '#007AFF',
            textColor: '#000',
            fontSize: 16,
          }}
          onCheckout={handleCheckout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
});
```

### Package Dependencies (`package.json`):
```json
{
  "name": "shipping-protection-demo-rn",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "react-native-safe-area-context": "^4.7.0",
    "react-native-screens": "^3.25.0",
    "zustand": "^4.4.0",
    "shipping-protection.js": "workspace:*"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/runtime": "^7.23.0",
    "@react-native/eslint-config": "^0.72.0",
    "@react-native/metro-config": "^0.72.0",
    "@testing-library/react-native": "^12.3.0",
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.72.0",
    "typescript": "^5.0.0"
  }
}
```

### README.md for Demo App
Include setup instructions:
- Prerequisites (Node.js, React Native CLI, Xcode/Android Studio)
- Installation steps
- Running on iOS/Android simulators
- Building for physical devices
- Troubleshooting common issues
- SDK integration examples

## Testing Strategy
- Manual testing on iOS and Android simulators
- Test all user flows (browse → cart → checkout)
- Test SDK event listeners
- Test error scenarios
- Performance testing on physical devices

## Dependencies
- React Native 0.72+
- React Navigation 6+
- Task 2.1.4 (React Native UI components)
- Task 2.1.6 (Build configuration)

