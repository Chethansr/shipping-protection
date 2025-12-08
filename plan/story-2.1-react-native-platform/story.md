# Story 2.1: React Native Platform Support

## Overview
Extend shipping-protection.js to support React Native mobile shopping apps while maintaining the existing web implementation. This story introduces a platform abstraction layer that enables the same core business logic (state machine, services, coordinator) to run on both web and React Native with platform-specific adapters for UI, storage, and events.

## Description
This story creates a platform-agnostic architecture with shared core logic and platform-specific implementations. The web implementation continues using Web Components (Lit) and browser APIs, while React Native uses native components and React Native APIs. Both platforms share the same state machine, services (Config, QuoteCalculator, Analytics, etc.), coordinator, and business logic.

**Architecture Strategy**:
- **Core Layer** (platform-agnostic): State machine, coordinator, services, validation, error handling
- **Platform Layer** (platform-specific): UI components, storage, events, rendering
- **Adapter Pattern**: Platform adapters implement common interfaces for storage, events, and rendering
- **Build Strategy**: Separate bundles for web (IIFE) and React Native (ES modules/CommonJS)

## Goals
- Single codebase for web and React Native
- Zero duplication of business logic
- Platform-specific UX optimizations
- Consistent API surface across platforms
- Maintain web performance and bundle size
- Native-feeling mobile experience

## Acceptance Criteria
- ✅ Platform abstraction layer with adapters for storage, events, and rendering
- ✅ React Native components for cart widget and checkout buttons
- ✅ AsyncStorage adapter for identity and config persistence
- ✅ React Native event system (EventEmitter or custom bridge)
- ✅ Platform detection utility (web vs React Native)
- ✅ ES module bundle for React Native (separate from web IIFE)
- ✅ Shared core logic (state machine, coordinator, services) works on both platforms
- ✅ React Native-specific styling (StyleSheet API)
- ✅ npm package with platform-specific exports (`shipping-protection-web`, `shipping-protection-native`)
- ✅ Demo React Native app showing integration
- ✅ 90%+ test coverage for platform abstraction layer
- ✅ Documentation for React Native integration

## Tasks
- [Task 2.1.1](./task-2.1.1.md) - Platform abstraction layer architecture
- [Task 2.1.2](./task-2.1.2.md) - Storage adapter (AsyncStorage for React Native, localStorage for web)
- [Task 2.1.3](./task-2.1.3.md) - Event system adapter (React Native EventEmitter)
- [Task 2.1.4](./task-2.1.4.md) - React Native UI components (cart widget, checkout buttons)
- [Task 2.1.5](./task-2.1.5.md) - Platform detection and initialization
- [Task 2.1.6](./task-2.1.6.md) - Build configuration for React Native bundle
- [Task 2.1.7](./task-2.1.7.md) - React Native demo app
- [Task 2.1.8](./task-2.1.8.md) - Integration testing and documentation

## Dependencies
- Phase 1 (Stories 1.1-1.6) must be completed
- Web implementation fully functional and tested
- Edge service integration working
- Analytics and identity management tested

## Technical Notes

### Platform Abstraction Layer
**Common Interfaces**:
```typescript
// Storage interface (implemented by localStorage and AsyncStorage adapters)
interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Event interface (implemented by CustomEvent and React Native EventEmitter)
interface EventAdapter {
  emit(name: string, payload: unknown): void;
  on(name: string, listener: (payload: unknown) => void): void;
  off(name: string, listener: (payload: unknown) => void): void;
}

// Renderer interface (implemented by web and React Native renderers)
interface RendererAdapter {
  render(component: ComponentConfig): void;
  unmount(): void;
  update(props: Record<string, unknown>): void;
}
```

### Core Logic (Platform-Agnostic)
All business logic remains platform-agnostic:
- State machine (`src/state/fsm.ts`)
- Coordinator (`src/coordinator.ts`)
- Services (`src/services/`) - Config, QuoteCalculator, Analytics, Growthbook, ErrorLogging
- Validation (`src/validation/schemas.ts`)
- Error handling (`src/errors/widget-error.ts`)
- Result types (`src/core/result.ts`)
- Safe wrappers (`src/core/safe-fetch.ts`, `src/core/safe-json.ts`)

### Platform-Specific Implementations

**Web** (`src/platforms/web/`):
- Lit Web Components (`narvar-shipping-protection-widget`, `narvar-shipping-protection-buttons`)
- localStorage adapter
- CustomEvent adapter
- Shadow DOM for style isolation
- CSS layers for theming
- IIFE bundle (dist/shipping-protection.js)

**React Native** (`src/platforms/react-native/`):
- React Native functional components
- AsyncStorage adapter
- EventEmitter adapter
- StyleSheet API for styling
- React Native Paper or custom component library
- ES module bundle (dist/shipping-protection-native.js)

### Storage Differences
**Web (localStorage)**:
- Synchronous API
- ~10MB storage limit
- String-only values
- Same-origin policy

**React Native (AsyncStorage)**:
- Asynchronous API (Promise-based)
- ~6MB default limit (configurable)
- String-only values
- Per-app storage

**Adapter Solution**: Unified async interface, web adapter wraps localStorage in Promise.resolve()

### Event System Differences
**Web (CustomEvent)**:
- DOM-based events
- `window.dispatchEvent()`
- Bubbling and capturing

**React Native (EventEmitter)**:
- Node.js-style EventEmitter
- No DOM
- No bubbling

**Adapter Solution**: Common event interface with platform-specific implementations

### UI Component Differences
**Web (Lit Web Components)**:
- Shadow DOM isolation
- CSS custom properties
- HTML templates
- Lifecycle: `connectedCallback()`, `disconnectedCallback()`

**React Native (Functional Components)**:
- No Shadow DOM
- StyleSheet API
- JSX templates
- Lifecycle: `useEffect()` hooks

**Adapter Solution**: Separate UI implementations, shared state and business logic via coordinator

### Build Configuration
**Web Bundle**:
- Vite library mode
- IIFE format
- Target: ES2019
- Global: `window.Narvar.ShippingProtection`
- Output: `dist/shipping-protection.js`

**React Native Bundle**:
- Rollup or Vite
- ES module format
- Target: ES2022 (Metro bundler will transform)
- Exports: Named exports for components and API
- Output: `dist/shipping-protection-native.js`
- Package exports in package.json:
  ```json
  {
    "exports": {
      "./web": "./dist/shipping-protection.js",
      "./native": "./dist/shipping-protection-native.js"
    }
  }
  ```

### React Native Demo App Structure
```
demo-react-native/
├── App.tsx                  # Main app component
├── screens/
│   ├── CartScreen.tsx      # Cart with shipping protection widget
│   └── CheckoutScreen.tsx  # Checkout with protection buttons
├── package.json
└── metro.config.js
```

### Integration Example (React Native)
```typescript
import { ShippingProtection } from 'shipping-protection.js/native';
import { ShippingProtectionWidget } from 'shipping-protection.js/native/components';

// Initialize SDK
await ShippingProtection.init({
  variant: 'toggle',
  page: 'cart',
  retailerMoniker: 'acme-store',
  region: 'US',
  locale: 'en-US'
});

// Render widget in React Native component
function CartScreen() {
  const [cart, setCart] = useState({ /* cart data */ });

  useEffect(() => {
    ShippingProtection.render(cart);
  }, [cart]);

  return (
    <View>
      <ShippingProtectionWidget
        coordinator={ShippingProtection.coordinator}
        variant="toggle"
      />
    </View>
  );
}
```

### Testing Strategy
- **Unit tests**: Platform adapters in isolation
- **Integration tests**: Core logic with mock adapters
- **E2E tests**: Demo React Native app on iOS/Android simulators
- **Platform-agnostic tests**: State machine, coordinator, services (run on both platforms)

### Performance Considerations
- **Bundle size**: React Native bundle excludes web-specific code (Lit, Shadow DOM)
- **Lazy loading**: Platform adapters loaded dynamically based on detection
- **Tree shaking**: ES modules enable better tree shaking for React Native
- **Metro bundler**: React Native uses Metro, must be compatible

### Migration Path
1. Extract core logic into platform-agnostic modules
2. Create adapter interfaces
3. Implement web adapters wrapping existing code
4. Implement React Native adapters
5. Update build configuration for dual bundles
6. Create React Native demo app
7. Update documentation

### Open Questions
- **Component library**: React Native Paper, Native Base, or custom components?
- **Navigation**: How to handle deep linking for checkout flow?
- **Biometric auth**: Support for Touch ID/Face ID for customer identity?
- **Offline support**: Cache quotes for offline checkout?
- **Push notifications**: Integration with retailer's push notification system?

