# a7046c18:packages_docs_plugin-registry_defi_solana_testing-guide.mdx:1-120

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/defi/solana/testing-guide.mdx:1-120
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Testing Guide"
description: "How to test the Solana plugin safely on mainnet"
---

## Testing Philosophy

Test with small amounts on mainnet. Solana devnet/testnet tokens have no value and often have different behavior than mainnet.

## Safe Testing Practices

### 1. Start Small

Test with minimal amounts:
- 0.001 SOL for transfers (~$0.20)
- $1-5 worth of tokens for swaps
- Use common tokens (USDC, USDT) for reliability

### 2. Transaction Costs

Solana transactions are cheap (~$0.00025 per transaction), making mainnet testing affordable.

### 3. Progressive Testing

```
1. Check wallet connection
2. Test SOL transfers
3. Test SPL token transfers  
4. Test small swaps
5. Test larger operations
```

## Testing Checklist

### Environment Setup

```env
# Use a dedicated test wallet
SOLANA_PRIVATE_KEY=test_wallet_private_key

# Optional - Use premium RPC for reliability
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
```

### Basic Tests

1. **Wallet Connection**
   ```
   User: What's my wallet address?
   Agent: [Should show your Solana address]
   ```

2. **Balance Check**
   ```
   User: What's my balance?
   Agent: [Should show SOL balance and token holdings]
   ```

3. **Small SOL Transfer**
   ```
   User: Send 0.001 SOL to [another address]
   Agent: [Should execute the transfer]
   ```

4. **Token Transfer**
   ```
   User: Send 1 USDC to [test address]
   Agent: [Should handle SPL token transfer]
   ```

### Swap Testing

Test swaps with small amounts:
```
User: Swap 0.1 SOL for USDC
Agent: [Should execute via Jupiter]
```

### Portfolio Tracking

```
User: What's my portfolio worth?
Agent: [Should show total USD value and token breakdown]
```

## Monitoring Results

1. **Transaction Verification**
   - Check on Solscan.io or Solana Explorer
   - Verify transaction succeeded
   - Confirm balance changes

2. **Common Token Addresses**
   - USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
   - USDT: Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
   - Use these for testing as they're widely supported

## Common Issues

### "Insufficient SOL for fees"
- Need ~0.001 SOL for transaction fees
- Keep some SOL for rent and fees

### "Token account doesn't exist"
- First transfer to a new token creates the account
- Costs ~0.002 SOL for account creation

### "Slippage tolerance exceeded"
- Increase slippage for volatile tokens
- Try smaller amounts

## Production Readiness

Before production use:
1. Test all operations you plan to use
2. Verify error handling
3. Test with your expected token types
4. Monitor transaction success rates
5. Set appropriate slippage (1-3% typical)
6. Ensure adequate SOL for fees
```