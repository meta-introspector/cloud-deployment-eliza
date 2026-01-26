# a7046c18:packages_docs_runtime_types-reference.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/types-reference.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Types Reference"
description: "Complete TypeScript types and interfaces reference for elizaOS"
---

## Overview

This page documents the core TypeScript types and interfaces used throughout elizaOS. For usage examples, see the relevant feature documentation.

<Tip>
All types are exported from `@elizaos/core`. Import what you need:
```typescript
import { Memory, Action, State, UUID } from '@elizaos/core';
```
</Tip>

---

## Streaming Types

### IStreamExtractor

Interface for extracting content from LLM response streams:

```typescript
interface IStreamExtractor {
  // True when stream processing is complete
  readonly done: boolean;

  // Process a chunk and return streamable text
  push(chunk: string): string;
}
```

**Built-in Extractors:**

| Extractor | Use Case |
|-----------|----------|
| `PassthroughExtractor` | Stream everything as-is |
| `XmlTagExtractor` | Extract content from XML tags |
| `ResponseStreamExtractor` | Action-aware extraction |

**Example:**

```typescript
import { XmlTagExtractor } from '@elizaos/core';

const extractor = new XmlTagExtractor('response');
const streamable = extractor.push('<response>Hello');
// streamable = 'Hello'
```

---

## Task System

### TaskWorker

Interface for background task handlers:

```typescript
interface TaskWorker {
  // Task type identifier
  name: string;

  // Execution logic
  execute(
    runtime: IAgentRuntime,
    options: Record<string, unknown>,
    task: Task
  ): Promise<void>;

  // Optional validation before execution
  validate?(
    runtime: IAgentRuntime,
    message: Memory,
    state?: State
  ): Promise<boolean>;
}
```

### Task

```typescript
interface Task {
  id: UUID;
  name: string;
  description?: string;
  roomId?: UUID;
  worldId?: UUID;
  entityId?: UUID;
  tags?: string[];
  updatedAt?: number;
  metadata?: TaskMetadata;
}
```

### TaskMetadata

```typescript
interface TaskMetadata {
  // Recurring task interval in milliseconds
  updateInterval?: number;

  // UI configuration options
  options?: Record<string, unknown>;
}
```

**Example - Recurring Task:**

```typescript
const cleanupWorker: TaskWorker = {
  name: 'CLEANUP_OLD_MESSAGES',

  async execute(runtime, options, task) {
    const threshold = Date.now() - (24 * 60 * 60 * 1000);
    await runtime.deleteOldMessages(threshold);
  }
};

// Register worker
runtime.registerTaskWorker(cleanupWorker);

// Create recurring task (runs every hour)
await runtime.createTask({
  name: 'CLEANUP_OLD_MESSAGES',
  metadata: { updateInterval: 3600000 }
});
```

---

## State & Context

### State

```typescript
interface State {
  // General state variables
  values: Record<string, unknown>;

  // Structured cache for common properties
  data: StateData;

  // Text summary of context
  text: string;

  // Dynamic properties
  [key: string]: unknown;
```