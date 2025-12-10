/**
 * Cart State Slice
 *
 * Manages shopping cart state including Shopify checkout and shipping protection
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Protection quote from widget
 */
interface ProtectionQuote {
  amount: number;
  currency: string;
  signature?: string; // JWS signature from edge compute (Phase 1)
  eligible?: boolean; // Eligibility status (Phase 1)
}

/**
 * Cart state structure
 */
interface CartState {
  checkoutId: string | null; // Persisted for cart recovery
  checkout: any | null; // Full Shopify checkout object
  protectionQuote: ProtectionQuote | null; // Current quote from widget
  protectionSelected: boolean; // Is protection currently selected
  loading: boolean;
  error: string | null;
}

/**
 * Initial state
 */
const initialState: CartState = {
  checkoutId: null,
  checkout: null,
  protectionQuote: null,
  protectionSelected: false,
  loading: false,
  error: null
};

/**
 * Cart slice
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Set full checkout object
     */
    setCheckout(state, action: PayloadAction<any>) {
      state.checkout = action.payload;
      state.checkoutId = action.payload.id;
      state.error = null;
    },

    /**
     * Set protection quote from widget
     */
    setProtectionQuote(state, action: PayloadAction<ProtectionQuote>) {
      state.protectionQuote = action.payload;
    },

    /**
     * Set protection selection status
     */
    setProtectionSelected(state, action: PayloadAction<boolean>) {
      state.protectionSelected = action.payload;
    },

    /**
     * Set loading state
     */
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    /**
     * Set error state
     */
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },

    /**
     * Clear cart state
     */
    clearCart(state) {
      state.checkout = null;
      state.protectionQuote = null;
      state.protectionSelected = false;
      state.error = null;
    },

    /**
     * Clear error
     */
    clearError(state) {
      state.error = null;
    }
  }
});

/**
 * Export actions
 */
export const {
  setCheckout,
  setProtectionQuote,
  setProtectionSelected,
  setLoading,
  setError,
  clearCart,
  clearError
} = cartSlice.actions;

/**
 * Export reducer
 */
export default cartSlice.reducer;
