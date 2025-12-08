# Testing Guide for Retailers

This guide shows how to test the `@narvar/shipping-protection-webview-rn` package in your React Native app.

## Prerequisites

- React Native app (0.64 or higher)
- Node.js 18+
- iOS: Xcode 14+ with CocoaPods
- Android: Android Studio with SDK 33+

## Quick Test Setup

### 1. Create a New React Native App (Optional)

If you don't have an existing app, create one:

```bash
npx react-native init ShippingProtectionTest
cd ShippingProtectionTest
```

### 2. Install the Package

#### Option A: From npm (when published)
```bash
npm install @narvar/shipping-protection-webview-rn react-native-webview
```

#### Option B: From local path (for testing)
```bash
# In your React Native app directory
npm install ../path/to/packages/shipping-protection-webview-rn react-native-webview
```

#### Option C: Link from monorepo (for development)
```bash
# Add to package.json
{
  "dependencies": {
    "@narvar/shipping-protection-webview-rn": "file:../../packages/shipping-protection-webview-rn",
    "react-native-webview": "^13.0.0"
  }
}

npm install
```

### 3. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 4. Create Test Screen

Create `TestScreen.tsx`:

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { ShippingProtectionWebView } from '@narvar/shipping-protection-webview-rn';

export function TestScreen() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };

  // Mock cart data for testing
  const cartData = {
    items: [
      { sku: 'TEST-001', quantity: 1, price: 29.99 },
      { sku: 'TEST-002', quantity: 2, price: 49.99 }
    ],
    subtotal: 129.97,
    currency: 'USD',
    fees: 5.99,
    discounts: 0
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Shipping Protection WebView Test</Text>

      {/* Test Widget */}
      <View style={styles.widgetContainer}>
        <ShippingProtectionWebView
          config={{
            variant: 'toggle',
            page: 'cart',
            retailerMoniker: 'demo-store', // Use your retailer moniker
            region: 'US',
            locale: 'en-US',
            environment: 'qa' // Use 'qa' for testing
          }}
          cart={cartData}
          onReady={(version) => {
            addLog(`✅ Widget ready: v${version}`);
          }}
          onQuoteAvailable={(quote) => {
            addLog(`💰 Quote: ${quote.currency} ${quote.amount} (${quote.source})`);
          }}
          onProtectionAdd={(amount, currency) => {
            addLog(`✅ Protection added: ${currency} ${amount}`);
            Alert.alert('Success', `Protection added: ${currency} ${amount}`);
          }}
          onProtectionRemove={() => {
            addLog(`❌ Protection removed`);
            Alert.alert('Info', 'Protection removed');
          }}
          onError={(error) => {
            addLog(`❌ Error: ${error.category} - ${error.message}`);
            Alert.alert('Error', error.message);
          }}
          debug={true} // Enable debug logging
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
```

### 5. Add to App.tsx

```typescript
import React from 'react';
import { SafeAreaView } from 'react-native';
import { TestScreen } from './TestScreen';

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TestScreen />
    </SafeAreaView>
  );
}

export default App;
```

### 6. Run the App

#### iOS:
```bash
npm run ios
# or
npx react-native run-ios
```

#### Android:
```bash
npm run android
# or
npx react-native run-android
```

## Test Scenarios

### Scenario 1: Widget Loads Successfully

**Expected:**
1. Widget appears in the gray container
2. Log shows: `✅ Widget ready: v1.0.0`
3. Log shows: `💰 Quote: USD 1.95 (client)`

**Actual:** _[Record results]_

### Scenario 2: Toggle Protection On

**Actions:**
1. Tap the toggle switch to enable protection

**Expected:**
1. Toggle turns blue
2. Log shows: `✅ Protection added: USD 1.95`
3. Alert appears: "Protection added: USD 1.95"

**Actual:** _[Record results]_

### Scenario 3: Toggle Protection Off

**Actions:**
1. Tap the toggle switch to disable protection

**Expected:**
1. Toggle turns gray
2. Log shows: `❌ Protection removed`
3. Alert appears: "Protection removed"

**Actual:** _[Record results]_

### Scenario 4: Update Cart Data

**Actions:**
1. Change `cartData.subtotal` to a different value
2. Widget should re-render with new quote

**Expected:**
1. Widget updates automatically
2. New quote appears in logs
3. No errors

**Actual:** _[Record results]_

### Scenario 5: Error Handling

**Actions:**
1. Change `retailerMoniker` to `'invalid-retailer'`
2. Reload app

**Expected:**
1. Log shows error message
2. Widget displays error state gracefully
3. App doesn't crash

**Actual:** _[Record results]_

## Testing Checklist

- [ ] iOS: Widget loads and renders correctly
- [ ] iOS: Toggle works (on/off)
- [ ] iOS: Quote updates when cart changes
- [ ] iOS: Error handling works
- [ ] Android: Widget loads and renders correctly
- [ ] Android: Toggle works (on/off)
- [ ] Android: Quote updates when cart changes
- [ ] Android: Error handling works
- [ ] Checkout page variant works (server-side quotes)
- [ ] Debug logging provides useful information
- [ ] No console errors or warnings
- [ ] Memory usage is acceptable (<20MB)
- [ ] Performance is smooth (no lag)

## Troubleshooting

### Widget Not Appearing

1. Check Metro bundler is running:
```bash
npm start
```

2. Clear cache and rebuild:
```bash
npm start -- --reset-cache
cd ios && pod install && cd ..
npm run ios
```

3. Enable debug mode and check logs:
```typescript
debug={true}
```

### TypeScript Errors

Ensure type definitions are available:
```bash
npm install --save-dev @types/react @types/react-native
```

### WebView Errors

Check WebView permissions in Android:
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
```

## Performance Testing

### Memory Usage

Use Xcode Instruments (iOS) or Android Profiler to measure:
- Initial load: Should be <20MB
- After 10 toggles: Should not increase significantly
- After 5 minutes: Should remain stable

### Network Testing

Monitor network requests:
1. Widget should make 1 request to load HTML
2. Widget should make 1 request to load SDK bundle
3. Checkout page should make 1 request to edge API for quote

## Reporting Issues

When reporting issues, include:
1. React Native version: `npx react-native --version`
2. iOS/Android version
3. Error logs from Metro bundler
4. Screenshots/screen recordings
5. Steps to reproduce

## Next Steps

After successful testing:
1. Integrate into your actual cart screen
2. Test with production data (use `environment: 'prod'`)
3. Verify backend receives protection data correctly
4. Load test with multiple users
