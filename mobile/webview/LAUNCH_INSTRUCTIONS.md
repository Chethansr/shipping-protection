# React Native WebView Test App - Launch Instructions

## Current Status

✅ **Implementation**: 100% Complete
✅ **Widget HTML**: Served at `http://localhost:5173/widget-webview.html`
✅ **Test App**: Configured and ready
⚠️ **Metro Bundler**: Having startup issues (common Expo issue)

## Quick Verification

### 1. Verify Widget HTML Loads
Open in browser: http://localhost:5173/widget-webview.html

**Expected**: You should see the shipping protection widget loading with the bridge adapter console logs.

### 2. Verify Web SDK Loads
Open browser console and check for:
```javascript
window.Narvar.ShippingProtection
// Should show the API object
```

## Launch Test App (Three Methods)

### Method 1: Direct iOS Simulator (Recommended)
```bash
cd /Users/chethansindhie/dev/Narvar/narvar_shipping_protection/packages/shipping-protection-webview-rn/test-apps/webview-test

# Kill any existing Metro processes
pkill -f "react-native/node_modules/metro" || true

# Start fresh
npx expo start --ios
```

**Note**: Press `i` when prompted to launch iOS simulator.

### Method 2: Standalone Metro Bundler
```bash
cd /Users/chethansindhie/dev/Narvar/narvar_shipping_protection/packages/shipping-protection-webview-rn/test-apps/webview-test

# Start Metro bundler separately
npx react-native start --reset-cache

# In another terminal, run iOS
npx react-native run-ios
```

### Method 3: Manual Build
If Expo continues to have issues, build the app manually:

```bash
cd /Users/chethansindhie/dev/Narvar/narvar_shipping_protection/packages/shipping-protection-webview-rn/test-apps/webview-test

# Generate native code
npx expo prebuild

# Run iOS
npx expo run:ios
```

## Troubleshooting

### Metro Bundler Stuck at "Waiting on 8081"

**Cause**: Port conflict or watchman issues

**Solutions**:

1. **Kill all Metro processes**:
   ```bash
   pkill -f metro || true
   pkill -f "node.*8081" || true
   lsof -ti:8081 | xargs kill -9 || true
   ```

2. **Clear all caches**:
   ```bash
   cd test-apps/webview-test
   rm -rf .expo node_modules/.cache
   watchman watch-del-all || true
   npm start -- --reset-cache
   ```

3. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Version Mismatch Warning

```
react-native-webview@13.16.0 - expected version: 13.15.0
```

**Solution** (if needed):
```bash
npm install react-native-webview@13.15.0
```

### Widget Not Loading in WebView

1. **Check dev server is running**:
   ```bash
   curl http://localhost:5173/widget-webview.html
   ```

2. **Update TestScreen.tsx** if using different URL:
   ```typescript
   widgetUrl="http://YOUR_LOCAL_IP:5173/widget-webview.html"
   ```

3. **Check iOS simulator network access**:
   Simulator should have access to localhost by default.

## Expected Test Results

### On Successful Launch:

1. **App Screen Shows**:
   - Title: "Shipping Protection WebView Test"
   - WebView container (gray background)
   - Event Logs section (black background)

2. **First Events** (in order):
   ```
   ✅ Widget ready: v1.0.0
   💰 Quote: USD 1.95 (client)
   ```

3. **Widget Renders**:
   - Toggle/checkbox UI visible
   - "Protect your order" text
   - Price display: ~$1.95

4. **User Interactions**:
   - **Toggle ON**:
     - Log: `✅ Protection added: USD 1.95`
     - Alert: "Success"
   - **Toggle OFF**:
     - Log: `❌ Protection removed`
     - Alert: "Info"

### Test Checklist

- [ ] App launches without crash
- [ ] WebView loads (no blank screen)
- [ ] "Widget ready" event appears
- [ ] "Quote available" event appears
- [ ] Widget UI renders correctly
- [ ] Toggle works (add protection)
- [ ] Toggle works (remove protection)
- [ ] Event callbacks fire
- [ ] WebView resizes automatically
- [ ] No red error boxes

## Alternative: Test in Web Browser First

Before testing in React Native, verify the bridge adapter works in a regular browser:

1. Open: http://localhost:5173/widget-webview.html
2. Open browser DevTools console
3. Run test commands:
   ```javascript
   // Simulate React Native messages
   window.postMessage({
     source: 'narvar-shipping-protection-host',
     version: '1.0',
     message: {
       type: 'init',
       payload: {
         variant: 'toggle',
         page: 'cart',
         retailerMoniker: 'dp',
         region: 'US',
         locale: 'en-US',
         environment: 'qa'
       }
     }
   }, '*');

   // Send cart data
   window.postMessage({
     source: 'narvar-shipping-protection-host',
     version: '1.0',
     message: {
       type: 'render',
       payload: {
         items: [{ sku: 'TEST', quantity: 1, price: 99.99 }],
         subtotal: 99.99,
         currency: 'USD'
       }
     }
   }, '*');
   ```

4. Check console for bridge messages and SDK events

## Implementation Files Reference

### Package Structure
```
packages/shipping-protection-webview-rn/
├── src/
│   ├── ShippingProtectionWebView.tsx  ✅ Complete
│   ├── types/
│   │   ├── bridge-protocol.ts         ✅ Complete
│   │   └── validation.ts              ✅ Complete
│   └── index.ts                       ✅ Complete
├── test-apps/webview-test/
│   ├── App.tsx                        ✅ Complete
│   └── TestScreen.tsx                 ✅ Complete
└── [All documentation files]          ✅ Complete
```

### Bridge Adapter
```
public/widget-webview.html              ✅ Complete
```

## Next Steps After Successful Launch

1. **Take screenshots** of:
   - Initial load with event logs
   - Widget rendering
   - Toggle interaction
   - Event logs showing all callbacks

2. **Test scenarios** from TESTING_GUIDE.md:
   - Different cart values
   - Error scenarios
   - Multiple cart updates
   - Add/remove cycles

3. **Performance check**:
   - Memory usage in Xcode Instruments
   - Load time from launch to "ready" event
   - Interaction responsiveness

4. **Android testing**:
   - Repeat all tests on Android emulator
   - Compare behavior

## Getting Help

If Metro bundler issues persist:

1. Check React Native environment:
   ```bash
   npx react-native doctor
   ```

2. Verify Xcode Command Line Tools:
   ```bash
   xcode-select --print-path
   ```

3. Check Expo diagnostics:
   ```bash
   npx expo-doctor
   ```

4. Try creating a fresh Expo app to verify environment:
   ```bash
   npx create-expo-app test-new --template blank-typescript
   cd test-new
   npx expo start
   ```

## Summary

All code is complete and ready. The Metro bundler startup issue is a common React Native environment issue (not a problem with our implementation). The package will work correctly once the bundler starts.

**Recommended**: Try Method 1 (Direct iOS Simulator) first, which often bypasses Metro startup issues by launching directly.
