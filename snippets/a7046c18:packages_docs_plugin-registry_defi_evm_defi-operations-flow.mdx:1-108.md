# a7046c18:packages_docs_plugin-registry_defi_evm_defi-operations-flow.mdx:1-108

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/defi/evm/defi-operations-flow.mdx:1-108
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Operations Flow"
description: "How DeFi operations work in the EVM plugin"
---

## Overview

The EVM plugin handles DeFi operations through a structured flow:

```
User Message → Action Recognition → Parameter Extraction → Execution → Response
```

## Transfer Flow

### 1. User Intent
```
User: Send 0.1 ETH to alice.eth
```

### 2. Action Recognition
The plugin identifies this as a transfer action based on keywords (send, transfer, pay).

### 3. Parameter Extraction
Using AI, the plugin extracts:
- Amount: 0.1
- Token: ETH
- Recipient: alice.eth (will resolve to address)
- Chain: Detected from context or defaults

### 4. Execution
- Validates recipient address
- Checks balance
- Builds transaction
- Estimates gas
- Sends transaction
- Waits for confirmation

### 5. Response
```
Agent: Successfully transferred 0.1 ETH to alice.eth
Transaction: https://etherscan.io/tx/[hash]
```

## Swap Flow

### 1. User Intent
```
User: Swap 1 ETH for USDC
```

### 2. Route Discovery
- Queries multiple DEX aggregators (LiFi, Bebop)
- Compares routes for best output
- Considers gas costs

### 3. Execution
- Approves token if needed
- Executes swap transaction
- Monitors for completion

## Bridge Flow

### 1. User Intent
```
User: Bridge 100 USDC from Ethereum to Base
```

### 2. Bridge Route
- Finds available bridge routes
- Estimates fees and time
- Selects optimal path

### 3. Multi-Step Execution
- Source chain transaction
- Wait for bridge confirmation
- Destination chain completion

## Governance Flow

### Proposal Creation
```
User: Create a proposal to increase treasury allocation
→ Plugin creates proposal transaction with targets, values, and description
```

### Voting
```
User: Vote FOR on proposal 42
→ Plugin casts vote with correct proposal ID and support value
```

## Error Handling

The plugin handles common errors gracefully:

- **Insufficient Balance**: Checks before attempting transaction
- **Network Issues**: Retries with exponential backoff
- **Invalid Addresses**: Validates all addresses before use
- **High Slippage**: Warns user if slippage exceeds tolerance

## Key Features

1. **Natural Language Processing**: Understands various ways to express intents
2. **Multi-Chain Support**: Automatically handles chain selection
3. **Gas Optimization**: Estimates and optimizes gas usage
4. **Safety Checks**: Validates all parameters before execution
5. **Real-Time Feedback**: Provides transaction status updates
```