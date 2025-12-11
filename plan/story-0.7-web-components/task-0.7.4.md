# Task 0.7.4: User Interaction Handlers

## Description
Implement event handlers for user interactions with the widget. Handle clicks, keyboard events, and emit appropriate commands to the Coordinator.

## Objectives
- Handle click events on toggle/checkbox
- Handle keyboard events (Space, Enter)
- Emit add-protection on selection
- Emit remove-protection on deselection
- Prevent default behavior appropriately
- Handle disabled state

## Acceptance Criteria
- ✅ Click toggles selection
- ✅ Space key toggles selection
- ✅ Enter key toggles selection
- ✅ Tab navigation works correctly
- ✅ Calls coordinator.selectProtection() on select
- ✅ Calls coordinator.declineProtection() on deselect
- ✅ Disabled state prevents interactions
- ✅ 90%+ test coverage

## Keyboard Interactions
- **Tab**: Focus widget
- **Space**: Toggle selection
- **Enter**: Toggle selection
- **Esc**: No action in MVP

## Testing Strategy
- Test click handler
- Test Space key handler
- Test Enter key handler
- Test Tab navigation
- Test disabled state
- Test coordinator methods called

## Dependencies
- Base component (task 0.7.1)
- Coordinator (task 0.5.4)
- Event definitions (task 0.3.4)

