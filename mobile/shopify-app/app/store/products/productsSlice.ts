/**
 * Products State Slice
 *
 * Manages products fetched from Shopify
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { shopifyClient } from '../../services/shopify/ShopifyClient';

/**
 * Products state structure
 */
interface ProductsState {
  products: any[]; // Shopify product objects
  selectedProduct: any | null;
  loading: boolean;
  error: string | null;
}

/**
 * Initial state
 */
const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null
};

/**
 * Fetch all products (async thunk)
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (limit: number = 20) => {
    try {
      const products = await shopifyClient.fetchProducts(limit);
      return products;
    } catch (error) {
      console.error('[Products] Fetch failed:', error);
      throw error;
    }
  }
);

/**
 * Fetch single product by ID (async thunk)
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId: string) => {
    try {
      const product = await shopifyClient.fetchProductById(productId);
      return product;
    } catch (error) {
      console.error('[Products] Fetch by ID failed:', error);
      throw error;
    }
  }
);

/**
 * Products slice
 */
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    /**
     * Set selected product
     */
    setSelectedProduct(state, action: PayloadAction<any>) {
      state.selectedProduct = action.payload;
    },

    /**
     * Clear selected product
     */
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },

    /**
     * Clear error
     */
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch products';
    });

    // Fetch product by ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch product';
    });
  }
});

/**
 * Export actions
 */
export const { setSelectedProduct, clearSelectedProduct, clearError } =
  productsSlice.actions;

/**
 * Export reducer
 */
export default productsSlice.reducer;
