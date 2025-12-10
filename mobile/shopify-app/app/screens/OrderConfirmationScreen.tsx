/**
 * Order Confirmation Screen
 *
 * Displayed after successful order placement
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/cart/cartSlice';

export function OrderConfirmationScreen({ navigation }: any) {
  const dispatch = useDispatch();

  const handleContinueShopping = () => {
    // Clear cart state
    dispatch(clearCart());

    // Navigate back to product list
    navigation.reset({
      index: 0,
      routes: [{ name: 'Shop' }]
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.successIcon}>
        <Text style={styles.checkmark}>✓</Text>
      </View>

      <Text style={styles.title}>Order Confirmed!</Text>
      <Text style={styles.message}>
        Thank you for your purchase. You will receive a confirmation email shortly.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleContinueShopping}>
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  checkmark: {
    fontSize: 60,
    color: '#fff',
    fontWeight: '700'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32
  },
  button: {
    backgroundColor: '#007aff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  }
});
