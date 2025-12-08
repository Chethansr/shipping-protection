# Story 0.1: Foundation & Build Infrastructure

## Overview
Establish the core build infrastructure, TypeScript configuration, and foundational utilities for shipping-protection.js. This story focuses on creating a robust, type-safe foundation with proper error handling patterns using Result types, safe wrappers for common operations, and self-contained utility functions.

## Description
This story implements the essential scaffolding needed for SDK development including modern build tooling (Vite) with CSP compliance, TypeScript configuration with strict type checking, Result type system for explicit error handling, safe wrappers for JSON parsing, network requests, and storage operations, self-contained utility functions with no external runtime dependencies, and a "Hello World" component to verify the entire pipeline.

## Goals
- Zero runtime dependencies for core utilities
- Type-safe error handling via Result<T, E> pattern
- CSP-compliant build output (no eval, inline scripts)
- Baseline bundle size metrics established
- 90%+ test coverage from day one

## Acceptance Criteria
- ✅ Build produces IIFE bundle compatible with CSP policies
- ✅ TypeScript compiles with strict mode enabled
- ✅ Result type system works with full type inference
- ✅ Safe wrappers handle all error cases gracefully
- ✅ Storage utilities work with localStorage/sessionStorage
- ✅ Hello World component renders in browser
- ✅ 90%+ code coverage achieved
- ✅ No source maps in production bundle
- ✅ Bundle size baseline established with size-limit
- ✅ CSP test page validates compliance

## Tasks
- [Task 0.1.1](./task-0.1.1.md) - Project scaffolding
- [Task 0.1.2](./task-0.1.2.md) - Result type system
- [Task 0.1.3](./task-0.1.3.md) - Safe wrappers
- [Task 0.1.4](./task-0.1.4.md) - Self-contained utilities
- [Task 0.1.5](./task-0.1.5.md) - Hello World component

## Dependencies
None (foundation story)

## Technical Notes
- Use Vite for fast development and optimized production builds
- Prefer functional factories over classes for better tree-shaking
- All utilities must be pure functions where possible
- Result types prevent throwing exceptions in core logic
