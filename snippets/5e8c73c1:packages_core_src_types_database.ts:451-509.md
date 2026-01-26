# 5e8c73c1:packages_core_src_types_database.ts:451-509

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/types/database.ts:451-509
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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