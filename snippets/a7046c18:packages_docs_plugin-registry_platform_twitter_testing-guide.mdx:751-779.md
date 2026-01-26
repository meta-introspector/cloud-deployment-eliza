# a7046c18:packages_docs_plugin-registry_platform_twitter_testing-guide.mdx:751-779

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/testing-guide.mdx:751-779
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## Best Practices

1. **Always Use Dry Run**
   - Set `TWITTER_DRY_RUN=true` for all tests
   - Never post real tweets in tests
   - Mock API responses

2. **Test Rate Limiting**
   - Simulate 429 errors
   - Test retry logic
   - Verify queue behavior

3. **Mock External Calls**
   - Mock Twitter API
   - Mock LLM generation
   - Control test data

4. **Test Edge Cases**
   - Empty timelines
   - Malformed tweets
   - Network failures
   - Auth errors

5. **Performance Testing**
   - Monitor memory usage
   - Test with large datasets
   - Measure processing times
```