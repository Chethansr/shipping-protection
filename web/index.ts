// Public exports
export * from './core';
export * from './api';

// Register web components (TRD requirement)
import './components/narvar-shipping-protection-widget';

// Demo registration (kept lightweight; useful for CSP/local verification pages)
import './demo/hello-secure';
import { NarvarSecure } from './api';

export const SECURE_SDK_VERSION = '0.0.1';
export function getVersion(): string {
  return SECURE_SDK_VERSION;
}

// Bootstrap: Feature detection and queue draining
import { detectFeatures } from './core/feature-detection';

(function bootstrap() {
  console.log('[ShippingProtection] Bootstrap started');

  const SDK_GLOBAL_KEY = 'NarvarShippingProtection';
  const g = globalThis as unknown as Record<string, any>;
  const existing = g[SDK_GLOBAL_KEY];

  console.log('[ShippingProtection] Existing stub:', existing);
  console.log('[ShippingProtection] Existing stub has _queue:', !!existing?._queue);

  // Detect required browser features (TRD requirement: Task 0.6.4)
  const features = detectFeatures();
  console.log('[ShippingProtection] Features:', features);

  if (!features.all) {
    const missing = Object.entries(features)
      .filter(([key, supported]) => key !== 'all' && !supported)
      .map(([key]) => key);

    console.error('[ShippingProtection] Browser unsupported. Missing features:', missing);

    // Mark as failed
    if (existing && existing._failed !== undefined) {
      existing._failed = true;
    }
    return;
  }

  // Get queued method calls
  const queued: Array<[string, unknown[]]> = Array.isArray(existing?._queue) ? existing._queue : [];
  console.log('[ShippingProtection] Queued calls:', queued.length);

  // Attach real API to global scope
  g[SDK_GLOBAL_KEY] = NarvarSecure;
  (g as any).Narvar = (g as any).Narvar || {};
  (g as any).Narvar.ShippingProtection = NarvarSecure;
  (NarvarSecure as any)._real = true;

  console.log('[ShippingProtection] _real flag set to true');
  console.log('[ShippingProtection] window.NarvarShippingProtection._real:', (g as any).NarvarShippingProtection?._real);
  console.log('[ShippingProtection] window.Narvar.ShippingProtection._real:', (g as any).Narvar?.ShippingProtection?._real);

  if (typeof existing?._failed === 'boolean') {
    (NarvarSecure as any)._failed = existing._failed;
  }

  // Drain queued method calls
  if (queued.length) {
    console.log('[ShippingProtection] Draining queue...');
    queued.forEach(([fn, args]) => {
      const maybeFn = (NarvarSecure as any)[fn];
      if (typeof maybeFn === 'function') {
        console.log('[ShippingProtection] Calling queued method:', fn);
        maybeFn.call(NarvarSecure, ...args);
      }
    });
  }

  console.log('[ShippingProtection] Bootstrap completed');
})();
