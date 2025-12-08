/**
 * ShippingProtectionWebView Component
 *
 * React Native WebView wrapper for Narvar Shipping Protection
 * Enables quick integration with zero changes to existing web SDK
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import type {
  BridgeMessage,
  WidgetToNativeMessage,
  NativeToWidgetMessage,
  Quote,
  SerializedError,
  CartData,
  ShippingProtectionConfig
} from './types';
import { validateWidgetMessage } from './types/validation';

/**
 * Component props
 */
export interface ShippingProtectionWebViewProps {
  /**
   * Shipping Protection configuration
   */
  config: ShippingProtectionConfig;

  /**
   * Current cart data (triggers re-render on change)
   */
  cart: CartData;

  /**
   * Called when widget is ready (after initialization complete)
   */
  onReady?: (version: string) => void;

  /**
   * Called when quote calculation completes
   */
  onQuoteAvailable?: (quote: Quote) => void;

  /**
   * Called when customer selects protection
   */
  onProtectionAdd?: (amount: number, currency: string) => void;

  /**
   * Called when customer removes protection
   */
  onProtectionRemove?: () => void;

  /**
   * Called on any widget error
   */
  onError?: (error: SerializedError) => void;

  /**
   * Optional customer identity for analytics
   */
  customerIdentity?: { customerId?: string; emailId?: string };

  /**
   * CDN URL for hosted widget HTML (default: Narvar CDN)
   */
  widgetUrl?: string;

  /**
   * Custom WebView styles
   */
  style?: ViewStyle;

  /**
   * Enable debug logging
   */
  debug?: boolean;
}

/**
 * ShippingProtectionWebView Component
 *
 * @example
 * ```tsx
 * <ShippingProtectionWebView
 *   config={{
 *     variant: 'toggle',
 *     page: 'cart',
 *     retailerMoniker: 'belk',
 *     region: 'US',
 *     locale: 'en-US',
 *     environment: 'qa'
 *   }}
 *   cart={cartData}
 *   onQuoteAvailable={(quote) => console.log('Quote:', quote)}
 *   onProtectionAdd={(amount, currency) => {
 *     // Add protection to cart
 *   }}
 *   onProtectionRemove={() => {
 *     // Remove protection from cart
 *   }}
 * />
 * ```
 */
export function ShippingProtectionWebView({
  config,
  cart,
  onReady,
  onQuoteAvailable,
  onProtectionAdd,
  onProtectionRemove,
  onError,
  customerIdentity,
  widgetUrl = 'https://cdn.narvar.com/shipping-protection/v1/widget.html',
  style,
  debug = false
}: ShippingProtectionWebViewProps) {
  const webViewRef = useRef<WebView>(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [webViewHeight, setWebViewHeight] = useState(200); // Default height

  /**
   * Send message to WebView
   */
  const sendToWebView = useCallback(
    (message: NativeToWidgetMessage) => {
      if (!webViewRef.current) {
        if (debug) console.warn('[ShippingProtectionWebView] WebView ref not ready');
        return;
      }

      const envelope: BridgeMessage<NativeToWidgetMessage> = {
        source: 'narvar-shipping-protection-host',
        version: '1.0',
        message
      };

      const script = `
        window.postMessage(${JSON.stringify(envelope)}, '*');
        true; // Prevent WebView error
      `;

      webViewRef.current.injectJavaScript(script);

      if (debug) {
        console.log('[ShippingProtectionWebView] Sent to WebView:', message.type, message.payload);
      }
    },
    [debug]
  );

  /**
   * Initialize widget when WebView loads (don't wait for 'ready')
   */
  useEffect(() => {
    if (!webViewLoaded) return;

    if (debug) {
      console.log('[ShippingProtectionWebView] Initializing widget with config:', config);
    }

    sendToWebView({
      type: 'init',
      payload: config
    });
  }, [webViewLoaded, config, sendToWebView, debug]);

  /**
   * Update cart data when it changes
   */
  useEffect(() => {
    if (!webViewReady) return;

    if (debug) {
      console.log('[ShippingProtectionWebView] Rendering cart:', cart);
    }

    sendToWebView({
      type: 'render',
      payload: cart
    });
  }, [webViewReady, cart, sendToWebView, debug]);

  /**
   * Update customer identity when it changes
   */
  useEffect(() => {
    if (!webViewReady || !customerIdentity) return;

    if (debug) {
      console.log('[ShippingProtectionWebView] Setting customer identity');
    }

    sendToWebView({
      type: 'set-customer-identity',
      payload: customerIdentity
    });
  }, [webViewReady, customerIdentity, sendToWebView, debug]);

  /**
   * Handle messages from WebView
   */
  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        // Validate message structure
        const parsed = validateWidgetMessage(data);
        if (!parsed.success) {
          console.warn('[ShippingProtectionWebView] Invalid message from WebView:', parsed.error);
          return;
        }

        const { message } = parsed.data as BridgeMessage<WidgetToNativeMessage>;

        if (debug) {
          console.log('[ShippingProtectionWebView] Received from WebView:', message.type, message.payload);
        }

        // Route message to appropriate handler
        switch (message.type) {
          case 'ready':
            setWebViewReady(true);
            onReady?.(message.payload.version);
            break;

          case 'quote-available':
            onQuoteAvailable?.(message.payload.quote);
            break;

          case 'add-protection':
            onProtectionAdd?.(message.payload.amount, message.payload.currency);
            break;

          case 'remove-protection':
            onProtectionRemove?.();
            break;

          case 'error':
            onError?.(message.payload.error);
            break;

          case 'height-change':
            setWebViewHeight(message.payload.height);
            break;
        }
      } catch (error) {
        console.error('[ShippingProtectionWebView] Failed to parse message:', error);
        onError?.({
          category: 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error parsing message',
          retryable: false
        });
      }
    },
    [debug, onReady, onQuoteAvailable, onProtectionAdd, onProtectionRemove, onError]
  );

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (webViewReady) {
        sendToWebView({ type: 'destroy', payload: {} });
      }
    };
  }, [webViewReady, sendToWebView]);

  return (
    <View style={[styles.container, { height: webViewHeight }, style]}>
      <WebView
        ref={webViewRef}
        source={{ uri: widgetUrl }}
        onMessage={handleMessage}
        style={styles.webView}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        onError={(syntheticEvent: any) => {
          const { nativeEvent } = syntheticEvent;
          console.error('[ShippingProtectionWebView] WebView error:', nativeEvent);
          onError?.({
            category: 'UNKNOWN_ERROR',
            message: `WebView error: ${nativeEvent.description}`,
            retryable: false
          });
        }}
        onLoadEnd={() => {
          if (debug) {
            console.log('[ShippingProtectionWebView] WebView loaded successfully');
          }
          setWebViewLoaded(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8
  },
  webView: {
    backgroundColor: 'transparent'
  }
});
