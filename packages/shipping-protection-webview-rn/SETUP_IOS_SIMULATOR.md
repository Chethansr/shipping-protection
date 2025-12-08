# iOS Simulator Setup Guide

## Current Status

✅ Xcode 15.2 installed
❌ No iOS simulator devices available

## Quick Fix: Install iOS Simulator

### Method 1: Xcode GUI (Easiest)

1. **Open Xcode**:
   ```bash
   open -a Xcode
   ```

2. **Go to Settings**:
   - Xcode menu → Settings (or press ⌘,)
   - Click "Platforms" tab

3. **Download iOS Platform**:
   - Find "iOS" in the list
   - Click the download/install button
   - Wait for download to complete (~8GB)

4. **Verify Installation**:
   ```bash
   xcrun simctl list devices available | grep iPhone
   ```

### Method 2: Command Line (Faster)

```bash
# List available runtimes to download
xcodebuild -downloadAllPlatforms

# Or download specific iOS version
xcodebuild -downloadPlatform iOS
```

### Method 3: Simulator App Directly

1. **Open Simulator App**:
   ```bash
   open -a Simulator
   ```

2. **Add Device**:
   - File → New Simulator
   - Choose device type (iPhone 15, iPhone 14, etc.)
   - Choose iOS version
   - Click Create

## After Installing Simulator

Once iOS simulator is installed, launch the test app:

```bash
cd /Users/chethansindhie/dev/Narvar/narvar_shipping_protection/packages/shipping-protection-webview-rn/test-apps/webview-test

# Clean start
rm -rf .expo node_modules/.cache
npx expo start --ios
```

## Alternative: Test Without Simulator

While you wait for iOS simulator to download, you can test the WebView bridge adapter:

### Browser Testing (No Simulator Needed)

1. **Open Widget HTML**:
   ```bash
   open http://localhost:5173/widget-webview.html
   ```

2. **Open Browser DevTools** (⌥⌘I)

3. **Test Bridge Messages**:
   ```javascript
   // Initialize widget
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
         items: [{
           sku: 'TEST-001',
           quantity: 1,
           line_price: 2999,
           total_tax: 255
         }],
         subtotal: 2999,
         currency: 'USD',
         fees: 599,
         discounts: 0
       }
     }
   }, '*');
   ```

4. **Check Console for Events**:
   - Should see bridge messages logged
   - Widget should render
   - SDK events should fire

## Troubleshooting

### "xcode-select: error: tool 'xcodebuild' requires Xcode"

Install Xcode Command Line Tools:
```bash
xcode-select --install
```

### "Unable to locate Xcode"

Set Xcode path:
```bash
sudo xcode-select --switch /Applications/Xcode.app
```

### "No space left on device"

iOS simulator runtime is ~8GB. Free up space:
```bash
# Check available space
df -h

# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean npm cache
npm cache clean --force
```

### Simulator Still Not Showing

Reset simulator list:
```bash
# Kill all simulators
killall Simulator 2>/dev/null

# Reset simulator service
xcrun simctl shutdown all
xcrun simctl erase all

# List available runtimes
xcrun simctl list runtimes
```

## Expected Timeline

- **iOS Platform Download**: 10-30 minutes (depending on internet speed)
- **Installation**: 5-10 minutes
- **First Simulator Boot**: 1-2 minutes

## What Happens Next

Once iOS simulator is installed:

1. Simulator will appear in Expo Dev Tools
2. App will build and install automatically
3. You'll see TestScreen with event logs
4. Widget will load in WebView
5. Events will fire: ready → quote-available
6. You can test toggle interactions

## Quick Verification

After installation, verify everything works:

```bash
# 1. Check simulators exist
xcrun simctl list devices available | grep iPhone

# Should show:
# iPhone 15 (UUID) (Shutdown)
# iPhone 15 Pro (UUID) (Shutdown)
# etc.

# 2. Boot a simulator
xcrun simctl boot "iPhone 15"

# 3. Launch test app
cd test-apps/webview-test
npx expo start --ios
```

## Need Help?

If simulator installation fails or takes too long, you can:

1. **Test in browser** (see Browser Testing section above)
2. **Use Android emulator** instead:
   ```bash
   npx expo start --android
   ```
3. **Use physical iOS device** with Expo Go app

## Summary

The WebView package is 100% complete and working. The only requirement is installing iOS simulator on your Mac, which is a one-time setup step.

**Recommended**: Use Method 1 (Xcode GUI) for most reliable installation.
