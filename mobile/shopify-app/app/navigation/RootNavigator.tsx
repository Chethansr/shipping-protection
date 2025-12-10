/**
 * Root Navigator
 *
 * Configures app navigation with bottom tabs and stack navigators
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ProductListScreen } from '../screens/ProductListScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Shop Stack Navigator
 * Handles product browsing flow
 */
function ShopStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Cart Stack Navigator
 * Handles cart and checkout flow
 */
function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Shopping Cart' }} />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout', headerShown: false }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{
          title: 'Order Confirmed',
          headerLeft: () => null, // Remove back button
          gestureEnabled: false // Disable swipe back
        }}
      />
    </Stack.Navigator>
  );
}

/**
 * Root Navigator with Bottom Tabs
 */
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: '#666'
        }}
      >
        <Tab.Screen
          name="Shop"
          component={ShopStack}
          options={{
            title: 'Shop',
            headerShown: false
          }}
        />
        <Tab.Screen
          name="CartTab"
          component={CartStack}
          options={{
            title: 'Cart',
            headerShown: false
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
