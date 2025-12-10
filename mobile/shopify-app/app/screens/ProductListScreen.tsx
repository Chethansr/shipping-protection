/**
 * Product List Screen
 *
 * Displays products from Shopify
 */
import React, { useEffect } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/products/productsSlice';
import { formatPrice } from '../services/shopify/transformers';
import type { RootState, AppDispatch } from '../store/store';

export function ProductListScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(20));
  }, []);

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleRefresh = () => {
    dispatch(fetchProducts(20));
  };

  const renderProduct = ({ item }: { item: any }) => {
    const price = parseFloat(item.variants[0]?.price?.amount ?? '0');
    const currency = item.variants[0]?.price?.currencyCode ?? 'USD';
    const imageUrl = item.images[0]?.src;

    return (
      <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.productImage} />}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productPrice}>{formatPrice(price, currency)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !products.length) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error && !products.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={renderProduct}
      refreshing={loading}
      onRefresh={handleRefresh}
      contentContainerStyle={styles.list}
      numColumns={2}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center'
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007aff',
    borderRadius: 5
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  list: {
    padding: 8
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0'
  },
  productInfo: {
    padding: 12
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007aff'
  }
});
