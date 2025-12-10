/**
 * Shopify Store Configuration
 */
import {
  SHOPIFY_DOMAIN as ENV_SHOPIFY_DOMAIN,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN as ENV_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  SHOPIFY_PROTECTION_VARIANT_ID as ENV_SHOPIFY_PROTECTION_VARIANT_ID
} from '@env';

export const SHOPIFY_DOMAIN = ENV_SHOPIFY_DOMAIN || 'your-store.myshopify.com';
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = ENV_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
export const SHOPIFY_PROTECTION_VARIANT_ID = ENV_SHOPIFY_PROTECTION_VARIANT_ID || '';

if (!SHOPIFY_DOMAIN || SHOPIFY_DOMAIN === 'your-store.myshopify.com') {
  console.warn(
    '[Shopify Config] Missing SHOPIFY_DOMAIN. Please set in .env file'
  );
}

if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  console.warn(
    '[Shopify Config] Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN. Please set in .env file'
  );
}

export const SHOPIFY_CONFIG = {
  domain: SHOPIFY_DOMAIN,
  storefrontAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: '2024-01'
};
