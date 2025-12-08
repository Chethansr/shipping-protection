/**
 * Zod validation schemas for bridge messages
 * Ensures type safety across WebView boundary
 */

import { z } from 'zod';

/**
 * Quote schema
 */
export const QuoteSchema = z.object({
  amount: z.number(),
  currency: z.string().length(3),
  eligible: z.boolean().optional(),
  signature: z
    .object({
      jws: z.string(),
      created_at: z.number(),
      expires_at: z.number()
    })
    .optional(),
  source: z.enum(['client', 'server'])
});

/**
 * Serialized error schema
 */
export const SerializedErrorSchema = z.object({
  category: z.enum(['CONFIG_ERROR', 'NETWORK_ERROR', 'RENDER_ERROR', 'UNKNOWN_ERROR']),
  message: z.string(),
  retryable: z.boolean()
});

/**
 * Widget → Native message schemas
 */
export const WidgetToNativeMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('ready'),
    payload: z.object({
      version: z.string()
    })
  }),
  z.object({
    type: z.literal('quote-available'),
    payload: z.object({
      quote: QuoteSchema
    })
  }),
  z.object({
    type: z.literal('add-protection'),
    payload: z.object({
      amount: z.number(),
      currency: z.string()
    })
  }),
  z.object({
    type: z.literal('remove-protection'),
    payload: z.object({})
  }),
  z.object({
    type: z.literal('error'),
    payload: z.object({
      error: SerializedErrorSchema
    })
  }),
  z.object({
    type: z.literal('height-change'),
    payload: z.object({
      height: z.number()
    })
  })
]);

/**
 * CartItem schema
 */
export const CartItemSchema = z.object({
  sku: z.string(),
  quantity: z.number().int().positive(),
  price: z.number(),
  total_tax: z.number().optional(),
  categories: z.array(z.string()).optional()
});

/**
 * CartData schema
 */
export const CartDataSchema = z.object({
  items: z.array(CartItemSchema),
  subtotal: z.number(),
  currency: z.string().length(3),
  fees: z.number().optional(),
  discounts: z.number().optional()
});

/**
 * ShippingProtectionConfig schema
 */
export const ShippingProtectionConfigSchema = z.object({
  variant: z.enum(['toggle', 'checkbox']),
  page: z.enum(['cart', 'checkout']),
  retailerMoniker: z.string(),
  region: z.string(),
  locale: z.string(),
  environment: z.enum(['prod', 'qa', 'dev']).optional(),
  configUrl: z.string().url().optional()
});

/**
 * Native → Widget message schemas
 */
export const NativeToWidgetMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('init'),
    payload: ShippingProtectionConfigSchema
  }),
  z.object({
    type: z.literal('render'),
    payload: CartDataSchema
  }),
  z.object({
    type: z.literal('set-customer-identity'),
    payload: z.object({
      customerId: z.string().optional(),
      emailId: z.string().email().optional()
    })
  }),
  z.object({
    type: z.literal('destroy'),
    payload: z.object({})
  })
]);

/**
 * Bridge message envelope schema
 */
export const BridgeMessageSchema = z.object({
  source: z.enum(['narvar-shipping-protection-widget', 'narvar-shipping-protection-host']),
  version: z.literal('1.0'),
  message: z.union([WidgetToNativeMessageSchema, NativeToWidgetMessageSchema])
});

/**
 * Validation helper: Parse and validate bridge message
 */
export function validateBridgeMessage(data: unknown) {
  return BridgeMessageSchema.safeParse(data);
}

/**
 * Validation helper: Parse and validate widget message
 */
export function validateWidgetMessage(data: unknown) {
  const result = BridgeMessageSchema.safeParse(data);
  if (!result.success) return result;

  if (result.data.source !== 'narvar-shipping-protection-widget') {
    return {
      success: false as const,
      error: new Error('Message source must be narvar-shipping-protection-widget')
    };
  }

  return result;
}
