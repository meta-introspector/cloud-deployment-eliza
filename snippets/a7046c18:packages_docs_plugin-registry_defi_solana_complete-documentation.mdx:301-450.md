# a7046c18:packages_docs_plugin-registry_defi_solana_complete-documentation.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/defi/solana/complete-documentation.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Real-time account monitoring for instant updates:

```typescript
private setupAccountSubscriptions(): void {
  if (!this.keypair) return;

  // Subscribe to account changes
  const accountSub = this.connection.onAccountChange(
    this.keypair.publicKey,
    (accountInfo) => {
      elizaLogger.info('Account balance changed:', {
        lamports: accountInfo.lamports,
        sol: accountInfo.lamports / LAMPORTS_PER_SOL
      });
      
      // Trigger portfolio refresh
      this.fetchPortfolioData();
    },
    'confirmed'
  );
  
  this.subscriptions.push(accountSub);

  // Subscribe to token accounts
  this.subscribeToTokenAccounts();
}

private async subscribeToTokenAccounts(): Promise<void> {
  const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
    this.keypair.publicKey,
    { programId: TOKEN_PROGRAM_ID }
  );

  tokenAccounts.value.forEach(({ pubkey }) => {
    const sub = this.connection.onAccountChange(
      pubkey,
      () => {
        elizaLogger.info('Token balance changed');
        this.fetchPortfolioData();
      },
      'confirmed'
    );
    
    this.subscriptions.push(sub);
  });
}
```

### Portfolio Data Management

Efficient caching and data fetching:

```typescript
interface PortfolioData {
  totalUsd: number;
  totalSol: number;
  solPrice: number;
  tokens: TokenBalance[];
  lastUpdated: number;
}

private async fetchPortfolioData(): Promise<PortfolioData> {
  const cacheKey = 'portfolio_data';
  const cached = this.cache.get(cacheKey);
  
  // Return cached data if fresh (2 minutes)
  if (cached && Date.now() - cached.timestamp < 120000) {
    return cached.data;
  }

  try {
    // Fetch from Birdeye API
    const response = await fetch(
      `https://api.birdeye.so/v1/wallet/portfolio?wallet=${this.keypair.publicKey.toBase58()}`,
      {
        headers: {
          'X-API-KEY': this.runtime.getSetting('BIRDEYE_API_KEY')
        }
      }
    );

    const data = await response.json();
    
    // Process and cache
    const portfolioData = this.processPortfolioData(data);
    this.cache.set(cacheKey, {
      data: portfolioData,
      timestamp: Date.now()
    });

    return portfolioData;
  } catch (error) {
    elizaLogger.error('Failed to fetch portfolio data:', error);
    return cached?.data || this.getEmptyPortfolio();
  }
}
```

### Transaction Building

Optimized transaction construction with priority fees:

```typescript
async function buildTransferTransaction(
  connection: Connection,
  sender: PublicKey,
  recipient: PublicKey,
  amount: number,
  token?: string
): Promise<Transaction> {
  const transaction = new Transaction();
  
  // Add priority fee for faster processing
  const priorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1000 // 0.001 SOL per compute unit
  });
  transaction.add(priorityFee);

  if (!token || token.toUpperCase() === 'SOL') {
    // Native SOL transfer
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: amount * LAMPORTS_PER_SOL
      })
    );
  } else {
    // SPL token transfer
    const mint = await resolveTokenMint(connection, token);
    const senderAta = await getAssociatedTokenAddress(mint, sender);
    const recipientAta = await getAssociatedTokenAddress(mint, recipient);
    
    // Check if recipient ATA exists
    const recipientAccount = await connection.getAccountInfo(recipientAta);
    if (!recipientAccount) {
      // Create ATA for recipient
      transaction.add(
        createAssociatedTokenAccountInstruction(
          sender,
          recipientAta,
          recipient,
          mint
        )
      );
    }
    
    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
```