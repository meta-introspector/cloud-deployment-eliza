# a7046c18:packages_docs_plugin-registry_defi_solana_examples.mdx:1-143

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/defi/solana/examples.mdx:1-143
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Examples"
description: "Practical examples for configuring and using the Solana plugin"
---

## Configuration

### Character Configuration

Add the Solana plugin to your character file:

```typescript
// character.ts
import { type Character } from '@elizaos/core';

export const character: Character = {
  name: 'SolanaAgent',
  plugins: [
    // Core plugins
    '@elizaos/plugin-sql',
    '@elizaos/plugin-bootstrap',
    
    // Solana plugin
    ...(process.env.SOLANA_PRIVATE_KEY?.trim() ? ['@elizaos/plugin-solana'] : []),
    
    // Platform plugins
    ...(process.env.DISCORD_API_TOKEN?.trim() ? ['@elizaos/plugin-discord'] : []),
  ],
  settings: {
    secrets: {},
  },
  // ... rest of character configuration
};
```

### Environment Variables

```env
# Required - Choose one:
SOLANA_PRIVATE_KEY=your_base58_private_key_here
# OR for read-only mode:
SOLANA_PUBLIC_KEY=your_public_key_here

# Optional - Enhanced RPC
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
HELIUS_API_KEY=your_helius_key

# Optional - Market data
BIRDEYE_API_KEY=your_birdeye_key
```

## Usage Examples

### Transfer Operations

The agent understands natural language for transfers:

```
User: Send 1 SOL to 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Agent: I'll send 1 SOL to that address right away.

User: Transfer 100 USDC to alice.sol
Agent: Transferring 100 USDC to alice.sol.

User: Pay bob 50 BONK tokens
Agent: Sending 50 BONK to bob.
```

### Swap Operations

```
User: Swap 10 SOL for USDC
Agent: I'll swap 10 SOL for USDC using Jupiter.

User: Exchange all my BONK for SOL
Agent: Swapping all your BONK tokens for SOL.

User: Trade 100 USDC for JTO with 2% slippage
Agent: Swapping 100 USDC for JTO with 2% slippage tolerance.
```

### Portfolio Management

```
User: What's my wallet balance?
Agent: [Shows total portfolio value and individual token balances]

User: How much is my portfolio worth?
Agent: Your total portfolio value is $X,XXX.XX (XX.XX SOL)
```

## Custom Plugin Integration

If you need to import the plugin directly in a ProjectAgent:

```typescript
// index.ts
import { type ProjectAgent } from '@elizaos/core';
import solanaPlugin from '@elizaos/plugin-solana';
import { character } from './character';

export const projectAgent: ProjectAgent = {
  character,
  plugins: [solanaPlugin], // Import custom plugins here
  init: async (runtime) => {
    // Custom initialization if needed
  }
};
```

## Common Patterns

### Domain Name Resolution

The plugin automatically resolves .sol domains:

```
User: Send 5 SOL to vitalik.sol
Agent: Sending 5 SOL to vitalik.sol [resolves to actual address]
```

### Token Symbol Resolution

Common tokens are automatically recognized:

```
User: Send 100 USDC to alice
Agent: [Recognizes USDC token mint and handles transfer]
```

### All Balance Swaps

```
User: Swap all my BONK for USDC
Agent: [Calculates max balance and executes swap]
```

### Slippage Control

```
User: Swap with 0.5% slippage
Agent: [Sets custom slippage for the swap]
```
```