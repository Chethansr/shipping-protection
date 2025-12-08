/**
 * Type re-exports from main shipping-protection SDK
 * These match the schemas defined in src/validation/schemas.ts
 */

/**
 * Shopping cart item
 */
export interface CartItem {
  sku: string;
  quantity: number;
  price: number; // In dollars (will be converted to cents for edge API)
  total_tax?: number;
  categories?: string[];
}

/**
 * Shopping cart data passed to SDK
 */
export interface CartData {
  items: CartItem[];
  subtotal: number; // In dollars
  currency: string; // ISO 4217 code (e.g., 'USD')
  fees?: number; // Shipping fees in dollars
  discounts?: number; // Discounts in dollars
}

/**
 * SDK initialization configuration
 */
export interface ShippingProtectionConfig {
  variant: 'toggle' | 'checkbox';
  page: 'cart' | 'checkout';
  retailerMoniker: string;
  region: string; // e.g., 'US', 'CA'
  locale: string; // e.g., 'en-US', 'fr-CA'
  environment?: 'prod' | 'qa' | 'st';
  configUrl?: string; // Optional override for config endpoint
  mockMode?: Record<string, unknown>; // Mock configuration for testing
}
