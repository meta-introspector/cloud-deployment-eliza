# a7046c18:packages_docs_plugin-registry_platform_twitter_developer-guide.mdx:901-950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/developer-guide.mdx:901-950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    if (this.processedTweets.size > this.maxProcessedTweets) {
      const toRemove = this.processedTweets.size - this.maxProcessedTweets;
      const iterator = this.processedTweets.values();
      
      for (let i = 0; i < toRemove; i++) {
        this.processedTweets.delete(iterator.next().value);
      }
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }
}
```

## Best Practices

1. **Authentication**
   - Always use OAuth 1.0a for user context
   - Store credentials securely
   - Regenerate tokens after permission changes

2. **Rate Limiting**
   - Implement proper backoff strategies
   - Cache frequently accessed data
   - Use batch endpoints when possible

3. **Content Generation**
   - Provide diverse postExamples
   - Vary posting times with variance
   - Monitor engagement metrics

4. **Error Handling**
   - Log all errors with context
   - Implement graceful degradation
   - Notify on critical failures

5. **Performance**
   - Use appropriate timeline algorithms
   - Implement efficient caching
   - Monitor memory usage

## Support

For issues and questions:
- 📚 Check the [examples](/plugin-registry/platform/twitter/examples)
- 💬 Join our [Discord community](https://discord.com/invite/ai16z)
- 🐛 Report issues on [GitHub](https://github.com/elizaos-plugins/plugin-twitter/issues)
```