/**
 * Product Detail Screen
 *
 * Shows product details and allows adding to cart
 */
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/products/productsSlice';
import { addToCart } from '../store/cart/cartThunks';
import { formatPrice } from '../services/shopify/transformers';
import type { RootState, AppDispatch } from '../store/store';

export function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct, loading } = useSelector((state: RootState) => state.products);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [productId]);

  useEffect(() => {
    if (selectedProduct?.variants?.[0]) {
      setSelectedVariant(selectedProduct.variants[0]);
    }
  }, [selectedProduct]);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      Alert.alert('Error', 'Please select a variant');
      return;
    }

    setAdding(true);
    try {
      await dispatch(
        addToCart({
          variantId: selectedVariant.id,
          quantity: 1
        })
      ).unwrap();

      Alert.alert('Success', 'Product added to cart', [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('CartTab', { screen: 'Cart' }) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add product to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading || !selectedProduct) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const price = parseFloat(selectedVariant?.price?.amount ?? '0');
  const currency = selectedVariant?.price?.currencyCode ?? 'USD';
  const imageUrl = selectedProduct.images[0]?.src;

  return (
    <ScrollView style={styles.container}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.productImage} />}

      <View style={styles.contentSection}>
        <Text style={styles.productTitle}>{selectedProduct.title}</Text>
        <Text style={styles.productPrice}>{formatPrice(price, currency)}</Text>

        {selectedProduct.description && (
          <Text style={styles.productDescription}>{selectedProduct.description}</Text>
        )}

        {selectedProduct.variants.length > 1 && (
          <View style={styles.variantsSection}>
            <Text style={styles.variantsTitle}>Select Variant:</Text>
            {selectedProduct.variants.map((variant: any) => (
              <TouchableOpacity
                key={variant.id}
                style={[
                  styles.variantButton,
                  selectedVariant?.id === variant.id && styles.variantButtonSelected
                ]}
                onPress={() => setSelectedVariant(variant)}
              >
                <Text
                  style={[
                    styles.variantText,
                    selectedVariant?.id === variant.id && styles.variantTextSelected
                  ]}
                >
                  {variant.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.addToCartButton, adding && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={adding || !selectedVariant}
        >
          <Text style={styles.addToCartButtonText}>
            {adding ? 'Adding...' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  productImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0'
  },
  contentSection: {
    padding: 16
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007aff',
    marginBottom: 16
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24
  },
  variantsSection: {
    marginBottom: 24
  },
  variantsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  variantButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8
  },
  variantButtonSelected: {
    borderColor: '#007aff',
    backgroundColor: '#007aff10'
  },
  variantText: {
    fontSize: 16,
    color: '#666'
  },
  variantTextSelected: {
    color: '#007aff',
    fontWeight: '600'
  },
  addToCartButton: {
    backgroundColor: '#007aff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  addToCartButtonDisabled: {
    opacity: 0.5
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  }
});
