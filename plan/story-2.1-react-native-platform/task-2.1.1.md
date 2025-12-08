# Task 2.1.1: Platform Abstraction Layer Architecture

## Description
Design and implement the platform abstraction layer that enables the same core business logic to run on both web and React Native. Define common interfaces for storage, events, and rendering that platform-specific adapters will implement.

## Objectives
- Define common interfaces for platform-specific functionality
- Refactor core logic to be platform-agnostic
- Create platform detection utility
- Establish clear separation between core and platform layers

## Acceptance Criteria
- ✅ `StorageAdapter` interface defined with async methods
- ✅ `EventAdapter` interface defined for pub/sub
- ✅ `RendererAdapter` interface defined for UI rendering
- ✅ Platform detection utility (`isWeb()`, `isReactNative()`)
- ✅ Core logic (state machine, coordinator, services) extracted to platform-agnostic modules
- ✅ No direct references to `window`, `document`, `localStorage`, or `CustomEvent` in core logic
- ✅ Type-safe adapter interfaces with TypeScript
- ✅ 100% test coverage for interfaces and detection utility

## Implementation Notes

### Directory Structure
```
src/
├── core/                 # Platform-agnostic (no changes needed)
│   ├── result.ts
│   ├── safe-fetch.ts
│   └── timeouts.ts
├── state/                # Platform-agnostic (extract event emission)
│   ├── fsm.ts
│   └── events.ts
├── coordinator.ts        # Platform-agnostic (use adapters)
├── services/             # Platform-agnostic (no changes needed)
│   ├── config-service.ts
│   ├── quote-calculator.ts
│   └── analytics.ts
├── platforms/            # NEW: Platform-specific code
│   ├── common/           # Shared interfaces
│   │   ├── storage-adapter.ts
│   │   ├── event-adapter.ts
│   │   ├── renderer-adapter.ts
│   │   └── platform-detection.ts
│   ├── web/              # Web-specific implementations
│   │   ├── storage-adapter.ts      # localStorage wrapper
│   │   ├── event-adapter.ts        # CustomEvent wrapper
│   │   ├── renderer-adapter.ts     # Lit component manager
│   │   └── components/             # Existing Lit components
│   └── react-native/     # React Native implementations
│       ├── storage-adapter.ts      # AsyncStorage wrapper
│       ├── event-adapter.ts        # EventEmitter wrapper
│       ├── renderer-adapter.ts     # React Native renderer
│       └── components/             # React Native components
└── api.ts                # Updated to use adapters
```

### Common Interfaces

**Storage Adapter** (`src/platforms/common/storage-adapter.ts`):
```typescript
export interface StorageAdapter {
  /**
   * Get item from storage
   * @returns Promise resolving to value or null if not found
   */
  getItem(key: string): Promise<string | null>;

  /**
   * Set item in storage
   * @throws Error if storage quota exceeded
   */
  setItem(key: string, value: string): Promise<void>;

  /**
   * Remove item from storage
   */
  removeItem(key: string): Promise<void>;

  /**
   * Clear all items from storage
   */
  clear(): Promise<void>;
}
```

**Event Adapter** (`src/platforms/common/event-adapter.ts`):
```typescript
export interface EventAdapter {
  /**
   * Emit event to all listeners
   */
  emit(name: string, payload: unknown): void;

  /**
   * Subscribe to event
   * @returns Unsubscribe function
   */
  on(name: string, listener: EventListener): UnsubscribeFn;

  /**
   * Unsubscribe from event
   */
  off(name: string, listener: EventListener): void;
}

export type EventListener = (payload: unknown) => void;
export type UnsubscribeFn = () => void;
```

**Renderer Adapter** (`src/platforms/common/renderer-adapter.ts`):
```typescript
export interface RendererAdapter {
  /**
   * Render component with initial props
   */
  render(config: RenderConfig): void;

  /**
   * Update component with new props
   */
  update(props: Record<string, unknown>): void;

  /**
   * Unmount component and cleanup
   */
  unmount(): void;
}

export interface RenderConfig {
  target: unknown;  // DOM element for web, container ref for React Native
  variant: 'toggle' | 'checkbox';
  coordinator: Coordinator;
  initialProps?: Record<string, unknown>;
}
```

**Platform Detection** (`src/platforms/common/platform-detection.ts`):
```typescript
export type Platform = 'web' | 'react-native' | 'unknown';

export function detectPlatform(): Platform {
  // Check for React Native global
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }

  // Check for browser environment
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return 'web';
  }

  return 'unknown';
}

export function isWeb(): boolean {
  return detectPlatform() === 'web';
}

export function isReactNative(): boolean {
  return detectPlatform() === 'react-native';
}

export function assertPlatform(expected: Platform): void {
  const actual = detectPlatform();
  if (actual !== expected) {
    throw new Error(`Expected platform ${expected}, got ${actual}`);
  }
}
```

### Refactoring Core Logic

**Coordinator** - Inject adapters via constructor:
```typescript
export class Coordinator {
  constructor(
    private storage: StorageAdapter,
    private events: EventAdapter
  ) {
    // Use adapters instead of direct browser APIs
  }

  async initialize(options: CoordinatorOptions): Promise<Result<void, Error>> {
    // Use this.storage instead of localStorage
    // Use this.events instead of CustomEvent
  }
}
```

**API Layer** - Platform-specific factory:
```typescript
// src/platforms/web/api.ts
export function createWebAPI(): ShippingProtectionAPI {
  const storage = new WebStorageAdapter();
  const events = new WebEventAdapter();
  const renderer = new WebRendererAdapter();
  return new ShippingProtectionAPI(storage, events, renderer);
}

// src/platforms/react-native/api.ts
export function createReactNativeAPI(): ShippingProtectionAPI {
  const storage = new ReactNativeStorageAdapter();
  const events = new ReactNativeEventAdapter();
  const renderer = new ReactNativeRendererAdapter();
  return new ShippingProtectionAPI(storage, events, renderer);
}
```

## Testing Strategy
- Test platform detection in various environments (jsdom, Node, React Native test renderer)
- Mock adapters for unit testing core logic
- Verify no platform-specific code in core modules
- Test adapter interface contracts

## Dependencies
- Phase 1 complete
- All core services functional
- TypeScript 5.0+ for interface definitions

