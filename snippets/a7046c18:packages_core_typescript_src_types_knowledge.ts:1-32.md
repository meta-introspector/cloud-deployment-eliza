# a7046c18:packages_core_typescript_src_types_knowledge.ts:1-32

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/knowledge.ts:1-32
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { MemoryMetadata } from "./memory";
import type { Content, UUID } from "./primitives";

/**
 * Represents a single item of knowledge that can be processed and stored by the agent.
 * Knowledge items consist of content (text and optional structured data) and metadata.
 * These items are typically added to the agent's knowledge base via `AgentRuntime.addKnowledge`
 * and retrieved using `AgentRuntime.getKnowledge`.
 * The `id` is a unique identifier for the knowledge item, often derived from its source or content.
 */
export type KnowledgeItem = {
  /** A Universally Unique Identifier for this specific knowledge item. */
  id: UUID;
  /** The actual content of the knowledge item, which must include text and can have other fields. */
  content: Content;
  /** Optional metadata associated with this knowledge item, conforming to `MemoryMetadata`. */
  metadata?: MemoryMetadata;
};

/**
 * Represents an item within a directory listing, specifically for knowledge loading.
 * When an agent's `Character.knowledge` configuration includes a directory, this type
 * is used to specify the path to that directory and whether its contents should be treated as shared.
 * - `directory`: The path to the directory containing knowledge files.
 * - `shared`: An optional boolean (defaults to false) indicating if the knowledge from this directory is considered shared or private.
 */
export interface DirectoryItem {
  /** The path to the directory containing knowledge files. */
  directory: string;
  /** If true, knowledge from this directory is considered shared; otherwise, it's private. Defaults to false. */
  shared?: boolean;
}
```