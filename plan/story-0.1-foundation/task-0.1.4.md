# Task 0.1.4: Self-Contained Utilities

## Description
Create self-contained utility functions for common operations: storage helpers for localStorage/sessionStorage, and a centralized constants file for timeouts and configuration values. All utilities must have no external runtime dependencies.

## Objectives
- Create storage helpers with Result return types
- Implement getItem, setItem, removeItem for both storage types
- Handle storage quota exceeded errors
- Define all timeout constants in one place
- Keep utilities pure and testable

## Acceptance Criteria
- ✅ Storage helpers work with localStorage and sessionStorage
- ✅ All storage operations return Result types
- ✅ Quota exceeded errors are handled gracefully
- ✅ Constants file defines all timeout values
- ✅ No external runtime dependencies
- ✅ 100% test coverage with mocked storage
- ✅ TypeScript types are fully inferred

## Testing Strategy
- Test setStorageItem and getStorageItem roundtrip
- Test getStorageItem returns null for missing keys
- Test quota exceeded error handling
- Test sessionStorage vs localStorage
- Mock storage APIs for testing

## Dependencies
- Result type system (task 0.1.2)
- Safe JSON wrappers (task 0.1.3)
