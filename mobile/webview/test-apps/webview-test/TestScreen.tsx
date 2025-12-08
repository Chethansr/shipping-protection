import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ShippingProtectionWebView } from './components/ShippingProtectionWebView';

export function TestScreen() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };

  // Memoize config to prevent infinite loop from object reference changes
  const config = useMemo(() => ({
    variant: 'toggle' as const,
    page: 'cart' as const,
    retailerMoniker: 'dp',
    region: 'US',
    locale: 'en-US',
    environment: 'qa' as const,
    configUrl: 'http://192.168.1.3:5173/mock-config.json'
  }), []);

  // Memoize cart data to prevent unnecessary re-renders
  const cartData = useMemo(() => ({
    items: [
      { sku: 'TEST-001', quantity: 1, price: 29.99 },
      { sku: 'TEST-002', quantity: 2, price: 99.98 }
    ],
    subtotal: 129.97,
    currency: 'USD',
    fees: 5.99,
    discounts: 0
  }), []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Shipping Protection WebView Test</Text>

      {/* Test Widget */}
      <View style={styles.widgetContainer}>
        <ShippingProtectionWebView
          config={config}
          cart={cartData}
          widgetUrl="http://192.168.1.3:5173/widget-webview.html"
          onReady={(version) => {
            addLog(`✅ Widget ready: v${version}`);
          }}
          onQuoteAvailable={(quote) => {
            addLog(`💰 Quote: ${quote.currency} ${quote.amount} (${quote.source || 'client'})`);
          }}
          onProtectionAdd={(amount, currency) => {
            addLog(`✅ Protection added: ${currency} ${amount}`);
          }}
          onProtectionRemove={() => {
            addLog(`❌ Protection removed`);
          }}
          onError={(error) => {
            addLog(`❌ Error: ${error.category} - ${error.message}`);
          }}
          debug={true}
          style={styles.widget}
        />
      </View>

      {/* Event Logs */}
      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Event Logs:</Text>
        {logs.length === 0 ? (
          <Text style={styles.noLogs}>No events yet...</Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} style={styles.logEntry}>
              {log}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    padding: 16,
    textAlign: 'center'
  },
  widgetContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    borderRadius: 8
  },
  widget: {
    marginVertical: 8
  },
  logsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#000',
    borderRadius: 8,
    minHeight: 200
  },
  logsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  noLogs: {
    color: '#888',
    fontSize: 14
  },
  logEntry: {
    color: '#0f0',
    fontSize: 12,
    fontFamily: 'Courier',
    marginBottom: 4
  }
});
