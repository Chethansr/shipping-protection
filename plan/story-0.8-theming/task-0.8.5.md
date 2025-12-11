# Task 0.8.5: Theme Override Testing

## Description
Create comprehensive tests for theme override functionality. Test multiple retailer themes, partial overrides, and edge cases.

## Objectives
- Create test retailer themes
- Test full theme override
- Test partial theme override
- Test invalid values handled
- Test cascade order
- Test Shadow DOM inheritance

## Acceptance Criteria
- ✅ Full override test passes
- ✅ Partial override test passes
- ✅ Invalid values fallback to defaults
- ✅ Layer cascade works correctly
- ✅ Variables inherit into Shadow DOM
- ✅ Multiple themes tested
- ✅ 90%+ test coverage

## Test Themes
1. **Brand A**: Orange primary, custom font
2. **Brand B**: Green primary, larger spacing
3. **Brand C**: Dark mode colors
4. **Partial**: Only override primary color

## Testing Strategy
- Test each test theme applies correctly
- Test layer priority enforced
- Test fallback to defaults
- Test no layout breaks
- Test contrast ratios maintained

## Dependencies
- Default theme (task 0.8.3)
- Retailer override support (task 0.8.4)
- Web component (story 0.7)

