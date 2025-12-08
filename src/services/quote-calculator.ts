import { CartData, SecureConfig, ShippingProtectionConfig } from '../validation/schemas';
import { getEdgeEndpoints } from '../core/constants';
import { Result, err, ok } from '../core/result';
import { createError } from '../errors/widget-error';

/**
 * Phase 0: Client-side quote calculation result
 */
export type Quote = {
  amount: number;
  currency: string;
};

/**
 * Phase 1: Edge service quote response with signature and eligibility
 * Based on POST /v1/quote response from edge compute OpenAPI spec
 */
export type EdgeQuoteSignature = {
  jws: string;
  created_at: number;
  expires_at: number;
};

export type EdgeQuoteResponse = {
  eligible: 'eligible' | 'not_eligible';
  quote: {
    premium_value: number;
  };
  signature: EdgeQuoteSignature;
  ineligible_reason: string | null;
};

/**
 * Phase 1: Extended quote with edge response data
 */
export type QuoteWithEligibility = Quote & {
  eligible: boolean;
  signature?: EdgeQuoteSignature;
  ineligible_reason?: string | null;
  source: 'client' | 'server';
};

export class QuoteCalculator {
  constructor(private config: SecureConfig) {}

  /**
   * Phase 0: Client-side quote calculation only (cart page)
   */
  calculate(cart: CartData): Quote {
    const { pricing } = this.config;
    const base = cart.subtotal + (cart.fees ?? 0) - (cart.discounts ?? 0);

    // Tiered pricing if provided
    if (pricing.tiers && pricing.tiers.length > 0) {
      const sorted = [...pricing.tiers].sort((a, b) => a.threshold - b.threshold);
      const tier = sorted.find((t) => base >= t.threshold) ?? sorted[sorted.length - 1];
      const pct = tier?.percentage ?? 0;
      const fixed = tier?.fixedFee ?? 0;
      return {
        amount: roundCurrency(base * (pct / 100) + fixed),
        currency: cart.currency
      };
    }

    const pct = pricing.percentage ?? 0;
    const fixed = pricing.fixedFee ?? 0;
    return {
      amount: roundCurrency(base * (pct / 100) + fixed),
      currency: cart.currency
    };
  }

  /**
   * Story 0.10: Server-side quote calculation via edge compute (checkout page)
   * Calls POST /v1/quote and returns signed quote with eligibility
   */
  async calculateWithEdge(cart: CartData, sdkConfig: ShippingProtectionConfig): Promise<Result<QuoteWithEligibility, Error>> {
    try {
      const env = sdkConfig.environment ?? 'qa';
      const endpoints = getEdgeEndpoints(env);

      // Transform CartData to edge API request format
      const requestBody = {
        currency: cart.currency,
        locale: sdkConfig.locale,
        order_items: cart.items.map(item => ({
          line_price: Math.round(item.price * 100), // Convert to cents
          quantity: item.quantity,
          sku: item.sku,
          total_tax: 0 // Phase 0: tax not tracked in CartItem
        })),
        ship_to: sdkConfig.region.toUpperCase(),
        shipping_fee: Math.round((cart.fees ?? 0) * 100), // Convert to cents
        shipping_fee_tax: 0, // Phase 0: shipping tax not tracked
        retailer_moniker: sdkConfig.retailerMoniker
      };

      const response = await fetch(endpoints.QUOTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        return err(createError('NETWORK_ERROR', `Edge API returned ${response.status}`, await response.text()));
      }

      const data: EdgeQuoteResponse = await response.json();

      // Transform edge response to QuoteWithEligibility
      const quote: QuoteWithEligibility = {
        amount: data.quote.premium_value / 100, // Convert from cents to dollars
        currency: cart.currency,
        eligible: data.eligible === 'eligible',
        signature: data.signature,
        ineligible_reason: data.ineligible_reason,
        source: 'server'
      };

      return ok(quote);
    } catch (e) {
      return err(createError('NETWORK_ERROR', 'Failed to fetch edge quote', e));
    }
  }
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
