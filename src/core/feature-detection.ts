/**
 * Browser feature support status
 */
export type FeatureSupport = {
  customEvent: boolean;
  shadowDOM: boolean;
  localStorage: boolean;
  fetch: boolean;
  all: boolean; // true if ALL features supported
};

/**
 * Detects required browser features for SDK operation
 * Checks for: CustomEvent, Shadow DOM, localStorage, fetch API
 *
 * @returns Feature support status
 *
 * @example
 * const features = detectFeatures();
 * if (!features.all) {
 *   console.error('Unsupported browser:', features);
 * }
 */
export function detectFeatures(): FeatureSupport {
  const customEvent = typeof CustomEvent !== 'undefined';

  const shadowDOM = (() => {
    try {
      return 'attachShadow' in Element.prototype;
    } catch {
      return false;
    }
  })();

  const localStorage = (() => {
    try {
      const test = '__storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  })();

  const fetch = typeof window.fetch === 'function';

  return {
    customEvent,
    shadowDOM,
    localStorage,
    fetch,
    all: customEvent && shadowDOM && localStorage && fetch
  };
}
