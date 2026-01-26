# a7046c18:packages_docs_guides_tee-integration.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/tee-integration.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: 'TEE Integration'
description: 'Hardware-level security for agents that handle sensitive data'
---

## Why TEE?

Your agent handles API keys, user data, maybe crypto wallets. How do users know you're not logging their secrets?

**TEE (Trusted Execution Environment)** provides cryptographic proof that your code runs exactly as published - no modifications, no backdoors. Users can verify your agent's integrity before trusting it.

<Tip>
**TEE is optional.** Most agents don't need it. Use TEE when you need to prove trustworthiness to users who can't just take your word for it.
</Tip>

## What TEE Gives You

TEE integration allows your ElizaOS agents to run in secure enclaves with:

- **Remote attestation**: Cryptographic proof of code integrity
- **Secure key derivation**: Keys derived within the enclave
- **Verifiable execution**: Third parties can verify agent behavior

## TEE Modes

```typescript
enum TEEMode {
  OFF = 'OFF',           // TEE disabled
  LOCAL = 'LOCAL',       // Local development with simulator
  DOCKER = 'DOCKER',     // Docker development with simulator
  PRODUCTION = 'PRODUCTION' // Production with real TEE hardware
}
```

## Quick Start

### 1. Use the TEE Starter Project

```bash
elizaos create --type project --template tee my-tee-agent
cd my-tee-agent
```

### 2. Configure TEE Settings

```env .env
TEE_MODE=LOCAL
TEE_VENDOR=phala
WALLET_SECRET_SALT=your-secret-salt-min-8-chars
```

### 3. Start in TEE Mode

```bash
elizaos start
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TEE_MODE` | `OFF`, `LOCAL`, `DOCKER`, or `PRODUCTION` | Yes |
| `TEE_VENDOR` | TEE provider (`phala`) | Yes |
| `WALLET_SECRET_SALT` | Secret for key derivation (8-128 chars) | Yes |

### Character Configuration

```typescript
export const character: Character = {
  name: 'SecureAgent',
  plugins: [
    '@elizaos/plugin-tee',  // Add TEE plugin
  ],
  settings: {
    secrets: {
      TEE_MODE: 'PRODUCTION',
      TEE_VENDOR: 'phala',
      WALLET_SECRET_SALT: process.env.WALLET_SECRET_SALT,
    }
  }
};
```

## TEE Types

### TeeAgent

Represents an agent registered in the TEE:

```typescript
interface TeeAgent {
  id: string;              // Registration record ID
  agentId: string;         // Core agent identifier
  agentName: string;       // Human-readable name
  createdAt: number;       // Registration timestamp
  publicKey: string;       // TEE instance public key
  attestation: string;     // Attestation document
}
```

### Remote Attestation

```typescript
interface RemoteAttestationQuote {
  quote: string;           // Base64-encoded attestation quote
  timestamp: number;       // Quote generation time
}

interface RemoteAttestationMessage {
  agentId: string;
  timestamp: number;
  message: {
    entityId: string;
    roomId: string;
    content: string;
  };
}

interface DeriveKeyAttestationData {
  agentId: string;
  publicKey: string;
  subject?: string;
}
```

## TEE Providers

ElizaOS supports multiple TEE providers. See the [TEE CLI Reference](/cli-reference/tee) for complete deployment commands.

### Phala Network

Primary TEE provider using Intel TDX:

```bash
# Login to Phala Cloud
elizaos tee phala auth login <api-key>

# Deploy to Phala
elizaos tee phala cvms create --name my-agent --compose ./docker-compose.yml

# Check status
elizaos tee phala cvms list
```

### Eigen Infrastructure

```bash
elizaos tee eigen deploy
```