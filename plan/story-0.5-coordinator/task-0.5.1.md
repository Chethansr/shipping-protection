# Task 0.5.1: Coordinator Factory

## Description
Create the Coordinator factory function that initializes and connects all SDK subsystems. The Coordinator manages service instances, state machine, and event bus, providing a unified interface for SDK operations.

## Objectives
- Implement Coordinator factory function
- Bootstrap all services (Config, QuoteCalculator)
- Initialize state machine
- Create event bus
- Provide initialization method

## Acceptance Criteria
- ✅ Factory creates Coordinator instance
- ✅ Initializes all required services
- ✅ Connects state machine
- ✅ Sets up event bus
- ✅ init() method bootstraps SDK
- ✅ Returns Result from init()
- ✅ 90%+ test coverage

## Implementation Notes
Suggested code snippets and implementation examples can be found at:
https://github.com/niccai/secure-sdk-plan

## Coordinator Interface
```typescript
interface Coordinator {
  init(config: SecureConfig): Promise<Result<void, WidgetError>>;
  getState(): WidgetState;
  dispatch(action: StateAction): void;
  calculateQuote(cart: CartData): Promise<Result<Quote, WidgetError>>;
  selectProtection(quoteId: string): void;
  declineProtection(): void;
  destroy(): void;
}
```

## Testing Strategy
- Test factory creates coordinator
- Test init() bootstraps services
- Test init() handles config errors
- Test init() emits ready event
- Test services are accessible after init

## Dependencies
- Config service (task 0.4.1)
- QuoteCalculator (task 0.4.2)
- State machine (task 0.3.1)
- Event bus (task 0.3.3)

