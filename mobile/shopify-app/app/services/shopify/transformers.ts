/**
 * Data Transformation Layer
 *
 * Transforms Shopify data structures to app-specific formats
 * Critical: Maps Shopify checkout to Narvar CartData format
 */
import type { CartData, CartItem } from '@narvar/shipping-protection-webview-rn';

/**
 * Transform Shopify checkout to Narvar CartData format
 *
 * Key Differences:
 * - Shopify returns monetary values as STRINGS (must parse to numbers)
 * - Widget expects NUMBERS in dollars
 * - Must filter out protection item itself to prevent double-counting
 *
 * @param checkout - Shopify checkout object from shopify-buy SDK
 * @returns CartData object for shipping protection widget
 */
export function transformShopifyCheckoutToCartData(checkout: any): CartData {
  // Parse monetary strings to numbers
  const subtotal = parseFloat(checkout.subtotalPrice?.amount ?? '0');
  const shippingFee = parseFloat(checkout.shippingLine?.price?.amount ?? '0');

  // Calculate total discounts
  const discount = checkout.discountApplications?.reduce(
    (sum: number, app: any) => sum + parseFloat(app.value?.amount ?? '0'),
    0
  ) ?? 0;

  // Map line items (exclude protection item itself)
  const items: CartItem[] = (checkout.lineItems?.edges || [])
    .filter((edge: any) => {
      const attrs = edge.node.customAttributes || [];
      // Filter out shipping protection line item
      return !attrs.some((a: any) =>
        a.key === 'narvar_shipping_protection' && a.value === 'true'
      );
    })
    .map((edge: any) => {
      const item = edge.node;
      const unitPrice = parseFloat(item.variant.price.amount);

      return {
        sku: item.variant.sku || item.variant.id, // Fallback to ID if no SKU
        quantity: item.quantity,
        price: unitPrice * item.quantity // Total line price in dollars
      };
    });

  return {
    items,
    subtotal,
    currency: checkout.currencyCode,
    fees: shippingFee,
    discounts: discount
  };
}

/**
 * Find shipping protection line item in checkout
 *
 * @param checkout - Shopify checkout object
 * @returns Protection line item edge or null if not found
 */
export function findProtectionLineItem(checkout: any) {
  if (!checkout?.lineItems?.edges) {
    return null;
  }
  return checkout.lineItems.edges.find((edge: any) => {
    const attrs = edge.node.customAttributes || [];
    return attrs.some((a: any) =>
      a.key === 'narvar_shipping_protection' && a.value === 'true'
    );
  });
}

/**
 * Extract protection metadata from line item
 *
 * @param protectionLineItem - Protection line item edge
 * @returns Protection metadata (amount, currency, signature)
 */
export function extractProtectionMetadata(protectionLineItem: any) {
  if (!protectionLineItem) return null;

  const attrs = protectionLineItem.node.customAttributes || [];
  const amountAttr = attrs.find((a: any) => a.key === 'premium_amount');
  const currencyAttr = attrs.find((a: any) => a.key === 'premium_currency');
  const signatureAttr = attrs.find((a: any) => a.key === 'quote_signature');

  return {
    lineItemId: protectionLineItem.node.id,
    amount: parseFloat(amountAttr?.value ?? '0'),
    currency: currencyAttr?.value ?? 'USD',
    signature: signatureAttr?.value
  };
}

/**
 * Calculate cart totals for display
 *
 * @param checkout - Shopify checkout object
 * @returns Calculated totals object
 */
export function calculateCartTotals(checkout: any) {
  const subtotal = parseFloat(checkout.subtotalPrice?.amount ?? '0');
  const tax = parseFloat(checkout.totalTax?.amount ?? '0');
  const shipping = parseFloat(checkout.shippingLine?.price?.amount ?? '0');
  const discount = checkout.discountApplications?.reduce(
    (sum: number, app: any) => sum + parseFloat(app.value?.amount ?? '0'),
    0
  ) ?? 0;
  const total = parseFloat(checkout.totalPrice?.amount ?? '0');

  return {
    subtotal,
    tax,
    shipping,
    discount,
    total,
    currency: checkout.currencyCode
  };
}

/**
 * Check if checkout has any line items
 *
 * @param checkout - Shopify checkout object
 * @returns true if checkout has items
 */
export function hasLineItems(checkout: any): boolean {
  return (checkout?.lineItems?.edges?.length ?? 0) > 0;
}

/**
 * Format price for display
 *
 * @param amount - Price amount
 * @param currency - Currency code
 * @returns Formatted price string
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}
