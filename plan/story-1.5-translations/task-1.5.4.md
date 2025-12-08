# Task 1.5.4: Locale Fallback

## Description
Implement locale fallback mechanism. If a translation is missing for the requested locale, fall back to English (en-US).

## Objectives
- Implement fallback chain
- Primary: requested locale
- Fallback: en-US
- Handle partial translations
- Log missing translations

## Acceptance Criteria
- ✅ Missing translations fall back to en-US
- ✅ Partial translations supported (some keys translated, others fallback)
- ✅ Fallback chain: locale → en-US → key
- ✅ Missing translations logged (debug mode)
- ✅ No rendering errors on missing translations
- ✅ 100% test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Fallback Flow
1. Check requested locale translations
2. If key found: return translation
3. If key not found: check en-US translations
4. If key found: return English translation
5. If still not found: return key itself
6. Log missing translation (debug mode)

## Testing Strategy
- Test fallback to English
- Test partial translations
- Test missing key returns key
- Test logging in debug mode

## Dependencies
- Translation integration (task 1.5.3)
- Config service (task 1.5.1)
- Default translations (task 1.5.2)

