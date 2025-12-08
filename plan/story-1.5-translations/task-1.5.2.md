# Task 1.5.2: Translation Key Definitions

## Description
Define all translation keys for widget strings. Create a type-safe translation key system and document all available keys.

## Objectives
- Define all translation keys
- Create TypeScript types for keys
- Document key usage
- Define default English strings
- Provide translation templates

## Acceptance Criteria
- ✅ All widget strings have keys
- ✅ Translation keys typed
- ✅ Default English strings defined
- ✅ Keys documented
- ✅ Translation template provided
- ✅ 100% key coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Translation Keys
```typescript
enum TranslationKey {
  WIDGET_TITLE = 'widget.title',
  WIDGET_DESCRIPTION = 'widget.description',
  WIDGET_PRICE = 'widget.price',
  WIDGET_SELECT = 'widget.select',
  WIDGET_DECLINE = 'widget.decline',
  BUTTON_WITH_PROTECTION = 'button.withProtection',
  BUTTON_WITHOUT_PROTECTION = 'button.withoutProtection',
  ERROR_GENERIC = 'error.generic',
  ERROR_NETWORK = 'error.network',
  LOADING_TEXT = 'loading.text'
}
```

## Default Translations (English)
- widget.title: "Protect your purchase"
- widget.description: "Add protection for just {price}"
- widget.select: "Add protection"
- widget.decline: "No thanks"

## Testing Strategy
- Test all keys defined
- Test TypeScript types
- Test default strings
- Test key usage in components

## Dependencies
- None (type definitions)

