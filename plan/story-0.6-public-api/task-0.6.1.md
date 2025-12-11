# Task 0.6.1: Loader Stub

## Description
Create a tiny (<2KB) loader stub that gets embedded in retailer pages. The stub queues method calls before the SDK loads and replays them once ready. Uses Proxy pattern for clean method interception.

## Objectives
- Create minimal loader script
- Queue method calls before SDK ready
- Use Proxy for method interception
- Handle _failed flag for load errors
- Keep size under 2KB minified

## Acceptance Criteria
- ✅ Loader script <2KB minified
- ✅ Queues calls to init(), render(), on(), off()
- ✅ Replays queue once SDK loads
- ✅ Handles script load failures
- ✅ Sets window.Narvar.Secure namespace
- ✅ No dependencies required

## Loader Structure
```
window.Narvar = window.Narvar || {};
window.Narvar.Secure = <Proxy that queues calls>
<async load main SDK script>
<on load: replay queue>
```

## Testing Strategy
- Test queues calls before SDK loads
- Test replays queue after load
- Test handles load failures
- Test size is under 2KB
- Test works in all supported browsers

## Dependencies
None (standalone script)

