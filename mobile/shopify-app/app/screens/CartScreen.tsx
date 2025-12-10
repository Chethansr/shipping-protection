/**
 * Cart Screen
 *
 * Displays cart items and integrates Shipping Protection WebView widget
 */
import React, { useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ShippingProtectionWebView } from '@narvar/shipping-protection-webview-rn';
import type { CartData } from '@narvar/shipping-protection-webview-rn';

import { transformShopifyCheckoutToCartData, formatPrice } from '../services/shopify/transformers';
import {
  initializeCart,
  addProtectionToCart,
  removeProtectionFromCart
} from '../store/cart/cartThunks';
import { setProtectionQuote } from '../store/cart/cartSlice';
import { SHIPPING_PROTECTION_CONFIG, NARVAR_WIDGET_URL } from '../config/constants';
import type { RootState, AppDispatch } from '../store/store';

export function CartScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { checkout, checkoutId, protectionQuote, protectionSelected, loading, error } =
    useSelector((state: RootState) => state.cart);

  // Initialize cart on mount
  useEffect(() => {
    dispatch(initializeCart(checkoutId));
  }, []);

  // Transform Shopify checkout to widget format (memoized)
  const cartData: CartData | null = useMemo(() => {
    if (!checkout || !checkout.lineItems?.edges?.length) return null;

    try {
      return transformShopifyCheckoutToCartData(checkout);
    } catch (error) {
      console.error('[CartScreen] Transform failed:', error);
      return null;
    }
  }, [checkout]);

  // Widget config (memoized to prevent re-renders)
  const widgetConfig = useMemo(
    () => ({
      ...SHIPPING_PROTECTION_CONFIG,
      variant: 'toggle' as const,
      page: 'cart' as const
    }),
    []
  );

  // Widget event handlers
  const handleQuoteAvailable = (quote: any) => {
    console.log('[CartScreen] Quote available:', quote);
    dispatch(
      setProtectionQuote({
        amount: quote.amount,
        currency: quote.currency,
        signature: quote.signature?.jws,
        eligible: quote.eligible
      })
    );
  };

  const handleProtectionAdd = (amount: number, currency: string) => {
    console.log('[CartScreen] Protection add requested:', { amount, currency });
    dispatch(
      addProtectionToCart({
        amount,
        currency,
        signature: protectionQuote?.signature
      })
    );
  };

  const handleProtectionRemove = () => {
    console.log('[CartScreen] Protection remove requested');
    dispatch(removeProtectionFromCart());
  };

  const handleProtectionError = (error: any) => {
    console.error('[CartScreen] Widget error:', error);
    Alert.alert('Widget Error', error.message);
  };

  const handleCheckout = () => {
    if (!checkoutId) {
      Alert.alert('Error', 'No active checkout');
      return;
    }
    navigation.navigate('Checkout', { checkoutId });
  };

  // Loading state
  if (loading && !checkout) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  // Error state
  if (error && !checkout) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => dispatch(initializeCart(checkoutId))} />
      </View>
    );
  }

  // Empty cart
  if (!checkout || !checkout.lineItems?.edges?.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Button title="Start Shopping" onPress={() => navigation.navigate('Shop', { screen: 'ProductList' })} />
      </View>
    );
  }

  const subtotal = parseFloat(checkout.subtotalPrice?.amount ?? '0');
  const currency = checkout.currencyCode;

  return (
    <ScrollView style={styles.container}>
      {/* Cart Items Section */}
      <View style={styles.itemsSection}>
        <Text style={styles.sectionTitle}>Cart Items</Text>
        {(checkout.lineItems?.edges || [])
          .filter((edge: any) => {
            // Filter out protection item from display
            const attrs = edge.node.customAttributes || [];
            return !attrs.some(
              (a: any) => a.key === 'narvar_shipping_protection' && a.value === 'true'
            );
          })
          .map((edge: any) => {
            const item = edge.node;
            const price = parseFloat(item.variant.price.amount);

            return (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemVariant}>{item.variant.title}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>{formatPrice(price * item.quantity, currency)}</Text>
              </View>
            );
          })}
      </View>

      {/* Shipping Protection Widget Section */}
      {cartData && (
        <View style={styles.protectionSection}>
          <Text style={styles.sectionTitle}>Shipping Protection</Text>
          <ShippingProtectionWebView
            config={widgetConfig}
            cart={cartData}
            widgetUrl={NARVAR_WIDGET_URL}
            onQuoteAvailable={handleQuoteAvailable}
            onProtectionAdd={handleProtectionAdd}
            onProtectionRemove={handleProtectionRemove}
            onError={handleProtectionError}
            debug={true}
            style={styles.widget}
          />
        </View>
      )}

      {/* Cart Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal, currency)}</Text>
        </View>

        {protectionSelected && protectionQuote && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Protection</Text>
            <Text style={styles.summaryValue}>
              {formatPrice(protectionQuote.amount, protectionQuote.currency)}
            </Text>
          </View>
        )}

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            {formatPrice(
              subtotal + (protectionSelected && protectionQuote ? protectionQuote.amount : 0),
              currency
            )}
          </Text>
        </View>

        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          disabled={loading || !(checkout.lineItems?.edges?.length)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20
  },
  itemsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333'
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  itemVariant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666'
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333'
  },
  protectionSection: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  widget: {
    marginVertical: 8
  },
  summarySection: {
    padding: 16
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666'
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#333'
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333'
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333'
  }
});
