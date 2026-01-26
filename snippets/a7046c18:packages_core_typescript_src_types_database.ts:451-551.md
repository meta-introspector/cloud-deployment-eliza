# a7046c18:packages_core_typescript_src_types_database.ts:451-551

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/database.ts:451-551
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  deleteCache(key: string): Promise<boolean>;

  // Only task instance methods - definitions are in-memory
  createTask(task: Task): Promise<UUID>;
  getTasks(params: {
    roomId?: UUID;
    tags?: string[];
    entityId?: UUID;
  }): Promise<Task[]>;
  getTask(id: UUID): Promise<Task | null>;
  getTasksByName(name: string): Promise<Task[]>;
  updateTask(id: UUID, task: Partial<Task>): Promise<void>;
  deleteTask(id: UUID): Promise<void>;

  getMemoriesByWorldId(params: {
    worldId: UUID;
    count?: number;
    tableName?: string;
  }): Promise<Memory[]>;
}

/**
 * Result interface for embedding similarity searches
 */
export interface EmbeddingSearchResult {
  embedding: number[];
  levenshtein_score: number;
}

/**
 * Options for memory retrieval operations
 */
export interface MemoryRetrievalOptions {
  roomId: UUID;
  count?: number;
  unique?: boolean;
  start?: number;
  end?: number;
  agentId?: UUID;
}

/**
 * Options for memory search operations
 */
export interface MemorySearchOptions {
  embedding: number[];
  match_threshold?: number;
  count?: number;
  roomId: UUID;
  agentId?: UUID;
  unique?: boolean;
  metadata?: Partial<MemoryMetadata>;
}

/**
 * Options for multi-room memory retrieval
 */
export interface MultiRoomMemoryOptions {
  roomIds: UUID[];
  limit?: number;
  agentId?: UUID;
}

/**
 * Unified options pattern for memory operations
 * Provides a simpler, more consistent interface
 */
export interface UnifiedMemoryOptions {
  roomId: UUID;
  limit?: number; // Unified naming (replacing 'count')
  agentId?: UUID; // Common optional parameter
  unique?: boolean; // Common flag for duplication control
  start?: number; // Pagination start
  end?: number; // Pagination end
}

/**
 * Specialized memory search options
 */
export interface UnifiedSearchOptions extends UnifiedMemoryOptions {
  embedding: number[];
  similarity?: number; // Clearer name than 'match_threshold'
}

/**
 * Represents a generic database connection object.
 * The actual type of this connection will depend on the specific database adapter implementation
 * (e.g., a connection pool object for PostgreSQL, a client instance for a NoSQL database).
 * This `unknown` type serves as a placeholder in the abstract `IDatabaseAdapter`.
 */
export type DbConnection = unknown;

// Allowable vector dimensions
export const VECTOR_DIMS = {
  SMALL: 384,
  MEDIUM: 512,
  LARGE: 768,
  XL: 1024,
  XXL: 1536,
  XXXL: 3072,
} as const;
```