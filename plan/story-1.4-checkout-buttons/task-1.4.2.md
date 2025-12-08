# Task 1.4.2: Button Variants

## Description
Implement the two button variants: checkout-with-protection and checkout-without-protection. Each button should clearly communicate its purpose and show appropriate pricing.

## Objectives
- Implement checkout-with-protection button
- Implement checkout-without-protection button
- Display protection price on with-protection button
- Style buttons appropriately
- Ensure accessibility

## Acceptance Criteria
- ✅ With-protection button shows total with protection
- ✅ Without-protection button shows original total
- ✅ Buttons clearly differentiated
- ✅ Protection price displayed
- ✅ Both buttons keyboard accessible
- ✅ Styles match theme
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Button Content
**With Protection:**
- "Checkout with Protection"
- "$X.XX + $Y.YY protection"
- Total: $Z.ZZ

**Without Protection:**
- "Checkout without Protection"
- Total: $X.XX

## Testing Strategy
- Test both buttons render
- Test price display
- Test keyboard accessibility
- Test styling

## Dependencies
- Base component (task 1.4.1)
- Theming system (story 0.8)

