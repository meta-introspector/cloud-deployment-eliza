# a7046c18:packages_docs_plugin-registry_platform_discord_testing-guide.mdx:601-690

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/testing-guide.mdx:601-690
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

// Global test utilities
global.createMockRuntime = () => ({
  processMessage: vi.fn(),
  character: { name: 'TestBot' },
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  },
  getSetting: vi.fn((key) => process.env[key]),
  getService: vi.fn()
});

// Cleanup after tests
afterAll(async () => {
  // Close all connections
  await cleanup();
});
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Discord Plugin Tests

on:
  push:
    paths:
      - 'packages/plugin-discord/**'
  pull_request:
    paths:
      - 'packages/plugin-discord/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 20
        
    - name: Install dependencies
      run: bun install
      
    - name: Run unit tests
      run: bun test packages/plugin-discord --coverage
      env:
        DISCORD_API_TOKEN: ${{ secrets.TEST_DISCORD_TOKEN }}
        DISCORD_APPLICATION_ID: ${{ secrets.TEST_DISCORD_APP_ID }}
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
```

## Best Practices

1. **Test Isolation**
   - Each test should be independent
   - Clean up resources after tests
   - Use separate test channels/servers

2. **Mock External Services**
   - Mock Discord API calls for unit tests
   - Use real Discord for integration tests only
   - Mock transcription/vision services

3. **Error Scenarios**
   - Test network failures
   - Test permission errors
   - Test rate limiting

4. **Performance Monitoring**
   - Track response times
   - Monitor memory usage
   - Check for connection stability

5. **Security Testing**
   - Test token validation
   - Test permission checks
   - Test input sanitization
```