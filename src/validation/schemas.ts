import { z } from 'zod';

/**
 * ShippingProtectionConfig - Initialization config passed to init() method
 * Note: 'page' field (not 'source') to avoid confusion with quote event's 'source' ('client' | 'server')
 */
export const ShippingProtectionConfigSchema = z.object({
  variant: z.enum(['toggle', 'checkbox']),
  page: z.enum(['cart', 'checkout']),
  retailerMoniker: z.string().min(1),
  region: z.string().min(1),
  locale: z.string().min(2),
  environment: z.enum(['qa', 'st', 'prod']).optional().default('qa'),
  configUrl: z.string().url().optional(), // TRD: Optional, can be derived from retailerMoniker + environment
  experiment: z.record(z.unknown()).optional(),
  debug: z.boolean().optional(),
  mockMode: z.record(z.unknown()).optional()
});

export type ShippingProtectionConfig = z.infer<typeof ShippingProtectionConfigSchema>;

/**
 * SecureConfig - Retailer configuration fetched from edge/CDN
 */
export const SecureConfigSchema = z.object({
  retailerMoniker: z.string().min(1),
  region: z.string().min(1),
  locale: z.string().min(2),
  pricing: z.object({
    percentage: z.number().nonnegative().optional(),
    fixedFee: z.number().nonnegative().optional(),
    tiers: z
      .array(
        z.object({
          threshold: z.number().nonnegative(),
          percentage: z.number().nonnegative().optional(),
          fixedFee: z.number().nonnegative().optional()
        })
      )
      .optional()
  })
});

export type SecureConfig = z.infer<typeof SecureConfigSchema>;

export const CartItemSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative()
});

export const CartDataSchema = z.object({
  items: z.array(CartItemSchema),
  subtotal: z.number().nonnegative(),
  currency: z.string().length(3),
  fees: z.number().nonnegative().optional(),
  discounts: z.number().nonnegative().optional()
});

export type CartData = z.infer<typeof CartDataSchema>;
