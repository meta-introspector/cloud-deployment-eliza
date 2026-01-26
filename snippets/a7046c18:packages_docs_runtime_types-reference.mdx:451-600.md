# a7046c18:packages_docs_runtime_types-reference.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/types-reference.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
### Vector Dimensions

```typescript
const VECTOR_DIMS = {
  SMALL: 384,    // MiniLM
  MEDIUM: 512,
  LARGE: 768,    // BERT-base
  XL: 1024,
  XXL: 1536,     // OpenAI ada-002
  XXXL: 3072,    // OpenAI text-embedding-3-large
} as const;
```

---

## TEE Types

### TEEMode

Trusted Execution Environment modes:

```typescript
enum TEEMode {
  OFF = 'OFF',               // No TEE
  LOCAL = 'LOCAL',           // Local simulation
  DOCKER = 'DOCKER',         // Docker-based TEE
  PRODUCTION = 'PRODUCTION', // Real hardware TEE
}
```

### TeeAgent

TEE agent registration:

```typescript
interface TeeAgent {
  id: string;
  agentId: string;
  agentName: string;
  createdAt: number;
  publicKey: string;
  attestation: string;  // Attestation document as string
}
```

### RemoteAttestationQuote

```typescript
interface RemoteAttestationQuote {
  quote: string;
  timestamp: number;
  mrEnclave?: string;
  mrSigner?: string;
}
```

### TeePluginConfig

```typescript
interface TeePluginConfig {
  mode: TEEMode;
  vendor?: string;
  vendorConfig?: Record<string, unknown>;
}
```

---

## ElizaOS Orchestrator

### IElizaOS

Multi-agent orchestrator interface:

```typescript
interface IElizaOS {
  // Handle single message (sync or async mode)
  handleMessage(
    agentId: UUID | IAgentRuntime,
    message: Message,
    options?: HandleMessageOptions
  ): Promise<HandleMessageResult>;

  // Handle messages to multiple agents
  handleMessages(
    messages: Array<{ agentId: UUID; message: Message }>
  ): Promise<HandleMessageResult[]>;

  // Get agent runtime by ID
  getAgent(agentId: UUID): IAgentRuntime | undefined;

  // Get all agents
  getAgents(): Map<UUID, IAgentRuntime>;
}
```

### HandleMessageOptions

```typescript
interface HandleMessageOptions {
  // Callbacks for async mode
  onResponse?: (content: Content) => Promise<void>;
  onStreamChunk?: (chunk: string, messageId: UUID) => Promise<void>;
  onError?: (error: Error) => Promise<void>;
  onComplete?: () => Promise<void>;

  // Processing options
  skipEvaluators?: boolean;
  skipActions?: boolean;
}
```

### HandleMessageResult

```typescript
interface HandleMessageResult {
  messageId: UUID;
  userMessage: Memory;
  processing?: {
    text: string;
    actions?: ActionResult[];
    evaluations?: unknown[];
  };
  error?: Error;
}
```

### HealthStatus

```typescript
interface HealthStatus {
  alive: boolean;
  responsive: boolean;
  memoryUsage?: number;
  uptime?: number;
  lastActivity?: number;
}
```

---

## Model Types

### TokenUsage

```typescript
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
```