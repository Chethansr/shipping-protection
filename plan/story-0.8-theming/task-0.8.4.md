# Task 0.8.4: Retailer Theme Override Support

## Description
Enable retailers to override default theme values by providing their own CSS custom properties in the NarvarShippingProtectionRetailer layer. Document the customization process.

## Objectives
- Document how to override variables
- Provide example retailer stylesheet
- Test variable overrides work
- Create customization guide
- Ensure partial overrides work

## Acceptance Criteria
- ✅ Retailers can override any variable
- ✅ Overrides placed in NarvarShippingProtectionRetailer layer
- ✅ Partial overrides work (some variables, not all)
- ✅ Example stylesheet provided
- ✅ Customization guide documented
- ✅ Overrides don't break layout

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Override Pattern
```css
@layer NarvarShippingProtectionRetailer {
  :root {
    --narvar-shipping-protection-primary-color: #ff6600;
    --narvar-shipping-protection-font-family: 'Custom Font', sans-serif;
  }
}
```

## Customization Guide Topics
- How to override colors
- How to override typography
- How to override spacing
- How to override borders/shadows
- Complete list of available variables

## Testing Strategy
- Test variable overrides apply
- Test partial overrides work
- Test layer priority
- Test with example retailer themes

## Dependencies
- CSS layers (task 0.8.1)
- CSS custom properties (task 0.8.2)
- Default theme (task 0.8.3)

