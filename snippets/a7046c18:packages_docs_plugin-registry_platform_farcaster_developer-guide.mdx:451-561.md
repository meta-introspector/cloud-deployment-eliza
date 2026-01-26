# a7046c18:packages_docs_plugin-registry_platform_farcaster_developer-guide.mdx:451-561

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/farcaster/developer-guide.mdx:451-561
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

### Key Management
- Store API keys and signer UUIDs securely using environment variables
- Never commit credentials to version control
- Use separate Neynar API keys for development and production
- Create separate signers for different environments

### Rate Limiting
- Implement exponential backoff for API requests
- Respect hub rate limits (typically 100 req/min)
- Cache frequently accessed data

### Content Validation
- Validate cast length (max 320 characters)
- Sanitize user inputs
- Verify message signatures

## Performance Optimization

### AsyncQueue Implementation
The plugin uses an async queue to prevent rate limiting:
```typescript
// Queue processes operations with concurrency control
const asyncQueue = new AsyncQueue(1); // Single concurrency
await asyncQueue.push(() => processInteraction(cast));
```

### Polling Optimization
```typescript
// Configurable polling intervals to balance responsiveness
FARCASTER_POLL_INTERVAL=2  // Minutes between polls
ACTION_INTERVAL=5           // Minutes between action processing
MAX_ACTIONS_PROCESSING=1    // Actions per cycle
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify mnemonic is correct
   - Ensure FID matches the mnemonic
   - Check hub connectivity

2. **Rate Limiting**
   - Implement retry logic with backoff
   - Use caching to reduce API calls
   - Monitor rate limit headers

3. **Message Validation Failures**
   - Verify timestamp is within valid range
   - Ensure proper message formatting
   - Check signature validity

### Debug Mode

Enable debug logging:

```env
FARCASTER_DEBUG=true
LOG_LEVEL=debug
```

## Best Practices

1. **Content Strategy**
   - Keep casts concise and engaging
   - Use channels appropriately
   - Maintain consistent voice

2. **Engagement Guidelines**
   - Don't spam or over-engage
   - Respect community norms
   - Build genuine connections

3. **Technical Implementation**
   - Handle errors gracefully
   - Implement proper retry logic
   - Monitor performance metrics

## Migration Guide

### From v1 to v2

```typescript
// v1
import { FarcasterPlugin } from "@elizaos/plugin-farcaster";

// v2
import { farcasterPlugin } from "@elizaos/plugin-farcaster";

// Configuration changes
// v1: Plugin initialized with options
const plugin = new FarcasterPlugin(options);

// v2: Configuration via environment and character
const character = {
  plugins: [farcasterPlugin],
  settings: { farcaster: options }
};
```

## Support

- **GitHub**: [elizaos-plugins/plugin-farcaster](https://github.com/elizaos-plugins/plugin-farcaster)
- **Discord**: Join the elizaOS community
- **Documentation**: [elizaos.ai/docs](https://elizaos.ai/docs)

## License

MIT License - see LICENSE file for details
```