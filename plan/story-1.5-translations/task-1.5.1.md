# Task 1.5.1: Config Service getTranslations()

## Description
Add getTranslations() method to the config service that fetches and caches translation strings from the retailer configuration.

## Objectives
- Add getTranslations() method
- Fetch translations from config API
- Cache translations in memory
- Return translation key-value map
- Handle missing translations

## Acceptance Criteria
- ✅ getTranslations() method available
- ✅ Translations fetched with config
- ✅ Translations cached in memory
- ✅ Returns Record<string, string>
- ✅ Handles missing locale gracefully
- ✅ 90%+ test coverage

## Translation Config Structure
```typescript
{
  retailerMoniker: "...",
  region: "...",
  locale: "en-US",
  translations: {
    "widget.title": "Protect your purchase",
    "widget.description": "Add protection...",
    "widget.price": "${price}",
    // ... more keys
  }
}
```

## Testing Strategy
- Test getTranslations() returns map
- Test caching works
- Test missing locale handled
- Test translation updates

## Dependencies
- Config service (task 0.4.1)
- Safe fetch (task 0.1.3)

