# Task 0.7.1: narvar-shipping-protection-widget Base Structure

## Description
Create the base Lit component structure for `narvar-shipping-protection-widget`. Set up Shadow DOM (`mode: open`), define component properties, and create the basic template structure.

## Objectives
- Create Lit component class
- Configure Shadow DOM (mode: open)
- Define component properties
- Create base template
- Register custom element

## Acceptance Criteria
- ✅ Component extends LitElement
- ✅ Shadow DOM mode set to 'open'
- ✅ Properties defined with decorators
- ✅ Base template renders
- ✅ Custom element registered as `narvar-shipping-protection-widget`
- ✅ Coordinator prop available for state subscriptions
- ✅ TypeScript types declared
- ✅ 100% test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Component Properties
- `variant`: 'toggle' | 'checkbox'
- `quote`: Quote | null
- `isSelected`: boolean
- `isLoading`: boolean
- `error`: WidgetError | null

## Testing Strategy
- Test component renders
- Test Shadow DOM created
- Test properties update component
- Test custom element registered

## Dependencies
- Lit library
- Quote types (task 0.3.2)
- WidgetError types (task 0.2.1)

