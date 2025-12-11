# Task 1.1.3: Track Function with Batching

## Description
Implement the track() function that batches analytics events and sends them using the Beacon API. Use TIMEOUTS.BATCH_FLUSH for batch timing.

## Objectives
- Implement track(eventName, properties) function
- Batch events in memory
- Flush batch after TIMEOUTS.BATCH_FLUSH
- Use Beacon API for sending
- Handle page unload (flush immediately)
- Handle batch size limits

## Acceptance Criteria
- ✅ track() adds events to batch
- ✅ Batch flushes after TIMEOUTS.BATCH_FLUSH (2s)
- ✅ Beacon API sends batched events
- ✅ Page unload triggers immediate flush
- ✅ Large batches split automatically
- ✅ Network errors handled gracefully
- ✅ 90%+ test coverage

## Beacon API Usage
```javascript
navigator.sendBeacon(url, JSON.stringify(events));
```

## Testing Strategy
- Test event batching
- Test batch flush after timeout
- Test immediate flush on unload
- Test batch size limits
- Test Beacon API calls

## Dependencies
- Identity management (task 1.1.2)
- Constants TIMEOUTS.BATCH_FLUSH (task 0.1.4)

