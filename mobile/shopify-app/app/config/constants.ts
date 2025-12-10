/**
 * Application Constants
 */
import {
  NARVAR_RETAILER_MONIKER as ENV_NARVAR_RETAILER_MONIKER,
  NARVAR_ENVIRONMENT as ENV_NARVAR_ENVIRONMENT,
  NARVAR_WIDGET_URL as ENV_NARVAR_WIDGET_URL
} from '@env';

// Narvar Configuration
export const NARVAR_RETAILER_MONIKER = ENV_NARVAR_RETAILER_MONIKER || 'dp';
export const NARVAR_ENVIRONMENT = (ENV_NARVAR_ENVIRONMENT as 'qa' | 'prod') || 'qa';
export const NARVAR_WIDGET_URL = ENV_NARVAR_WIDGET_URL || undefined;

// App Configuration
export const APP_NAME = 'Shopify Shopping App';
export const APP_VERSION = '1.0.0';

// API Timeouts
export const API_TIMEOUT = 10000; // 10 seconds

// Widget Configuration
export const SHIPPING_PROTECTION_CONFIG = {
  retailerMoniker: NARVAR_RETAILER_MONIKER,
  region: 'US',
  locale: 'en-US',
  environment: NARVAR_ENVIRONMENT
} as const;
