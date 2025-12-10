/**
 * Redux Store Configuration
 *
 * Configures Redux Toolkit store with persistence for cart recovery
 */
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import cartReducer from './cart/cartSlice';
import productsReducer from './products/productsSlice';

/**
 * Persist configuration for cart slice
 * Only persist checkout ID for recovery (not full cart data)
 */
const cartPersistConfig = {
  key: 'cart',
  storage: AsyncStorage,
  whitelist: ['checkoutId'] // Only persist checkout ID
};

/**
 * Configure Redux store
 */
export const store = configureStore({
  reducer: {
    cart: persistReducer(cartPersistConfig, cartReducer) as any,
    products: productsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore Shopify GraphQL objects which contain functions
        ignoredPaths: [
          'products.products',
          'products.selectedProduct',
          'cart.checkout'
        ]
      }
    })
});

/**
 * Create persistor for Redux persistence
 */
export const persistor = persistStore(store);

/**
 * TypeScript types
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
