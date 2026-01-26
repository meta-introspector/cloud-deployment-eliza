# a7046c18:packages_docs_plugin-registry_defi_evm_complete-documentation.mdx:301-440

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/defi/evm/complete-documentation.mdx:301-440
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    throw new Error(`Token ${symbol} not found on chain ${chainId}`);
  }
  
  return token.address;
}
```

## Governance Implementation

The plugin includes comprehensive DAO governance support:

```typescript
// Propose Action
export const proposeAction: Action = {
  name: 'EVM_GOV_PROPOSE',
  description: 'Create a governance proposal',
  
  handler: async (runtime, message, state, options, callback) => {
    const params = await extractProposalParams(runtime, message, state);
    
    const governorContract = getGovernorContract(params.chain);
    
    const tx = await governorContract.propose(
      params.targets,
      params.values,
      params.calldatas,
      params.description
    );
    
    callback?.({
      text: `Created proposal: ${params.description}`,
      content: { hash: tx.hash }
    });
  }
};

// Vote Action
export const voteAction: Action = {
  name: 'EVM_GOV_VOTE',
  description: 'Vote on a governance proposal',
  
  handler: async (runtime, message, state, options, callback) => {
    const params = await extractVoteParams(runtime, message, state);
    
    const voteValue = {
      'for': 1,
      'against': 0,
      'abstain': 2
    }[params.support.toLowerCase()];
    
    const tx = await governorContract.castVote(
      params.proposalId,
      voteValue
    );
    
    callback?.({
      text: `Voted ${params.support} on proposal ${params.proposalId}`,
      content: { hash: tx.hash }
    });
  }
};
```

## Error Handling

Comprehensive error handling for common scenarios:

```typescript
export async function handleTransactionError(
  error: any,
  context: string
): Promise<void> {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    throw new Error(`Insufficient funds for ${context}`);
  }
  
  if (error.code === 'NONCE_TOO_LOW') {
    // Handle nonce issues
    await resetNonce();
    throw new Error('Transaction nonce issue, please retry');
  }
  
  if (error.message?.includes('gas required exceeds allowance')) {
    throw new Error(`Gas estimation failed for ${context}`);
  }
  
  // Log unknown errors
  logger.error(`Unknown error in ${context}:`, error);
  throw new Error(`Transaction failed: ${error.message}`);
}
```

## Testing

The plugin includes comprehensive test coverage:

```typescript
describe('EVM Transfer Action', () => {
  it('should transfer native tokens', async () => {
    const runtime = await createTestRuntime();
    const message = createMessage('Send 0.1 ETH to 0x123...');
    
    const result = await transferAction.handler(
      runtime,
      message,
      state,
      {},
      callback
    );
    
    expect(result).toBe(true);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Transferred 0.1 ETH')
      })
    );
  });
});
```

## Best Practices

1. **Always validate addresses** before executing transactions
2. **Use gas buffers** (typically 20%) for reliable execution
3. **Implement retry logic** for network failures
4. **Cache frequently accessed data** to reduce RPC calls
5. **Use simulation** before executing expensive operations
6. **Monitor gas prices** and adjust limits accordingly
7. **Handle slippage** appropriately for swaps
8. **Validate token approvals** before transfers

## Troubleshooting

Common issues and solutions:

- **"Insufficient funds"**: Check wallet balance includes gas costs
- **"Invalid address"**: Ensure address is checksummed correctly
- **"Gas estimation failed"**: Try with a fixed gas limit
- **"Nonce too low"**: Reset nonce or wait for pending transactions
- **"Network error"**: Check RPC endpoint availability
```