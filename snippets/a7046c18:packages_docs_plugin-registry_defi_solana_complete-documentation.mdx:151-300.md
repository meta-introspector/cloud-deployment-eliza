# a7046c18:packages_docs_plugin-registry_defi_solana_complete-documentation.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/defi/solana/complete-documentation.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const quote = await getJupiterQuote({
      inputMint: params.fromToken,
      outputMint: params.toToken,
      amount: params.amount,
      slippageBps: params.slippage * 100 // Convert to basis points
    });
    
    // Execute swap
    const result = await executeJupiterSwap(
      service.connection,
      service.wallet,
      quote
    );
    
    callback?.({
      text: `Swapped ${params.fromAmount} ${params.fromSymbol} for ${formatAmount(quote.outAmount)} ${params.toSymbol}`,
      content: {
        success: true,
        signature: result.signature,
        fromAmount: params.fromAmount,
        toAmount: formatAmount(quote.outAmount),
        route: quote.routePlan
      }
    });
  }
};
```

### Providers

#### Wallet Provider

Supplies comprehensive wallet and portfolio data:

```typescript
export const walletProvider: Provider = {
  name: 'solana-wallet',
  description: 'Provides Solana wallet information and portfolio data',
  
  get: async (runtime: IAgentRuntime, message?: Memory, state?: State) => {
    const service = runtime.getService<SolanaService>('solana-service');
    const portfolioData = await service.getCachedPortfolioData();
    
    if (!portfolioData) {
      return 'Wallet data unavailable';
    }
    
    // Format portfolio for AI context
    const summary = formatPortfolioSummary(portfolioData);
    const tokenList = formatTokenBalances(portfolioData.tokens);
    
    return `Solana Wallet Portfolio:
Total Value: $${portfolioData.totalUsd.toFixed(2)} (${portfolioData.totalSol.toFixed(4)} SOL)

Token Balances:
${tokenList}

SOL Price: $${portfolioData.solPrice.toFixed(2)}
Last Updated: ${new Date(portfolioData.lastUpdated).toLocaleString()}`;
  }
};
```

### Templates

AI prompt templates for natural language understanding:

```typescript
export const transferTemplate = `Given the recent messages:
{{recentMessages}}

And wallet information:
{{walletInfo}}

Extract the following for a Solana transfer:
- Amount to send (number only)
- Token to send (SOL or token symbol/address)
- Recipient address or domain

Respond with:
<response>
  <amount>string</amount>
  <token>string</token>
  <recipient>string</recipient>
</response>`;

export const swapTemplate = `Given the swap request:
{{recentMessages}}

And available tokens:
{{walletInfo}}

Extract swap details:
- Input token (symbol or address)
- Input amount (or "all" for max)
- Output token (symbol or address)
- Slippage tolerance (percentage, default 1%)

<response>
  <inputToken>string</inputToken>
  <inputAmount>string</inputAmount>
  <outputToken>string</outputToken>
  <slippage>number</slippage>
</response>`;
```

## Advanced Features

### Keypair Management

The plugin supports multiple key formats and secure handling:

```typescript
export async function loadKeypair(privateKey: string): Promise<Keypair> {
  try {
    // Try base58 format first
    const decoded = bs58.decode(privateKey);
    if (decoded.length === 64) {
      return Keypair.fromSecretKey(decoded);
    }
  } catch (e) {
    // Not base58, try base64
  }

  try {
    // Try base64 format
    const decoded = Buffer.from(privateKey, 'base64');
    if (decoded.length === 64) {
      return Keypair.fromSecretKey(decoded);
    }
  } catch (e) {
    // Not base64
  }

  // Try JSON format (Solana CLI)
  try {
    const parsed = JSON.parse(privateKey);
    if (Array.isArray(parsed)) {
      return Keypair.fromSecretKey(Uint8Array.from(parsed));
    }
  } catch (e) {
    // Not JSON
  }

  throw new Error('Invalid private key format');
}
```

### WebSocket Subscriptions

```