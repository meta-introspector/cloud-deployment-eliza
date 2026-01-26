# a7046c18:packages_docs_plugin-registry_defi_solana_complete-documentation.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/defi/solana/complete-documentation.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        senderAta,
        recipientAta,
        sender,
        amount * Math.pow(10, await getTokenDecimals(connection, mint))
      )
    );
  }

  // Get latest blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = sender;

  return transaction;
}
```

### Token Resolution

Intelligent token symbol to mint address resolution:

```typescript
async function resolveTokenMint(
  connection: Connection,
  tokenIdentifier: string
): Promise<PublicKey> {
  // Check if it's already a valid public key
  try {
    const pubkey = new PublicKey(tokenIdentifier);
    // Verify it's a token mint
    const accountInfo = await connection.getAccountInfo(pubkey);
    if (accountInfo?.owner.equals(TOKEN_PROGRAM_ID)) {
      return pubkey;
    }
  } catch (e) {
    // Not a valid public key, continue
  }

  // Common token mappings
  const commonTokens: Record<string, string> = {
    'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    'USDT': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    'BONK': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    'RAY': '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    'JTO': 'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL',
    // Add more as needed
  };

  const upperToken = tokenIdentifier.toUpperCase();
  if (commonTokens[upperToken]) {
    return new PublicKey(commonTokens[upperToken]);
  }

  // Try to fetch from token list or registry
  throw new Error(`Unknown token: ${tokenIdentifier}`);
}
```

### Jupiter Integration

Advanced swap execution with route optimization:

```typescript
interface JupiterSwapParams {
  inputMint: PublicKey;
  outputMint: PublicKey;
  amount: number;
  slippageBps: number;
  userPublicKey: PublicKey;
}

async function getJupiterQuote(params: JupiterSwapParams): Promise<QuoteResponse> {
  const url = new URL('https://quote-api.jup.ag/v6/quote');
  url.searchParams.append('inputMint', params.inputMint.toBase58());
  url.searchParams.append('outputMint', params.outputMint.toBase58());
  url.searchParams.append('amount', params.amount.toString());
  url.searchParams.append('slippageBps', params.slippageBps.toString());
  url.searchParams.append('onlyDirectRoutes', 'false');
  url.searchParams.append('asLegacyTransaction', 'false');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Jupiter quote failed: ${response.statusText}`);
  }

  return response.json();
}

async function executeJupiterSwap(
  connection: Connection,
  wallet: Wallet,
  quote: QuoteResponse
): Promise<{ signature: string }> {
  // Get serialized transaction from Jupiter
  const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey: wallet.publicKey.toBase58(),
      wrapAndUnwrapSol: true,
      prioritizationFeeLamports: 'auto'
    })
  });

  const { swapTransaction } = await swapResponse.json();
  
  // Deserialize and sign
  const transaction = VersionedTransaction.deserialize(
    Buffer.from(swapTransaction, 'base64')
  );
  transaction.sign([wallet.payer]);

  // Send with confirmation
  const signature = await connection.sendTransaction(transaction, {
    skipPreflight: false,
    maxRetries: 3
  });

  // Wait for confirmation
  const confirmation = await connection.confirmTransaction({
    signature,
    blockhash: transaction.message.recentBlockhash,
    lastValidBlockHeight: transaction.message.lastValidBlockHeight
  });

  if (confirmation.value.err) {
    throw new Error(`Swap failed: ${confirmation.value.err}`);
  }

  return { signature };
}
```

### Error Handling

Comprehensive error handling with retry logic:

```typescript
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
    onError?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const {
```