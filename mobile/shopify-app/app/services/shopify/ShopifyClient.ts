/**
 * Shopify Storefront API Client
 *
 * Wraps shopify-buy SDK for simplified access to customer-facing Shopify APIs
 */
import Client from 'shopify-buy';
import {
  SHOPIFY_DOMAIN,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  SHOPIFY_PROTECTION_VARIANT_ID
} from '../../config/shopify.config';

export class ShopifyClient {
  private client: any;

  constructor() {
    this.client = Client.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN
    });
  }

  // ========== Product Methods ==========

  /**
   * Fetch all products with optional limit
   */
  async fetchProducts(limit: number = 20) {
    return this.client.product.fetchAll(limit);
  }

  /**
   * Fetch a single product by ID
   */
  async fetchProductById(id: string) {
    return this.client.product.fetch(id);
  }

  /**
   * Search products by query string
   */
  async searchProducts(query: string) {
    return this.client.product.fetchQuery({ query });
  }

  // ========== Checkout Methods ==========

  /**
   * Create a new checkout
   */
  async createCheckout() {
    return this.client.checkout.create();
  }

  /**
   * Fetch an existing checkout by ID
   */
  async fetchCheckout(checkoutId: string) {
    return this.client.checkout.fetch(checkoutId);
  }

  /**
   * Add line items to checkout
   */
  async addLineItems(checkoutId: string, lineItems: any[]) {
    return this.client.checkout.addLineItems(checkoutId, lineItems);
  }

  /**
   * Update existing line items in checkout
   */
  async updateLineItems(checkoutId: string, lineItems: any[]) {
    return this.client.checkout.updateLineItems(checkoutId, lineItems);
  }

  /**
   * Remove line items from checkout
   */
  async removeLineItems(checkoutId: string, lineItemIds: string[]) {
    return this.client.checkout.removeLineItems(checkoutId, lineItemIds);
  }

  // ========== Shipping Protection Methods ==========

  /**
   * Add shipping protection as a line item
   *
   * @param checkoutId - Shopify checkout ID
   * @param amount - Protection premium amount (in dollars)
   * @param currency - Currency code (e.g., 'USD')
   * @param signature - Optional JWS signature from edge compute (Phase 1)
   */
  async addShippingProtectionLineItem(
    checkoutId: string,
    amount: number,
    currency: string,
    signature?: string
  ) {
    if (!SHOPIFY_PROTECTION_VARIANT_ID || SHOPIFY_PROTECTION_VARIANT_ID === 'YOUR_VARIANT_ID') {
      throw new Error(
        'SHOPIFY_PROTECTION_VARIANT_ID not configured. ' +
        'Please create a "Shipping Protection" product in Shopify and set the variant ID in .env'
      );
    }

    const lineItem = {
      variantId: SHOPIFY_PROTECTION_VARIANT_ID,
      quantity: 1,
      customAttributes: [
        { key: 'narvar_shipping_protection', value: 'true' },
        { key: 'premium_amount', value: amount.toString() },
        { key: 'premium_currency', value: currency },
        ...(signature ? [{ key: 'quote_signature', value: signature }] : [])
      ]
    };

    return this.addLineItems(checkoutId, [lineItem]);
  }

  // ========== Utility Methods ==========

  /**
   * Get checkout URL for hosted checkout
   */
  getCheckoutUrl(checkout: any): string {
    return checkout.webUrl;
  }

  /**
   * Check if checkout is completed
   */
  isCheckoutCompleted(checkout: any): boolean {
    return checkout.completedAt !== null;
  }
}

// Singleton instance
export const shopifyClient = new ShopifyClient();
