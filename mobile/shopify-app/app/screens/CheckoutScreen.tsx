/**
 * Checkout Screen
 *
 * Displays Shopify's hosted checkout in a WebView
 */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import WebView from 'react-native-webview';
import { shopifyClient } from '../services/shopify/ShopifyClient';

export function CheckoutScreen({ route, navigation }: any) {
  const { checkoutId } = route.params;
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheckoutUrl();
  }, [checkoutId]);

  const loadCheckoutUrl = async () => {
    try {
      setLoading(true);
      const checkout = await shopifyClient.fetchCheckout(checkoutId);
      const url = shopifyClient.getCheckoutUrl(checkout);

      console.log('[CheckoutScreen] Checkout URL:', url);
      setCheckoutUrl(url);
      setLoading(false);
    } catch (error) {
      console.error('[CheckoutScreen] Failed to load checkout:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load checkout. Please try again.');
      navigation.goBack();
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log('[CheckoutScreen] Navigation to:', url);

    // Detect order completion
    // Shopify redirects to /thank_you or /orders/[orderId] after successful checkout
    if (url.includes('/thank_you') || url.includes('/orders/')) {
      console.log('[CheckoutScreen] Order completed');

      // Navigate to confirmation screen
      navigation.reset({
        index: 0,
        routes: [
          { name: 'Shop' },
          { name: 'OrderConfirmation', params: { checkoutId } }
        ]
      });
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('[CheckoutScreen] WebView error:', nativeEvent);
    Alert.alert('Error', 'Failed to load checkout page. Please try again.');
  };

  if (loading || !checkoutUrl) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  webview: {
    flex: 1
  }
});
