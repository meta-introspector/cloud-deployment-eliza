# a7046c18:packages_docs_plugin-registry_defi_evm_complete-documentation.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/defi/evm/complete-documentation.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
};
```

### Providers

#### Wallet Provider

Supplies wallet balance information across all chains:

```typescript
export const walletProvider: Provider = {
  name: 'evmWalletProvider',
  
  get: async (runtime: IAgentRuntime) => {
    const service = runtime.getService<EVMService>('evm-service');
    const data = await service.getCachedData();
    
    if (!data?.walletInfo) return null;
    
    // Format balance information
    const balances = data.walletInfo.chains
      .map(chain => `${chain.name}: ${chain.nativeBalance} ${chain.symbol}`)
      .join('\n');
    
    return `Wallet balances:\n${balances}\n\nTotal value: $${data.walletInfo.totalValueUsd}`;
  }
};
```

#### Token Balance Provider

Dynamic provider for checking specific token balances:

```typescript
export const tokenBalanceProvider: Provider = {
  name: 'evmTokenBalance',
  
  get: async (runtime: IAgentRuntime, message: Memory) => {
    const tokenAddress = extractTokenAddress(message);
    const chain = extractChain(message);
    
    const balance = await getTokenBalance(
      runtime,
      tokenAddress,
      chain
    );
    
    return `Token balance: ${balance}`;
  }
};
```

### Templates

AI prompt templates for parameter extraction:

```typescript
export const transferTemplate = `Given the recent messages and wallet information:

{{recentMessages}}

{{walletInfo}}

Extract the transfer details:
- Amount to transfer (number only)
- Recipient address or ENS name
- Token symbol (or 'native' for ETH/BNB/etc)
- Chain name

Respond with:
<response>
  <amount>string | null</amount>
  <toAddress>string | null</toAddress>
  <token>string | null</token>
  <chain>string | null</chain>
</response>`;
```

## Chain Configuration

The plugin supports dynamic chain configuration:

```typescript
interface ChainConfig {
  chainId: number;
  name: string;
  chain: Chain;
  rpcUrl: string;
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
  walletClient?: WalletClient;
  publicClient?: PublicClient;
}

// Chains are configured based on environment variables
const configureChains = (runtime: IAgentRuntime): ChainConfig[] => {
  const chains: ChainConfig[] = [];
  
  // Check for custom RPC endpoints
  Object.entries(viemChains).forEach(([name, chain]) => {
    const customRpc = runtime.getSetting(`ETHEREUM_PROVIDER_${name.toUpperCase()}`);
    
    chains.push({
      chainId: chain.id,
      name: chain.name,
      chain,
      rpcUrl: customRpc || chain.rpcUrls.default.http[0],
      nativeCurrency: chain.nativeCurrency
    });
  });
  
  return chains;
};
```

## Token Resolution

The plugin automatically resolves token symbols to addresses:

```typescript
async function resolveTokenAddress(
  symbol: string,
  chainId: number
): Promise<Address> {
  // Check common tokens first
  const commonTokens = {
    'USDC': {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      // ... other chains
    },
    'USDT': {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      // ... other chains
    }
  };
  
  if (commonTokens[symbol]?.[chainId]) {
    return commonTokens[symbol][chainId];
  }
  
  // Fallback to LiFi token list
  const tokens = await lifi.getTokens({ chainId });
  const token = tokens.find(t => 
    t.symbol.toLowerCase() === symbol.toLowerCase()
  );
  
  if (!token) {
```