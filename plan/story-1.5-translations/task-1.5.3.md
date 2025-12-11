# Task 1.5.3: Component Translation Integration

## Description
Integrate translations into web components. Replace hard-coded strings with translation key lookups. Support variable interpolation (e.g., price).

## Objectives
- Replace hard-coded strings with lookups
- Implement translation function
- Support variable interpolation
- Update all components
- Handle missing translations

## Acceptance Criteria
- ✅ All hard-coded strings replaced
- ✅ Translation function t(key, vars?) works
- ✅ Variable interpolation works (e.g., {price})
- ✅ Components use translations
- ✅ Missing translations show key
- ✅ 90%+ test coverage

## Translation Function
```typescript
function t(key: TranslationKey, variables?: Record<string, string>): string {
  const translations = configService.getTranslations();
  let text = translations[key] || defaultTranslations[key] || key;
  
  if (variables) {
    Object.entries(variables).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
  }
  
  return text;
}
```

## Usage in Components
```typescript
render() {
  return html`
    <h2>${t('widget.title')}</h2>
    <p>${t('widget.description', { price: '$4.99' })}</p>
  `;
}
```

## Testing Strategy
- Test translation lookup
- Test variable interpolation
- Test fallback to defaults
- Test missing key handling

## Dependencies
- Translation keys (task 1.5.2)
- Config service (task 1.5.1)
- Web components (story 0.7)

