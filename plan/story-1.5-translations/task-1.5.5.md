# Task 1.5.5: Multi-Locale Testing

## Description
Create comprehensive tests for translations across multiple locales. Test en-US, es-ES, and fr-FR to ensure translation system works correctly.

## Objectives
- Create test translations for 3 locales
- Test English (en-US)
- Test Spanish (es-ES)
- Test French (fr-FR)
- Test fallback behavior
- Test variable interpolation in all locales

## Acceptance Criteria
- ✅ en-US translations tested
- ✅ es-ES translations tested
- ✅ fr-FR translations tested
- ✅ Fallback tested for each
- ✅ Variable interpolation tested
- ✅ Components render correctly in all locales
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Test Translations
**English (en-US):**
- widget.title: "Protect your purchase"
- widget.description: "Add protection for just {price}"

**Spanish (es-ES):**
- widget.title: "Protege tu compra"
- widget.description: "Añade protección por solo {price}"

**French (fr-FR):**
- widget.title: "Protégez votre achat"
- widget.description: "Ajoutez une protection pour seulement {price}"

## Testing Strategy
- Test component renders with each locale
- Test translation lookup for each locale
- Test fallback for missing keys
- Test variable interpolation
- Test locale switching

## Dependencies
- Translation integration (task 1.5.3)
- Locale fallback (task 1.5.4)
- Web components (story 0.7)

