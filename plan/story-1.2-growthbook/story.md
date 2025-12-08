# Story 1.2: Growthbook Service

## Overview
Implement Growthbook integration for feature flags and A/B experiments. Enable dynamic feature control and variant testing without code deployments.

## Description
This story creates the Growthbook service factory with SDK integration, feature loading with initialization timeout, getFeatures() accessor for coordinator and components, setExperiment() public API method, and component integration where features control variant rendering.

## Goals
- Dynamic feature flag control
- A/B experiment support
- Fast feature evaluation
- Type-safe feature access
- setExperiment() API for forced variants

## Acceptance Criteria
- ✅ Growthbook SDK integrated
- ✅ Features load with timeout
- ✅ getFeatures() returns evaluated features
- ✅ Experiments tracked in analytics
- ✅ Components react to feature flags
- ✅ setExperiment() forces variant assignment
- ✅ Handles Growthbook API failures gracefully
- ✅ 90%+ test coverage

## Tasks
- [Task 1.2.1](./task-1.2.1.md) - Growthbook service factory
- [Task 1.2.2](./task-1.2.2.md) - Feature loading
- [Task 1.2.3](./task-1.2.3.md) - getFeatures() accessor
- [Task 1.2.4](./task-1.2.4.md) - setExperiment() API
- [Task 1.2.5](./task-1.2.5.md) - Component integration

## Dependencies
- Story 0.5 (Coordinator)
- Story 0.7 (Web components)
- Story 1.1 (Analytics for experiment tracking)

## Technical Notes
- Features cached for session
- Experiments tracked to analytics
- Gradual rollout support
- Targeting rules support

