/**
 * Cart Async Operations (Thunks)
 *
 * Handles all async cart operations: checkout management, adding/removing items,
 * shipping protection integration
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { shopifyClient } from '../../services/shopify/ShopifyClient';
import { findProtectionLineItem } from '../../services/shopify/transformers';
import {
  setCheckout,
  setProtectionSelected,
  setLoading,
  setError
} from './cartSlice';
import type { RootState } from '../store';

/**
 * Initialize cart (create or fetch existing checkout)
 */
export const initializeCart = createAsyncThunk(
  'cart/initialize',
  async (existingCheckoutId: string | null, { dispatch }) => {
    dispatch(setLoading(true));

    try {
      let checkout;

      if (existingCheckoutId) {
        // Try to fetch existing checkout
        checkout = await shopifyClient.fetchCheckout(existingCheckoutId);

        // If checkout is completed, create new one
        if (shopifyClient.isCheckoutCompleted(checkout)) {
          console.log('[Cart] Existing checkout completed, creating new one');
          checkout = await shopifyClient.createCheckout();
        }
      } else {
        // Create new checkout
        checkout = await shopifyClient.createCheckout();
      }

      dispatch(setCheckout(checkout));
      dispatch(setLoading(false));

      // Check if protection is already in cart
      const protectionItem = findProtectionLineItem(checkout);
      dispatch(setProtectionSelected(!!protectionItem));

      return checkout;
    } catch (error) {
      console.error('[Cart] Initialize failed:', error);
      dispatch(setError('Failed to initialize cart'));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

/**
 * Add product to cart
 */
export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (
    { variantId, quantity }: { variantId: string; quantity: number },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const checkoutId = state.cart.checkoutId;

    if (!checkoutId) {
      throw new Error('No checkout initialized');
    }

    dispatch(setLoading(true));

    try {
      const checkout = await shopifyClient.addLineItems(checkoutId, [
        { variantId, quantity }
      ]);

      dispatch(setCheckout(checkout));
      dispatch(setLoading(false));

      return checkout;
    } catch (error) {
      console.error('[Cart] Add item failed:', error);
      dispatch(setError('Failed to add item to cart'));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

/**
 * Update line item quantity
 */
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async (
    { lineItemId, quantity }: { lineItemId: string; quantity: number },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const checkoutId = state.cart.checkoutId;

    if (!checkoutId) {
      throw new Error('No checkout initialized');
    }

    dispatch(setLoading(true));

    try {
      const checkout = await shopifyClient.updateLineItems(checkoutId, [
        { id: lineItemId, quantity }
      ]);

      dispatch(setCheckout(checkout));
      dispatch(setLoading(false));

      return checkout;
    } catch (error) {
      console.error('[Cart] Update item failed:', error);
      dispatch(setError('Failed to update item'));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

/**
 * Remove item from cart
 */
export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (lineItemId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const checkoutId = state.cart.checkoutId;

    if (!checkoutId) {
      throw new Error('No checkout initialized');
    }

    dispatch(setLoading(true));

    try {
      const checkout = await shopifyClient.removeLineItems(checkoutId, [lineItemId]);

      dispatch(setCheckout(checkout));
      dispatch(setLoading(false));

      return checkout;
    } catch (error) {
      console.error('[Cart] Remove item failed:', error);
      dispatch(setError('Failed to remove item'));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

/**
 * Add shipping protection to cart
 * Called when widget emits 'add-protection' event
 */
export const addProtectionToCart = createAsyncThunk(
  'cart/addProtection',
  async (
    {
      amount,
      currency,
      signature
    }: {
      amount: number;
      currency: string;
      signature?: string;
    },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const checkoutId = state.cart.checkoutId;

    if (!checkoutId) {
      throw new Error('No checkout initialized');
    }

    dispatch(setLoading(true));

    try {
      const checkout = await shopifyClient.addShippingProtectionLineItem(
        checkoutId,
        amount,
        currency,
        signature
      );

      dispatch(setCheckout(checkout));
      dispatch(setProtectionSelected(true));
      dispatch(setLoading(false));

      console.log('[Cart] Protection added:', { amount, currency, hasSignature: !!signature });

      return checkout;
    } catch (error) {
      console.error('[Cart] Add protection failed:', error);
      dispatch(setError('Failed to add shipping protection'));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

/**
 * Remove shipping protection from cart
 * Called when widget emits 'remove-protection' event
 */
export const removeProtectionFromCart = createAsyncThunk(
  'cart/removeProtection',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const checkoutId = state.cart.checkoutId;

    if (!checkoutId) {
      throw new Error('No checkout initialized');
    }

    dispatch(setLoading(true));

    try {
      // Fetch current checkout to find protection line item
      const checkout = await shopifyClient.fetchCheckout(checkoutId);
      const protectionItem = findProtectionLineItem(checkout);

      if (!protectionItem) {
        console.warn('[Cart] Protection item not found in cart');
        dispatch(setProtectionSelected(false));
        dispatch(setLoading(false));
        return checkout;
      }

      // Remove protection line item
      const updatedCheckout = await shopifyClient.removeLineItems(checkoutId, [
        protectionItem.node.id
      ]);

      dispatch(setCheckout(updatedCheckout));
      dispatch(setProtectionSelected(false));
      dispatch(setLoading(false));

      console.log('[Cart] Protection removed');

      return updatedCheckout;
    } catch (error) {
      console.error('[Cart] Remove protection failed:', error);
      dispatch(setError('Failed to remove shipping protection'));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

/**
 * Refresh cart (re-fetch checkout)
 */
export const refreshCart = createAsyncThunk(
  'cart/refresh',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const checkoutId = state.cart.checkoutId;

    if (!checkoutId) {
      throw new Error('No checkout initialized');
    }

    try {
      const checkout = await shopifyClient.fetchCheckout(checkoutId);
      dispatch(setCheckout(checkout));

      // Update protection selection status
      const protectionItem = findProtectionLineItem(checkout);
      dispatch(setProtectionSelected(!!protectionItem));

      return checkout;
    } catch (error) {
      console.error('[Cart] Refresh failed:', error);
      dispatch(setError('Failed to refresh cart'));
      throw error;
    }
  }
);
