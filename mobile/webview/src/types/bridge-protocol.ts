/**
 * Message Bridge Protocol for Shipping Protection WebView
 *
 * Defines all message types flowing between:
 * - Widget (WebView) → React Native Host
 * - React Native Host → Widget (WebView)
 */

import type { CartData, ShippingProtectionConfig } from './shipping-protection';

/**
 * Quote information from protection calculation
 */
export interface Quote {
  amount: number;
  currency: string;
  eligible?: boolean;
  signature?: {
    jws: string;
    created_at: number;
    expires_at: number;
  };
  source: 'client' | 'server';
}

/**
 * Serialized error for cross-boundary communication
 */
export interface SerializedError {
  category: 'CONFIG_ERROR' | 'NETWORK_ERROR' | 'RENDER_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  retryable: boolean;
}

/**
 * Messages sent from Widget (WebView) to React Native
 */
export type WidgetToNativeMessage =
  | {
      type: 'ready';
      payload: {
        version: string;
      };
    }
  | {
      type: 'quote-available';
      payload: {
        quote: Quote;
      };
    }
  | {
      type: 'add-protection';
      payload: {
        amount: number;
        currency: string;
      };
    }
  | {
      type: 'remove-protection';
      payload: Record<string, never>; // Empty object
    }
  | {
      type: 'error';
      payload: {
        error: SerializedError;
      };
    }
  | {
      type: 'height-change';
      payload: {
        height: number;
      };
    };

/**
 * Messages sent from React Native to Widget (WebView)
 */
export type NativeToWidgetMessage =
  | {
      type: 'init';
      payload: ShippingProtectionConfig;
    }
  | {
      type: 'render';
      payload: CartData;
    }
  | {
      type: 'set-customer-identity';
      payload: {
        customerId?: string;
        emailId?: string;
      };
    }
  | {
      type: 'destroy';
      payload: Record<string, never>; // Empty object
    };

/**
 * Message envelope wrapping all bridge messages
 * Includes source identification and versioning
 */
export interface BridgeMessage<T = WidgetToNativeMessage | NativeToWidgetMessage> {
  source: 'narvar-shipping-protection-widget' | 'narvar-shipping-protection-host';
  version: '1.0';
  message: T;
}

/**
 * Type guard to check if message is from widget
 */
export function isWidgetMessage(
  message: BridgeMessage
): message is BridgeMessage<WidgetToNativeMessage> {
  return message.source === 'narvar-shipping-protection-widget';
}

/**
 * Type guard to check if message is from host
 */
export function isHostMessage(
  message: BridgeMessage
): message is BridgeMessage<NativeToWidgetMessage> {
  return message.source === 'narvar-shipping-protection-host';
}
