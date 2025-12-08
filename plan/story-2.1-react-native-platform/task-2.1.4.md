# Task 2.1.4: React Native UI Components

## Description
Implement React Native components for the cart widget and checkout buttons that match the web implementation's functionality while following React Native design patterns and best practices.

## Objectives
- Create React Native cart widget component
- Create React Native checkout buttons component
- Implement StyleSheet-based theming
- Subscribe to coordinator state using React hooks
- Handle user interactions with coordinator methods

## Acceptance Criteria
- ✅ `ShippingProtectionWidget` React Native component (cart page)
- ✅ `ShippingProtectionButtons` React Native component (checkout page)
- ✅ Toggle and checkbox variants for cart widget
- ✅ StyleSheet API for styling (no CSS)
- ✅ Theme customization via props
- ✅ React hooks for coordinator state subscription
- ✅ Accessibility support (screen readers, keyboard navigation)
- ✅ Loading states and error handling
- ✅ Animation support (optional, for toggle transitions)
- ✅ 90%+ test coverage using React Native Testing Library

## Implementation Notes

### Component Architecture

**Cart Widget** (`src/platforms/react-native/components/ShippingProtectionWidget.tsx`):
```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import type { Coordinator } from '../../../coordinator';
import type { Quote } from '../../../services/quote-calculator';

export interface ShippingProtectionWidgetProps {
  coordinator: Coordinator;
  variant: 'toggle' | 'checkbox';
  theme?: ShippingProtectionTheme;
}

export interface ShippingProtectionTheme {
  primaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  fontSize?: number;
  fontFamily?: string;
}

export function ShippingProtectionWidget({
  coordinator,
  variant,
  theme = {}
}: ShippingProtectionWidgetProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to coordinator events
    const handleQuoteAvailable = (event: CustomEvent) => {
      const { quote: newQuote } = event.detail;
      setQuote(newQuote);
      setIsLoading(false);
    };

    const handleError = (event: CustomEvent) => {
      const { error: err } = event.detail;
      setError(err.message);
      setIsLoading(false);
    };

    coordinator.on('narvar:shipping-protection:state:quote-available', handleQuoteAvailable);
    coordinator.on('narvar:shipping-protection:state:error', handleError);

    return () => {
      coordinator.off('narvar:shipping-protection:state:quote-available', handleQuoteAvailable);
      coordinator.off('narvar:shipping-protection:state:error', handleError);
    };
  }, [coordinator]);

  const handlePress = () => {
    if (isSelected) {
      coordinator.declineProtection();
      setIsSelected(false);
    } else {
      coordinator.selectProtection();
      setIsSelected(true);
    }
  };

  const styles = createStyles(theme);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading protection: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityRole="checkbox" accessibilityState={{ checked: isSelected }}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Protect Your Shipment</Text>
          {quote && (
            <Text style={styles.price}>
              {quote.amount} {quote.currency}
            </Text>
          )}
        </View>
        <Text style={styles.description}>
          Get protection against loss, damage, or theft during shipping.
        </Text>
      </View>

      {variant === 'toggle' ? (
        <Switch
          value={isSelected}
          onValueChange={handlePress}
          trackColor={{ false: theme.borderColor || '#ccc', true: theme.primaryColor || '#4c6ef5' }}
          thumbColor={isSelected ? '#fff' : '#f4f3f4'}
          disabled={isLoading}
        />
      ) : (
        <TouchableOpacity
          onPress={handlePress}
          style={styles.checkbox}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
        >
          <View style={[styles.checkboxInner, isSelected && styles.checkboxChecked]}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

function createStyles(theme: ShippingProtectionTheme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.backgroundColor || '#fff',
      borderWidth: 1,
      borderColor: theme.borderColor || '#dfe1e6',
      borderRadius: 8,
      marginVertical: 8,
    },
    content: {
      flex: 1,
      marginRight: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    title: {
      fontSize: theme.fontSize || 16,
      fontWeight: '600',
      color: theme.textColor || '#172b4d',
      fontFamily: theme.fontFamily,
    },
    price: {
      fontSize: theme.fontSize || 16,
      fontWeight: '700',
      color: theme.primaryColor || '#4c6ef5',
    },
    description: {
      fontSize: (theme.fontSize || 16) - 2,
      color: theme.textColor ? `${theme.textColor}cc` : '#5e6c84',
      fontFamily: theme.fontFamily,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: theme.primaryColor || '#4c6ef5',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxInner: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: theme.primaryColor || '#4c6ef5',
    },
    checkmark: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: '#d32f2f',
      fontSize: theme.fontSize || 14,
    },
  });
}
```

**Checkout Buttons** (`src/platforms/react-native/components/ShippingProtectionButtons.tsx`):
```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import type { Coordinator } from '../../../coordinator';
import type { ShippingProtectionTheme } from './ShippingProtectionWidget';

export interface ShippingProtectionButtonsProps {
  coordinator: Coordinator;
  theme?: ShippingProtectionTheme;
  onCheckout: (withProtection: boolean) => void;
}

export function ShippingProtectionButtons({
  coordinator,
  theme = {},
  onCheckout
}: ShippingProtectionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckoutWithProtection = async () => {
    setIsLoading(true);
    coordinator.selectProtection();
    await new Promise(resolve => setTimeout(resolve, 100)); // Brief delay for state update
    onCheckout(true);
    setIsLoading(false);
  };

  const handleCheckoutWithoutProtection = async () => {
    setIsLoading(true);
    coordinator.declineProtection();
    await new Promise(resolve => setTimeout(resolve, 100)); // Brief delay for state update
    onCheckout(false);
    setIsLoading(false);
  };

  const styles = createButtonStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleCheckoutWithProtection}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel="Checkout with shipping protection"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Checkout with Protection</Text>
            <Text style={styles.primaryButtonSubtext}>Recommended</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleCheckoutWithoutProtection}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel="Checkout without shipping protection"
      >
        <Text style={styles.secondaryButtonText}>Continue without protection</Text>
      </TouchableOpacity>
    </View>
  );
}

function createButtonStyles(theme: ShippingProtectionTheme) {
  return StyleSheet.create({
    container: {
      padding: 16,
      gap: 12,
    },
    button: {
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
    },
    primaryButton: {
      backgroundColor: theme.primaryColor || '#4c6ef5',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.borderColor || '#dfe1e6',
    },
    primaryButtonText: {
      color: '#fff',
      fontSize: (theme.fontSize || 16) + 1,
      fontWeight: '600',
      fontFamily: theme.fontFamily,
    },
    primaryButtonSubtext: {
      color: '#fff',
      fontSize: (theme.fontSize || 16) - 2,
      marginTop: 4,
      opacity: 0.9,
    },
    secondaryButtonText: {
      color: theme.textColor || '#172b4d',
      fontSize: theme.fontSize || 16,
      fontWeight: '500',
      fontFamily: theme.fontFamily,
    },
  });
}
```

### Component Export (`src/platforms/react-native/components/index.ts`):
```typescript
export { ShippingProtectionWidget } from './ShippingProtectionWidget';
export { ShippingProtectionButtons } from './ShippingProtectionButtons';
export type { ShippingProtectionWidgetProps, ShippingProtectionTheme } from './ShippingProtectionWidget';
export type { ShippingProtectionButtonsProps } from './ShippingProtectionButtons';
```

## Testing Strategy
- Use React Native Testing Library for component tests
- Test user interactions (toggle, checkbox, button presses)
- Test coordinator event subscriptions
- Test loading and error states
- Test theme customization
- Test accessibility features
- Snapshot tests for visual regression

## Dependencies
- React Native 0.72+
- React 18+
- Task 2.1.1 (Platform abstraction layer)
- Task 2.1.3 (Event system adapter)

## Design Considerations
- Follow iOS and Android design guidelines
- Support dark mode via theme prop
- Smooth animations for state changes
- Touch target sizes meet accessibility guidelines (44x44pt minimum)
- Support for internationalization (text from props)

