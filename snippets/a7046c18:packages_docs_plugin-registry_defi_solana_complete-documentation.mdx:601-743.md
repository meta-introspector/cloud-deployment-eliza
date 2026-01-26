# a7046c18:packages_docs_plugin-registry_defi_solana_complete-documentation.mdx:601-743

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/defi/solana/complete-documentation.mdx:601-743
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    maxAttempts = 3,
    delay = 1000,
    backoff = 2,
    onError
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      onError?.(error, attempt);

      if (attempt < maxAttempts) {
        const waitTime = delay * Math.pow(backoff, attempt - 1);
        elizaLogger.warn(`Attempt ${attempt} failed, retrying in ${waitTime}ms`, {
          error: error.message
        });
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

// Usage
const result = await withRetry(
  () => connection.sendTransaction(transaction),
  {
    maxAttempts: 3,
    onError: (error, attempt) => {
      if (error.message.includes('blockhash not found')) {
        // Refresh blockhash
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      }
    }
  }
);
```

### Performance Optimizations

#### Connection Pooling

```typescript
class ConnectionPool {
  private connections: Connection[] = [];
  private currentIndex = 0;

  constructor(rpcUrls: string[], config?: ConnectionConfig) {
    this.connections = rpcUrls.map(url => new Connection(url, config));
  }

  getConnection(): Connection {
    const connection = this.connections[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.connections.length;
    return connection;
  }

  async healthCheck(): Promise<void> {
    const checks = this.connections.map(async (conn, index) => {
      try {
        await conn.getVersion();
        return { index, healthy: true };
      } catch (error) {
        return { index, healthy: false, error };
      }
    });

    const results = await Promise.all(checks);
    const unhealthy = results.filter(r => !r.healthy);
    
    if (unhealthy.length > 0) {
      elizaLogger.warn('Unhealthy connections:', unhealthy);
    }
  }
}
```

#### Batch Operations

```typescript
async function batchGetMultipleAccounts(
  connection: Connection,
  publicKeys: PublicKey[]
): Promise<(AccountInfo<Buffer> | null)[]> {
  const BATCH_SIZE = 100;
  const results: (AccountInfo<Buffer> | null)[] = [];

  for (let i = 0; i < publicKeys.length; i += BATCH_SIZE) {
    const batch = publicKeys.slice(i, i + BATCH_SIZE);
    const batchResults = await connection.getMultipleAccountsInfo(batch);
    results.push(...batchResults);
  }

  return results;
}
```

## Security Considerations

1. **Private Key Security**
   - Never log or expose private keys
   - Support multiple secure key formats
   - Use environment variables only

2. **Transaction Validation**
   - Always simulate before sending
   - Verify recipient addresses
   - Check token mint addresses

3. **Slippage Protection**
   - Default 1% slippage
   - Maximum 5% slippage
   - User confirmation for high slippage

4. **Rate Limiting**
   - Implement request throttling
   - Cache frequently accessed data
   - Use WebSocket for real-time data

## Monitoring & Logging

The plugin provides detailed logging for debugging and monitoring:

```typescript
// Transaction lifecycle
elizaLogger.info('Transfer initiated', { amount, token, recipient });
elizaLogger.debug('Transaction built', { instructions: tx.instructions.length });
elizaLogger.info('Transaction sent', { signature });
elizaLogger.info('Transaction confirmed', { signature, slot });

// Performance metrics
elizaLogger.debug('RPC latency', { method, duration });
elizaLogger.debug('Cache hit rate', { hits, misses, ratio });

// Error tracking
elizaLogger.error('Transaction failed', { error, context });
elizaLogger.warn('Retry attempt', { attempt, maxAttempts });
```
```